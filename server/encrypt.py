import base64
from config_user import encrypt_key
from Crypto.Cipher import AES


def add_to_16(text: bytes):
    while len(text) % 16 != 0:
        text += b'\0'
    return text


def pad(text: str):
    block_size = AES.block_size
    return text + (block_size - len(text) % block_size) * chr(block_size - len(text) % block_size)


def unpad(text: bytes):
    return text[0: -text[-1]]


def decode_base64(data):
    missing_padding = 4 - len(data) % 4
    if missing_padding:
        data += b'=' * missing_padding
    return data


def encrypt(text: str):
    key = add_to_16(encrypt_key.encode(encoding="utf-8"))
    aes = AES.new(key=key, mode=AES.MODE_ECB)
    encrypted = aes.encrypt(pad(text).encode(encoding="utf-8"))
    return base64.b64encode(encrypted).decode(encoding="utf-8")


def decrypt(text: str):
    data = base64.decodebytes(text.encode(encoding="utf-8"))
    key = add_to_16(encrypt_key.encode(encoding="utf-8"))
    aes = AES.new(key=key, mode=AES.MODE_ECB)
    decrypted = aes.decrypt(data)
    return unpad(decrypted).decode(encoding="utf-8")