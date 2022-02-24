import React from "react";
import config from "../config.json"
import axios from "axios";
import {Table} from "antd";

export default class Log extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
        this.getList()
    }

    getList() {
        axios.defaults.withCredentials = true;
        let url = "https://" + config.server + "/api/userInfo";
        axios.get(url).then(res => {
            this.setState({list: res.data.data});
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
                title: 'Bduss',
                dataIndex: 'bduss',
                key: 'bduss',
                ellipsis: true,
                render: text =>
                    <a
                        href={"https://" + config.server + "/log?bduss=" + text}
                        target={"_blank"}
                        rel={"noreferrer"}
                    >{text}</a>,
            }
        ]
        let data = []
        for (let i=0; i<this.state.list.length; i++) {
            data.push({
                id: i + 1,
                key: i.toString(),
                bduss: this.state.list[i].bduss
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
