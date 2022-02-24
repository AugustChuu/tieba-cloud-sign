from flask_apscheduler import APScheduler

from database import find_all_cookie
from encrypt import decrypt
from sign import Sign


def task_sign(app):
    try:
        app.app_context().push()
        cookies = find_all_cookie()
        for cookie in cookies:
            bduss = decrypt(cookie[0])
            stoken = decrypt(cookie[1])
            Sign(bduss, stoken).sign_all()
    except:
        return


scheduler = APScheduler()
