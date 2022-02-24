import React from "react"
import {isLogin, login} from "../../util/auth"
import {Alert, Button, Input} from "antd";
import {Navigate} from "react-router";
import Captcha from "../captcha";
import style from "../register/register.module.css"
import {Link} from "react-router-dom";
import {SelectOutlined} from "@ant-design/icons";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            captcha: "",
            isLogin: isLogin(),
            warn: null,
            captchaImage: <Captcha r={Math.random()}/>
        }
        document.title = "登录 /August-chuu的贴吧云签到"
    }

    handleNameChange = event => {
        let value = event.target.value.replace(/[^\w\d]/ig, "")
        this.setState({
            username: value
        })
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        })
    }

    handleCaptchaChange = event => {
        let value = event.target.value.replace(/[^\w\d]/ig, "")
        if (value.length > 4) {
            value = value.substr(0, 4);
        }
        this.setState({
            captcha: value
        })
    }

    submit = () =>  {
        if (this.state.password === "" || this.state.username === "" || this.state.captcha === "") {
            this.setState({
                warn:
                    <Alert
                        style={{
                            marginTop: "10px"
                        }}
                        message="请完整输入信息"
                        description="请重新输入"
                        showIcon
                        type="error"
                    />
            })
        }
        else {
            login(this.state.username, this.state.password, this.state.captcha).then(value => {
                if (value.success !== 1) {
                    this.refs.captcha.changeCaptcha()
                    this.setState({
                        warn:
                            <Alert
                                style={{
                                    marginTop: "10px"
                                }}
                                message="登录失败"
                                description={value.message}
                                showIcon
                                type="error"
                            />
                    })
                }
                this.setState({isLogin: isLogin()})
            }).catch(err => {
                console.log(err)
            })
        }
    }


    render() {
        if (this.state.isLogin) {
            return <Navigate to={"/console"}/>
        }
        else{
            return (
                <div className={style.body}>
                    <div className={style.container}>
                        <div className={style.title}>
                            <SelectOutlined />
                            <span>  登录</span>
                        </div>
                        <Input
                            value={this.state.username}
                            placeholder={"请输入用户名"}
                            className={style.input}
                            onChange={this.handleNameChange}
                            onPressEnter={this.submit}
                        />
                        <Input.Password
                            value={this.state.password}
                            placeholder={"请输入密码"}
                            className={style.input}
                            onChange={this.handlePasswordChange}
                            onPressEnter={this.submit}
                        />
                        <span style={{display: "flex"}}>
                            <Input
                                className={style.captchaInput}
                                onChange={this.handleCaptchaChange}
                                maxLength={4}
                                value={this.state.captcha}
                                placeholder={"请输入验证码"}
                                onPressEnter={this.submit}
                            />
                            <Captcha ref={"captcha"}/>
                        </span>
                        <Link
                            to={"/register"}
                            style={{
                                marginTop: "60px",
                                float: "right"
                            }}
                        >没有账号？点此注册</Link>
                        <Button
                            style={{
                                marginTop: "20px",
                                width: "100%"
                            }}
                            type={"primary"}
                            onClick={this.submit}
                        >登录</Button>
                        {this.state.warn}
                    </div>
                </div>
            )
        }
    }
}
