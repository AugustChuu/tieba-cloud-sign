import React from "react";
import {Button, message} from "antd";
import TextArea from "antd/es/input/TextArea";
import config from "../../config.json"
import style from "./add.module.css"
import axios from "axios";

export default class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bduss: this.props.bduss,
            stoken: this.props.stoken,
        }
    }

    handleBdussChange = (event) => {
        this.setState({
            bduss: event.target.value
        })
    }

    handleStokenChange = (event) => {
        this.setState({
            stoken: event.target.value
        })
    }

    submit = () => {
        axios.defaults.withCredentials = true;
        let data = {
            bduss: this.state.bduss,
            stoken: this.state.stoken
        }
        let url = "https://" + config.server + "/api/add"
        axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            if (res.data.success === 1) {
                message.success(res.data.message, 5);
            }
            else {
                message.error(res.data.message, 5);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div className={style.container}>
                <div>
                    <h1>将账号添加到云端</h1>
                    <p>服务器将在每日的01：00自动签到。如发现账号断签，可再次更新信息</p>
                    <TextArea
                        value={this.state.bduss}
                        className={style.input}
                        rows={6}
                        placeholder="请输入bduss"
                        size={"small"}
                        allowClear={true}
                        onChange={this.handleBdussChange}
                    />
                    <TextArea
                        value={this.state.stoken}
                        className={style.input}
                        rows={6}
                        placeholder="请输入token"
                        allowClear={true}
                        onChange={this.handleStokenChange}
                    />
                    <Button
                        style={{
                            marginTop: "20px",
                            float: "right"
                        }}
                        type={"primary"}
                        onClick={this.submit}
                    >提交</Button>
                    <a
                        className={style.guide}
                        href={"/guide.html"}
                        target="_blank"
                        rel={"noreferrer"}
                    >如何获取？</a>
                </div>
            </div>
        )
    }
}
