from model import User, Cookie, db


def find_cookie_by_user(username: str):
    list_ = db.session.query(Cookie.bduss, Cookie.stoken).filter(Cookie.username == username).all()
    return list_


def find_all_cookie():
    list_ = db.session.query(Cookie.bduss, Cookie.stoken).all()
    return list_


def find_token(username: str):
    return db.session.query(User.token).filter(User.username == username).first()[0]


def user_count():
    return db.session.query(db.func.count(User.id)).scalar()


def cookie_count(username: str):
    return db.session.query(db.func.count(Cookie.username)).filter(Cookie.username == username).scalar()


def find_password(username: str):
    passwd = db.session.query(User.password).filter(User.username == username).first()
    if passwd:
        return passwd[0]


def insert_user(user: User):
    db.session.add(user)
    db.session.commit()


def insert_cookie(cookie: Cookie):
    db.session.add(cookie)
    db.session.commit()


def delete_cookie(bduss: str):
    cookie = db.session.query(Cookie).filter(Cookie.bduss == bduss).first()
    if cookie:
        db.session.delete(cookie)
        db.session.commit()


def update_token(username: str, token: str):
    user = db.session.query(User).filter(User.username == username).first()
    if user:
        user.token = token
        db.session.commit()


def main():
    return 0


if __name__ == '__main__':
    main()
