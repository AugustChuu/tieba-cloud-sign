import hashlib
import random
import string
from captcha.image import ImageCaptcha

from database import update_token, find_token
from config_user import encrypt_key


def is_login(username: str, token: str):
    if token is None or username is None:
        return False
    correct = find_token(username)
    return token == correct


def create_token(username: str):
    return hashlib.md5(
        (username + encrypt_key)
        .join(random.sample(string.ascii_letters + string.digits, 8))
        .encode(encoding='utf-8')
    ).hexdigest()


def login(username: str):
    token = create_token(username)
    update_token(username, token)
    return token


def generate_captcha(code: str):
    code = hashlib.md5(code.encode(encoding='utf-8')).hexdigest()
    return code[0] + code[2] + code[4] + code[6]


def generate_captcha_image(code: str):
    code_correct = generate_captcha(code)
    image = ImageCaptcha(width=180, height=60)
    image.write(code_correct, 'static/' + code + '.png')
    return code

