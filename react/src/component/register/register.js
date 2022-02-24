import React from "react";
import {register} from "../../util/auth";
import {Alert, Button, Input} from "antd";
import style from "./register.module.css"
import {Navigate} from "react-router";
import Captcha from "../captcha";
import {Link} from "react-router-dom";
import {UserAddOutlined} from "@ant-design/icons";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            passwordConfirm: "",
            captcha: "",
            warn: null,
            captchaImage: <Captcha r={Math.random()}/>
        }
        document.title = "注册 /August-chuu的贴吧云签到"
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

    handlePasswordConfirmChange = event => {
        this.setState({
            passwordConfirm: event.target.value
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

    submit = () => {
        if (this.state.password === "" || this.state.username === "" || this.state.passwordConfirm === ""
            || this.state.captcha === ""
        ) {
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
        else if (this.state.password !== this.state.passwordConfirm) {
            this.setState({
                warn:
                    <Alert
                        style={{
                            marginTop: "10px"
                        }}
                        message="两次输入密码不一致"
                        description="请重新输入"
                        showIcon
                        type="error"
                    />
            })
        }
        else {
            register(this.state.username, this.state.password, this.state.captcha).then(value => {
                this.setState({success: value.success})
                console.log(value)
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
            }).catch(err => {
                console.log(err)
            })
        }
    }

    render() {
        if (this.state.success === 1) {
            return <Navigate to={"/login"}/>
        } else {
            return (
                <div className={style.body}>
                    <div className={style.container}>
                        <div className={style.title}>
                            <UserAddOutlined />
                            <span>  注册</span>
                        </div>
                        <Input
                            className={style.input}
                            onChange={this.handleNameChange}
                            value={this.state.username}
                            placeholder={"请输入用户名 （8-14位）"}
                            onPressEnter={this.submit}
                        />
                        <Input.Password
                            className={style.input}
                            onChange={this.handlePasswordChange}
                            value={this.state.password}
                            placeholder={"请输入密码 （8-14位）"}
                            onPressEnter={this.submit}
                        />
                        <Input.Password
                            className={style.input}
                            onChange={this.handlePasswordConfirmChange}
                            value={this.state.passwordConfirm}
                            placeholder={"确认密码"}
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
                            to={"/login"}
                            style={{
                                marginTop: "60px",
                                float: "right"
                            }}
                        >已有账号？点此登录</Link>
                        <Button
                            type={"primary"}
                            onClick={this.submit}
                            style={{
                                marginTop: "20px",
                                width: "100%"
                            }}
                        >提交</Button>
                        {this.state.warn}
                    </div>
                </div>
            )
        }
    }
}
