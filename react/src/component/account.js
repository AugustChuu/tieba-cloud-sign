import React from "react";
import axios from "axios";
import config from "../config.json";
import {message, Table} from "antd";
import ReactDOM from "react-dom";
import Add from "./add/add";

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
        this.getList()
    }

    getList = () => {
        axios.defaults.withCredentials = true;
        let url = "https://" + config.server + "/api/userInfo";
        axios.get(url).then(res => {
            this.setState({list: res.data.data});
        }).catch(err => {
            console.log(err)
        })
    }

    edit = (bduss, stoken) => {
        this.props.parent.setState({selected: ["0"]})
        ReactDOM.render(<Add bduss={bduss} stoken={stoken}/>, document.getElementById("container"))
    }

    remove = (bduss, stoken) => {
        axios.defaults.withCredentials = true;
        let data = {
            bduss: bduss,
            stoken: stoken
        }
        let url = "https://" + config.server + "/api/deleteRecord"
        axios.post(url, data).then(res => {
            if (res.data.success === 1) {
                message.success(res.data.message, 5);
            }
            else {
                message.error(res.data.message, 5);
            }
            this.getList()
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id',
                width: 100
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: 'Bduss',
                dataIndex: 'bduss',
                key: 'bduss',
                ellipsis: true
            },
            {
                title: 'Stoken',
                dataIndex: 'stoken',
                key: 'stoken',
                ellipsis: true
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: 200
            }
        ]
        let data = []
        for (let i=0; i<this.state.list.length; i++) {
            data.push({
                id: i + 1,
                key: i.toString(),
                bduss: this.state.list[i].bduss,
                stoken: this.state.list[i].stoken,
                username: this.state.list[i].username,
                action:
                    <span>
                        <a onClick={e => this.edit(this.state.list[i].bduss, this.state.list[i].stoken)}>编辑</a>
                        <a
                            onClick={e => this.remove(this.state.list[i].bduss, this.state.list[i].stoken)}
                            style={{
                                marginLeft: "30px"
                            }}
                        >删除</a>
                    </span>
            })
        }
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={data}
                />
            </div>
        );
    }
}

function edit() {

}
