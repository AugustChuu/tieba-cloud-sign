from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)
    token = db.Column(db.String(255))

    def __init__(self, id_, username, password, token):
        self.id = id_
        self.username = username
        self.password = password
        self.token = token


class Cookie(db.Model):
    __tablename__ = 'cookie'

    username = db.Column(db.String(64), nullable=False)
    bduss = db.Column(db.String(255), primary_key=True, nullable=False)
    stoken = db.Column(db.String(255), nullable=False)

    def __init__(self, username, bduss, stoken):
        self.username = username
        self.bduss = bduss
        self.stoken = stoken
