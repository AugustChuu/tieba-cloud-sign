from hashlib import md5
import requests
import re
import time
import urllib3
import logging
import config_user
from concurrent.futures import ThreadPoolExecutor


class Sign:
    _bduss = ''
    _token = ''
    __headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
    }
    __logger = logging.getLogger(__name__)
    __handler = None
    _proxies = {"http": None, "https": None}

    def __init__(self, bduss: str, token: str):
        urllib3.disable_warnings()
        self._bduss = bduss
        self._token = token
        self.__headers['Cookie'] = 'BDUSS=' + bduss + '; STOKEN=' + token

    def get_username(self):
        url_check = 'http://tieba.baidu.com/f/user/json_userinfo'
        response = requests.get(url=url_check, headers=self.__headers, proxies=self._proxies).json()
        return response['data']['user_name_weak']

    def sign_all(self):
        self.__logger.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s - %(message)s')
        self.__handler = logging.FileHandler(filename='log/' + self._bduss, mode='w', encoding='utf-8')
        self.__handler.setLevel(logging.INFO)
        self.__handler.setFormatter(formatter)
        self.__logger.addHandler(self.__handler)

        pool = ThreadPoolExecutor(max_workers=6)
        for i in range(config_user.sign_loop):
            list_ = self.get_unsigned_list()
            if not list_:
                break
            for elem in list_:
                pool.submit(self.do_sign, elem)
                time.sleep(0.1)
        pool.shutdown()

        self.__logger.removeHandler(self.__handler)
        self.__logger.addHandler(logging.FileHandler(filename="log/flask.log", encoding='utf-8'))

    def get_tbs(self):
        url_tbs = "http://tieba.baidu.com/dc/common/tbs"
        response = requests.get(url=url_tbs, headers=self.__headers, verify=False, proxies=self._proxies).json()
        return response['tbs']

    def check_token(self):
        url_check = 'http://tieba.baidu.com/f/user/json_userinfo'
        response = requests.get(url=url_check, headers=self.__headers, proxies=self._proxies)
        return response.text != 'null'

    @staticmethod
    def get_liked_list(bduss, stoken):
        """
        url_search = "http://tieba.baidu.com/f/like/mylike"
        list_ = []
        while True:
            response = requests.get(url_search, headers=self._headers, proxies=self._proxies).text
            match = re.findall('>(.{,20})</a></td><td><a class', response)
            for elem in match:
                list_.append(elem)
            url_next = re.search('href="(.{,30})">下一页</a>', response)
            if url_next:
                url_next = url_next.group(1)
                url_search = "http://tieba.baidu.com" + url_next
            else:
                break
        return list_
        """

        url = 'https://tieba.baidu.com/mo/q/newmoindex'
        list_ = []
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0",
            'Cookie': 'BDUSS=' + bduss + '; STOKEN=' + stoken
        }
        response = requests.get(url, headers=headers).json()
        for elem in response['data']['like_forum']:
            list_.append({
                'name': elem['forum_name'],
                'is_signed': elem['is_sign']
            })
        return list_

    def get_unsigned_list(self):
        url = 'https://tieba.baidu.com/mo/q/newmoindex'
        list_ = []
        response = requests.get(url, headers=self.__headers, proxies=self._proxies).json()
        for elem in response['data']['like_forum']:
            if elem['is_sign'] == 0:
                list_.append(elem['forum_name'])
        return list_

    def do_sign(self, name: str):
        """
        url_sign = "https://tieba.baidu.com/sign/add"
        data = {
            "ie": "utf-8",
            "kw": name,
            "tbs": self.get_tbs()
        }
        response = requests.post(url=url_sign, data=data, headers=self._headers, verify=False,
                                 proxies=self._proxies).json()
        if response['error'] == 'need vcode':
            logging.info("[failed] " + '(“' + name + '"吧) ' + '正在处理验证码')
            self.do_sign_with_captcha(response['data']['captcha_vcode_str'], data, 1)
        elif response['no'] == 1101:
            self._logger.info("[success] " + '(“' + name + '"吧) ' + response['error'])
        elif not response['error']:
            self._logger.info("[success] " + '"' + name + '"吧已签到')
        else:
            self._logger.info("[failed] " + '(“' + name + '"吧) ' + response['error'])
        """
        url = 'http://c.tieba.baidu.com/c/c/forum/sign'
        tbs = self.get_tbs()
        data = {
            'kw': name,
            'tbs': tbs,
            'sign': md5(f'kw={name}tbs={tbs}tiebaclient!!!'.encode('utf8')).hexdigest()
        }
        response = requests.post(url=url, data=data, headers=self.__headers, verify=False,
                                 proxies=self._proxies).json()
        if response['error_code'] == '0':
            self.__logger.info(f'（{name}吧） 签到成功')
        else:
            self.__logger.info(f'（{name}吧） {response["error_msg"]}')

    def do_sign_with_captcha(self, captcha_code: str, data: dict, try_times: int):
        max_try_times = 5
        if try_times > max_try_times:
            self.__logger.info("[failed] " + '(“' + data['kw'] + '"吧) ' + '验证码处理失败')
            return
        url_sign = "https://tieba.baidu.com/sign/add"
        captcha_str = self.handle_captcha(captcha_code)
        data['captcha_input_str'] = captcha_str
        data['captcha_vcode_str'] = captcha_code
        time.sleep(0.1)
        response = requests\
            .post(url=url_sign, data=data, headers=self.__headers, verify=False, proxies=self._proxies)\
            .json()
        if not (response['no'] == 1101 or not response['error']):
            captcha_code = '不知道捏'
            self.do_sign_with_captcha(captcha_code, data, try_times + 1)
        elif response['no'] == 1101:
            self.__logger.info("[success] " + '(“' + data['kw'] + '"吧) ' + response['error'])
        else:
            self.__logger.info("[success] " + '"' + data['kw'] + '"吧已签到')

    def handle_captcha(self, captcha_code: str):
        return ''

        # url_captcha = 'https://tieba.baidu.com/cgi-bin/genimg?' + captcha_code + '='


def main():
    Sign('dnc1hGfm9xWi03WENsZGV0eEFrMVhQd09WRGxMWG8zNWV5UmxMMWpPZWFvd3RpRUFBQUFBJCQAAAAAAAAAAAEAAAA24xsfMjI5NjAzMzkzMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJoW5GGaFuRhbF',
         'e05271bad5b5ed636ec240e2abd628eddbf5d3df68cb6672121f8836fba00f9f').sign_all()


if __name__ == '__main__':
    main()


