import React from "react";
import ReactDOM from 'react-dom';
import {Menu} from "antd";
import Log from "./log";
import Add from "./add/add";
import Account from "./account";
import {
    BarsOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    ImportOutlined,
    UserOutlined
} from "@ant-design/icons";
import {logout} from "../util/auth";
import {Navigate} from "react-router";
import Modal from "antd/es/modal/Modal";
import Like from "./like";

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true,
            modal: false,
            selected: ["0"]
        }
    }

    changePageAdd = () => {
        this.setState({selected: ["0"]})
        ReactDOM.render(<Add />, document.getElementById("container"))
    }

    changePageLog = () => {
        this.setState({selected: ["1"]})
        ReactDOM.render(<Log />, document.getElementById("container"))
    }

    changePageAccount = () => {
        this.setState({selected: ["2"]})
        ReactDOM.render(<Account parent={this}/>, document.getElementById("container"))
    }

    changePageList = () => {
        this.setState({selected: ["3"]})
        ReactDOM.render(<Like />, document.getElementById("container"))
    }

    logout = () => {
        logout().then(res => {
            this.setState({login: false})
        })
    }

    showModal = () => {
        this.setState({modal: true})
    }

    hideModal = () => {
        this.setState({modal: false})
    }


    render() {
        if (this.state.login) {
            return (
                <Menu
                    style={{ width: 500 }}
                    mode="inline"
                    defaultSelectedKeys={['0']}
                    title={"菜单"}
                    selectedKeys={this.state.selected}
                >
                    <Menu.Item key="0" icon={<EditOutlined />} onClick={this.changePageAdd}>签到</Menu.Item>
                    <Menu.Item key="1" icon={<FileTextOutlined />} onClick={this.changePageLog}>签到日志</Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined/>} onClick={this.changePageAccount}>账号管理</Menu.Item>
                    <Menu.Item key="3" icon={<BarsOutlined />} onClick={this.changePageList}>贴吧列表</Menu.Item>
                    <Menu.Item key="4" icon={<ImportOutlined />} onClick={this.showModal}>账号登出</Menu.Item>
                    <Modal
                        visible={this.state.modal}
                        title={"确定要登出吗"}
                        onOk={this.logout}
                        onCancel={this.hideModal}
                        icon={<ExclamationCircleOutlined />}
                        okText={"确定"}
                        cancelText={"取消"}
                    />
                </Menu>
            )
        }
        else {
            return <Navigate to={"/login"} />
        }
    }
}
