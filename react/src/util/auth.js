let axios = require("axios")
let cookie = require("react-cookies")
let config = require("../config.json")


function isLogin() {
    return cookie.load("token") != null
}


async function login(username, password, captcha) {
    axios.defaults.withCredentials = true;
    let url = "https://" + config.server + "/login"
    let data = {
        username: username,
        password: password,
        captcha: captcha
    }
    let response = {}
    await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => {
        if (res.data.success === 1) {

        }
        response = res.data
    }).catch(err => {
        console.log(err)
    })
    return response
}


async function logout() {
    axios.defaults.withCredentials = true;
    let url = "https://" + config.server + "/logout";
    await axios.get(url).then(res => {
        cookie.remove('username')
        cookie.remove('token')
    }).catch(err => {
        console.log(err)
    })
}


async function register(username, password, captcha) {
    axios.defaults.withCredentials = true;
    let url = "https://" + config.server + "/register";
    let data = {
        username: username,
        password: password,
        captcha: captcha
    };
    let response = {}
    await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => {
        response = res.data
    }).catch(err => {
        console.log(err)
    });
    return response
}


function verify(mail, code) {
    axios.defaults.withCredentials = true;
    let url = "https://" + config.server + "/verify"
    let data = {
        mail: mail,
        verify: code,
    }
    axios.post(url, data).then(res => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })
}

export {login, logout, isLogin, register, verify}
