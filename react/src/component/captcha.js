import React from "react";
import style from "./register/register.module.css";
import config from "../config.json";

export default class Captcha extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render:
                <div className={style.captcha} onClick={this.changeCaptcha}>
                    <img src={"https://" + config.server + "/captcha?r=" + Math.random()}
                         alt={"验证码获取失败"}
                         style={{
                             width: "120px",
                             height: "40px"
                         }}
                    />
                </div>
        }
    }

    changeCaptcha = () => {
        this.setState({
            render:
                <div className={style.captcha} onClick={this.changeCaptcha} >
                    <img
                        src={"https://" + config.server + "/captcha?r=" + Math.random()}
                        alt={"验证码获取失败"}
                        style={{
                            width: "120px",
                            height: "40px"
                        }}
                    />
                </div>
        })
    }

    render() {
        return this.state.render
    }
}
