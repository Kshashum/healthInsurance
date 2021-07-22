
from flask import Flask, request, jsonify
from functools import wraps
from flaskext.mysql import MySQL
import configparser
import bcrypt
import jwt

app = Flask(__name__)

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
        decoded = jwt.decode(request.json["token"],
                             "secret", algorithms=["HS256"])
        print(decoded)
        try:
            if decoded['userid'] is not None:
                return f(*args, **kwargs)
        except:
            return jsonify({"msg": "Internal Server Error"}), 500
    return decorated_function


@app.route("/")
def main():
    return jsonify({"msg": "hello"})


@app.route("/api/v1/users", methods=["GET", "POST"])
def users():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == "GET":
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
        elif request.method == "POST":
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
        print(e)
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


@app.route("/api/v1/visitlist/", methods=['GET', 'POST', 'DELETE'])
def visitlist():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            userid = request.json["userid"]
            cursor.execute(
                "SELECT * FROM VisitList WHERE userid = %s", (userid))
            data = cursor.fetchall()
            return jsonify(data), 200
        elif request.method == "POST":
            userid = request.json["userid"]
            dcthsid = request.json["dcthsid"]
            cursor.execute("INSERT INTO VisitList(userid, dcthsid) VALUES (%s,%s)",
                           (userid, dcthsid))
            data = cursor.fetchall()
            if len(data) == 0:
                con.commit()
                return {"msg": "Doctor Hospital Created"}, 201
        elif request.method == 'DELETE':
            dcthsid = request.json["dcthsid"]
            userid = request.json["userid"]
            cursor.execute(
                "DELETE FROM DctHs WHERE dcthsid=%s AND userid=%s", (dcthsid, userid))
            data = cursor.fetchall()
            if len(data) == 0:
                return jsonify({"msg": "deleted Doctor Hospital"}), 200
    except:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


@app.route("/api/v1/claims", methods=["GET", "POST", "DELETE"])
def claims():
    try:
        con = mysql.connect()
        cursor = con.cursor()
        if request.method == 'GET':
            userid = request.json["userid"]
            cursor.execute(
                "SELECT * FROM Claims WHERE userid = %s", (userid))
            data = cursor.fetchall()
            return jsonify(data), 200
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
    except:
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        con.close()


if __name__ == "__main__":
    app.run()
