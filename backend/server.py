from flask import Flask, request, jsonify
from functools import wraps,reduce
from flaskext.mysql import MySQL
from elasticsearch import Elasticsearch
import configparser
import bcrypt
import jwt
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
mysql = MySQL()
cf = configparser.ConfigParser()
cf.read("./env.config")  # Read configuration file
_database = cf.get("Database", "database")
_host = cf.get("Database", "host")
_user = cf.get("Database", "user")
_pwd = cf.get("Database", "pwd")
_port = cf.get("Database", "port")
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = _user
app.config['MYSQL_DATABASE_PASSWORD'] = _pwd
app.config['MYSQL_DATABASE_DB'] = _database
app.config['MYSQL_DATABASE_HOST'] = _host
app.config['MYSQL_DATABASE_PORT'] = int(_port)
mysql.init_app(app)
es = Elasticsearch([{'host': "localhost", 'port': 9200}], timeout=30)
app.secret_key = 'health++'

def mapper(item):
    if item:
        return [{
            '_index': 'dcths',
            "dcthsid":item[0],
            "name":item[1],
            "phone":item[2],
            "state":item[3],
            "city":item[4],
            "price":item[5]
        }]
from elasticsearch import helpers
def ingestdata():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        cursor.execute("SELECT * FROM DctHs")
        data = list(cursor.fetchall())
        res=map(mapper,data)
        res=reduce(lambda x,y : x+y,res)
        doc={
          "mappings": {
            "properties": {
              "dcthsid": { "type": 'integer' },
              "name": { "type": 'keyword' },
              "phone": { "type": 'integer' },
              "city": { "type": 'keyword' },
              "state": { "type": 'keyword' },
              "Price": { "type": 'integer' }
            }
          }
        }
        es.indices.delete(index="dcths")
        print("deleted the index")
        es.indices.create(index='dcths',body=doc)
        resp = helpers.bulk(es, res, chunk_size=1000, request_timeout=200)
        print("created index")

    except Exception as e:
        print(e)
    finally:
        cursor.close()
        con.close()

