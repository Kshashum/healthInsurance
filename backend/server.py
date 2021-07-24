from flask import Flask, request, jsonify
from functools import wraps
from flaskext.mysql import MySQL
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
app.secret_key = 'health++'


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


@app.route("/api/v1/dcths", methods=["GET", "POST", "DELETE"])
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
            price = request.json["city"]
            cursor.execute("INSERT INTO DctHs(name, phone, state, city, price) VALUES (%s,%s,%s,%s,%s)",
                           (name, phone, state, city, price))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Doctor Hospital Created"}), 201
        elif request.method == 'DELETE':
            dcthsid = request.json["dcthsid"]
            cursor.execute("DELETE FROM DctHs WHERE dcthsid=%s", (dcthsid))
            data = cursor.fetchall()
            if len(data) == 0:
                return jsonify({"msg": "deleted Doctor Hospital"}), 200
    except:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


@app.route("/api/v1/visitlist/", methods=['GET', 'POST'])
def visitlist():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        print(request)
        if request.method == 'GET':
            userid = request.args.get("userid")
            cursor.execute(
                "SELECT * FROM VisitList v INNER JOIN DctHs d ON d.dcthsid = v.dcthsid  WHERE v.userid = %s", (userid))
            data = cursor.fetchall()
            return jsonify({"vlist":data}), 200
        elif request.method == "POST":
            userid = request.json["userid"]
            dcthsid = request.json["dcthsid"]
            cursor.execute("INSERT INTO VisitList(userid, dcthsid) VALUES (%s,%s)",
                           (userid, dcthsid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Added to the list"}), 201
        else:
            dcthsid = request.args.get("dcthsid")
            userid = request.args.get("userid")
            print(dcthsid,userid)
            cursor.execute(
                "DELETE FROM VisitList WHERE dcthsid=%s AND userid=%s", (dcthsid, userid))
            data = cursor.fetchall()
            if len(data) == 0:
                return jsonify({"msg": "deleted item from the list"}), 200
    except:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()
@app.route("/api/v1/visitlist/delete", methods=['GET'])
def deletevisitlist():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        dcthsid = request.args.get("dcthsid")
        userid = request.args.get("userid")
        print(dcthsid,userid)
        cursor.execute(
                "DELETE FROM VisitList WHERE dcthsid=%s AND userid=%s", (dcthsid, userid))
        data = cursor.fetchall()
        if len(data) == 0:
            con.commit()
            return jsonify({"msg": "deleted item from the list"}), 200
    except:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


@app.route("/api/v1/claims", methods=["GET", "POST", "DELETE"])
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
            price = request.json.price
            cursor.execute("INSERT INTO Claims VALUES (%s,%s,%s)",
                           (userid, dcthsid, price))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Added Claim"}), 201
        elif request.method == 'DELETE':
            dcthsid = request.json["dcthsid"]
            userid = request.json["userid"]
            cursor.execute(
                "DELETE FROM Claim WHERE dcthsid=%s AND userid=%s", (dcthsid, userid))
            data = cursor.fetchall()
            if len(data) == 0:
                return jsonify({"msg": "deleted claim"}), 200
    except Exception as e:
        print(e)
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()

@app.route("/api/v1/transactions", methods=["GET", "POST", "DELETE"])
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
            print("hi")
            userid = request.json["userid"]
            price = request.json["price"]
            cursor.execute("INSERT INTO Transactions(userid,price) VALUES (%s,%s)",
                           (userid, price))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return jsonify({"msg": "Added Claim"}), 201
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


if __name__ == "__main__":
    app.run()
