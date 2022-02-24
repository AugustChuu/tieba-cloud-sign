import logging
import random
import os
from flask import Flask, request, Response, session
from flask_cors import CORS

import auth
from sign import Sign
from encrypt import encrypt, decrypt
from database import *
from model import db
from auth import *
from scheduler import scheduler
import config_app
import config_user

app = Flask(__name__)
config_app.JOBS[0]['args'] = (app,)
app.config.from_object(config_app)
db.init_app(app)
scheduler.init_app(app)
scheduler.start()
CORS(app, supports_credentials=True)
handler = logging.FileHandler(filename="log/flask.log", encoding='utf-8')
app.logger.addHandler(handler)


@app.route('/')
def index():
    return ">_<"


@app.route('/api/add', methods=['post'])
def receive_record():
    request_json = request.get_json(force=True)
    username = request.cookies.get('username')
    token = request.cookies.get('token')
    bduss = request_json['bduss']
    stoken = request_json['stoken']
    sign = Sign(bduss=bduss, token=stoken)
    if not is_login(username, token):
        return {
            'success': 0,
            'message': '用户未登录'
        }
    elif sign.check_token():
        if cookie_count(username) < config_user.max_account:
            bduss = encrypt(bduss)
            token = encrypt(stoken)
            delete_cookie(bduss)
            cookie = Cookie(username, bduss, token)
            insert_cookie(cookie)
            return {
                'success': 1,
                'message': '成功添加记录'
            }
        else:
            return {
                'success': 0,
                'message': '数量达到上限'
            }
    elif not sign.check_token():
        return {
            'success': 0,
            'message': '无效的账号凭据'
        }
    else:
        return {
            'success': 0,
            'message': '添加失败'
        }


@app.route('/api/deleteRecord', methods=['post'])
def delete_record():
    request_json = request.get_json(force=True)
    username = request.cookies.get('username')
    token = request.cookies.get('token')
    bduss = request_json['bduss']
    stoken = request_json['stoken']
    if not is_login(username, token):
        return {
            'success': 0,
            'message': '用户未登录'
        }
    else:
        list_ = find_cookie_by_user(username)
        if (encrypt(bduss), encrypt(stoken)) in list_:
            delete_cookie(encrypt(bduss))
            return {
                'success': 1,
                'message': '成功删除记录'
            }
        else:
            return {
                'success': 0,
                'message': '记录不存在'
            }


@app.route('/api/userInfo', methods=['get'])
def info():
    username = request.cookies.get('username')
    token = request.cookies.get('token')
    if not is_login(username, token):
        return {
            'success': 0,
            'message': '用户未登录'
        }
    else:
        cookies = find_all_cookie()
        list_ = []
        for cookie in cookies:
            list_.append({
                'bduss': decrypt(cookie[0]),
                'stoken': decrypt(cookie[1]),
                'username': Sign(decrypt(cookie[0]), decrypt(cookie[1])).get_username()
            })
        return {
            'success': 1,
            'data': list_,
        }


@app.route('/register', methods=['post'])
def register():
    request_json = request.get_json(force=True)
    username = request_json['username']
    password = request_json['password']
    captcha_content = request_json['captcha']
    if username and password and captcha_content:
        if not (8 <= len(username) <= 14 and 8 <= len(password) <= 14):
            return {
                'success': 0,
                'message': '用户名或密码长度不符合要求'
            }
        captcha_content = captcha_content.lower()
        captcha_code = session.get('captchaCode')
        session.clear()
        if captcha_content != generate_captcha(captcha_code):
            return {
                'success': 0,
                'message': '验证码错误'
            }
        elif find_password(username) is None:
            password = encrypt(password)
            insert_user(User(user_count(), username, password, None))
            return {
                'success': 1,
                'message': '注册成功'
            }
        else:
            return {
                'success': 0,
                'message': '账号已存在'
            }
    else:
        return {
            'success': 0,
            'message': '注册失败'
        }


@app.route('/login', methods=['post'])
def login():
    request_json = request.get_json(force=True)
    username = request_json['username']
    password = request_json['password']
    captcha_content = request_json['captcha']
    if username and password and captcha_content:
        captcha_content = captcha_content.lower()
        captcha_code = session.get('captchaCode')
        session.clear()
        if captcha_content != generate_captcha(captcha_code):
            return {
                'success': 0,
                'message': '验证码错误'
                }
        elif find_password(username) == encrypt(password):
            token = auth.login(username)
            response = Response()
            response.data = str({
                'success': 1,
                'message': '登陆成功'
            })
            response.set_cookie('username', username, secure=True, domain="august-chuu.com")
            response.set_cookie('token', token, secure=True, domain="august-chuu.com")
            return response
        else:
            return {
                'success': 0,
                'message': '账号或密码错误'
            }
    else:
        return {
            'success': 0,
            'message': '登录失败'
        }


@app.route('/logout')
def logout():
    username = request.cookies.get('username')
    token = request.cookies.get('token')
    if is_login(username, token):
        update_token(username, '')
        response = Response()
        response.data = str({
            'success': 1,
            'message': '登出成功'
        })
        response.delete_cookie('username', secure=True, domain="august-chuu.com")
        response.delete_cookie('token', secure=True, domain="august-chuu.com")
        return response
    else:
        return {
            'success': 0,
            'message': '当前未登录'
        }


@app.route('/log')
def log():
    username = request.cookies.get('username')
    token = request.cookies.get('token')
    bduss = request.args.get('bduss')
    if is_login(username, token) and bduss:
        try:
            data = ''
            with open(file='log/'+bduss, mode='r', encoding='utf-8') as file:
                for line in file:
                    line += '<br>'
                    data += line
            return data
        except FileNotFoundError:
            return '该账号的日志暂不存在'
    else:
        return '获取日志信息失败'


@app.route('/captcha')
def captcha():
    code = ''.join(random.sample(string.ascii_letters + string.digits, 8))
    session['captchaCode'] = code
    code = generate_captcha_image(code)
    try:
        with open('static/' + code + '.png', 'rb') as file:
            image = file.read()
        os.remove('static/' + code + '.png')
        return image, 200, [('content-type', 'image/png')]
    except FileNotFoundError:
        return None


@app.route('/api/list', methods=['post'])
def liked_list():
    request_json = request.get_json(force=True)
    username = request.cookies.get('username')
    token = request.cookies.get('token')
    bduss = request_json['bduss']
    stoken = request_json['stoken']
    if not is_login(username, token):
        return {
            'success': 0,
            'message': '用户未登录'
        }
    else:
        liked = Sign.get_liked_list(bduss, stoken)
        return {
            'success': 1,
            'data': liked
        }


if __name__ == '__main__':
    app.run()