def loginrequired(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            if request.method =="POST":
                decoded = jwt.decode(request.json["token"],
                             "secret", algorithms=["HS256"])
            elif request.method =="GET":
                decoded=jwt.decode(request.args.get("token"),"secret",algorithms=["HS256"])
            if decoded['userid'] is not None:
                return f(*args, **kwargs)
        except:
            return jsonify({"msg": "Internal Server Error"}), 500
    return decorated_function

@app.route("/")
def main():
    ingestdata()
    return jsonify({"msg": "hello"})

@app.route("/api/v1/users/login", methods=["POST"])
def login():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        email = request.json['email']
        password = request.json['password'].encode('utf-8')
        cursor.execute("SELECT * FROM users WHERE email = %s", (email))
        data = cursor.fetchall()
        if len(data) > 0:
            if bcrypt.checkpw(password, str(data[0][3]).encode('utf-8')):
                token = jwt.encode(
                        {"userid": data[0][0]}, "secret", algorithm="HS256")
                return jsonify({"token": token, "userid": data[0][0], "name": data[0][1]}), 200
            else:
                return jsonify({"msg": "wrong password"}), 401
        else:
            return jsonify({"msg": "wrong email"}), 401
    except Exception as e:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()
@app.route("/api/v1/users/adminlogin", methods=["POST"])
def adminlogin():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        email = request.json['email']
        password = request.json['password']
        print(email,password)
        if email=="admin@gmail.com" and password == "admin1234$":
            token = jwt.encode({"userid": "admin"}, "secret", algorithm="HS256")
            return jsonify({"token": token}), 200
        else:
            return jsonify({"msg": "wrong email or password"}), 401
    except Exception as e:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()
@app.route("/api/v1/users/signup", methods=["POST"])
def users():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        email = request.json["email"]
        password = request.json["password"].encode('utf-8')
        name = request.json["name"]
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        cursor.execute("INSERT INTO users(name,email,password) VALUES (%s,%s,%s)",
                           (name, email, hashed))
        data = cursor.fetchall()
        if len(data) == 0:
            con.commit()
            cursor.execute("SELECT * FROM users WHERE email = %s", (email))
            data = cursor.fetchall()
            token = jwt.encode(
                    {"userid": data[0][0]}, "secret", algorithm="HS256")
            return jsonify({"token": token, "userid": data[0][0], "name": data[0][1]}), 200
        else:
            return jsonify({"msg": "Internal Server Error"}), 500
    except Exception as e:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()
@app.route("/api/v1/dcths/dp", methods=["GET", "POST"])
@loginrequired
def dpdcths():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            dcthsid = request.args.get("dcthsid")
            cursor.execute("DELETE FROM DctHs WHERE dcthsid=%s", (dcthsid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "deleted Doctor Hospital"}), 204
        elif request.method == "POST":
            name = request.json["name"]
            phone = request.json["phone"]
            state = request.json["state"]
            city = request.json["city"]
            price = request.json["price"]
            dcthsid = request.json["dcthsid"]
            cursor.execute("UPDATE DctHs SET name=%s,phone=%s,state=%s,city=%s,price=%s WHERE dcthsid=%s",(name,phone,state,city,price,dcthsid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Doctor Hospital Updated"}), 204
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


@app.route("/api/v1/dcths", methods=["GET", "POST"])
@loginrequired
def dcths():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            cursor.execute("SELECT * FROM DctHs")
            data = cursor.fetchall()
            return jsonify(data), 200
        elif request.method == "POST":
            name = request.json["name"]
            phone = request.json["phone"]
            state = request.json["state"]
            city = request.json["city"]
            price = request.json["price"]
            cursor.execute("INSERT INTO DctHs(name, phone, state, city, price) VALUES (%s,%s,%s,%s,%s)",
                           (name, phone, state, city, price))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Doctor Hospital Created"}), 201
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


@app.route("/api/v1/visitlist/", methods=['GET', 'POST'])
@loginrequired
def visitlist():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            userid = request.args.get("userid")
            cursor.execute(
                "SELECT * FROM VisitList v INNER JOIN DctHs d ON d.dcthsid = v.dcthsid  WHERE v.userid = %s and v.del=0", (userid))
            data = cursor.fetchall()
            return jsonify({"vlist":data}), 200
        elif request.method == "POST":
            userid = request.json["userid"]
            dcthsid = request.json["dcthsid"]
            cursor.execute(
                "DELETE FROM VisitList WHERE dcthsid=%s AND userid=%s", (dcthsid, userid))
            cursor.fetchall()
            cursor.execute("INSERT INTO VisitList(userid, dcthsid,del) VALUES (%s,%s,%s)",
                           (userid, dcthsid,0))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Added to the list"}), 201
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()
@app.route("/api/v1/visitlist/delete", methods=['GET'])
@loginrequired
def deletevisitlist():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        dcthsid = request.args.get("dcthsid")
        userid = request.args.get("userid")
        print(dcthsid,userid)
        cursor.execute(
                "UPDATE VisitList SET del=1 WHERE dcthsid=%s AND userid=%s", (dcthsid, userid))
        data = cursor.fetchall()
        if len(data) == 0:
            con.commit()
            return jsonify({"msg": "deleted item from the list"}), 200
    except:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


@app.route("/api/v1/claims/dp", methods=["GET","POST"])
@loginrequired
def dpclaims():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            claimid = request.args.get("claimid")
            cursor.execute(
                "DELETE FROM Claims WHERE claimid=%s", (claimid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "deleted claim"}), 204
        elif request.method == "POST":
            claimid = request.json["claimid"]
            price = request.json["price"]
            cursor.execute("UPDATE Claims SET price=%s WHERE claimid=%s",(price,claimid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "updated claim"}), 204
            else:
                return jsonify({"msg": "Internal Server Error"}), 500
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()

@app.route("/api/v1/claims", methods=["GET", "POST"])
@loginrequired
def claims():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            userid = request.args.get("userid")
            cursor.execute(
                "SELECT * FROM Claims WHERE userid = %s", (userid))
            data = list(cursor.fetchall())
            return jsonify({"claims":data}), 200
        elif request.method == "POST":
            userid = request.json["userid"]
            dcthsid = request.json["dcthsid"]
            price = request.json["price"]
            cursor.execute("INSERT INTO Claims(userid,dcthsid,price) VALUES (%s,%s,%s)",
                           (userid, dcthsid, price))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Added Claim"}), 201
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


@app.route("/api/v1/transactions/dp", methods=["GET", "POST"])
@loginrequired
def dptransactions():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            transactionid = request.args.get("transactionid")
            cursor.execute(
                "DELETE FROM Transactions WHERE transactionid=%s", (transactionid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "deleted Transaction"}), 204
        elif request.method == "POST":
            transactionid = request.json["transactionid"]
            price = request.json["price"]
            cursor.execute("UPDATE Transactions SET price=%s WHERE transactionid=%s",(price,transactionid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "updated transaction"}), 204
            else:
                return jsonify({"msg": "Internal Server Error"}), 500
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()    

@app.route("/api/v1/transactions", methods=["GET", "POST"])
@loginrequired
def transactions():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            userid = request.args.get("userid")
            cursor.execute(
                "SELECT * FROM Transactions WHERE userid = %s", (userid))
            data = list(cursor.fetchall())
            return jsonify({"transactions":data}), 200
        elif request.method == "POST":
            userid = request.json["userid"]
            price = request.json["price"]
            cursor.execute("INSERT INTO Transactions(userid,price) VALUES (%s,%s)",
                           (userid, price))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Added Transaction"}), 201
        elif request.method == 'DELETE':
            userid = request.json["userid"]
            cursor.execute(
                "DELETE FROM Transactions WHERE userid=%s", (userid))
            data = cursor.fetchall()
            if len(data) == 0:
                return jsonify({"msg": "deleted claim"}), 200
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()

@app.route("/api/v1/search",methods=["GET"])
def search():
    query = request.args.get("query")
    gte = request.args.get("gte")
    lte = request.args.get("lte")
    rp = es.search(index='dcths',
        body={
            "aggs": {
            "Price_Filter": {
              "range": {
                "field": "price",
                "ranges": [
                  {
                    "from": 100,
                    "to": 200
                  },
                  {
                    "from": 200,
                    "to": 300
                  },
                  {
                    "from": 300,
                    "to": 400
                  }                  
                ]
              }
            }
          },
          "query":{
            "bool": {
              "filter": [
                {"range": {
                  "price": {
                    "gte": gte,
                    "lte": lte
                  }
                }}
              ], 
              "must": [
                {"multi_match": {
                  "query": query,
                  "fields": ["name","city","state"]
                }}
              ],
            } 
          }
        }
    )
    return jsonify(rp),200


if __name__ == "__main__":
    app.run()
