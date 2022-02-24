import React from "react";
import config from "../config.json";
import {Table} from "antd";
import axios from "axios";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";

export default class Like extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            expandedRowRender: () => {
                const columns_in = [
                    {title: '编号', dataIndex: 'id', key: 'id'},
                    {title: '贴吧', dataIndex: 'name', key: 'name'},
                    {title: '签到状态', dataIndex: 'sign', key: 'sign'}
                ];
                let data_in = []
                for (let i=0; i<this.state.list[0].liked.length; i++) {
                    data_in.push({
                        id: i + 1,
                        key: i.toString(),
                        name: this.state.list[0].liked[i].name,
                        sign: this.state.list[0].liked[i].is_signed
                    })
                }
                return <Table columns={columns_in} dataSource={data_in} pagination={false} />;
            },
            expand: []
        }
        this.getList()
    }

    componentDidMount() {
        this.setState({update: true})
    }

    getList = () => {
        axios.defaults.withCredentials = true;
        let url = "https://" + config.server + "/api/userInfo";
        axios.get(url).then(res => {
            for (let i=0; i<res.data.data.length; i++) {
                this.state.list.push({
                    username: res.data.data[i].username,
                    liked: []
                })
                this.getLiked(res.data.data[i].bduss, res.data.data[i].stoken, this.state.list[this.state.list.length - 1].liked)
                    .then(r => {})
            }
            this.setState({update: true})
        }).catch(err => {
            console.log(err)
        })
    }

    getLiked = async (bduss, stoken, liked) => {
        axios.defaults.withCredentials = true;
        let url = "https://" + config.server + "/api/list";
        let data = {
            bduss: bduss,
            stoken: stoken
        }
        await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            for (let i = 0; i < res.data.data.length; i++) {
                liked.push(res.data.data[i])
            }
        }).catch(err => {
            console.log(err)
        })
    }

    handleExpand = (keys) => {
        while (keys.length > 1) {
            keys.shift()
        }
        if (keys.length === 1) {
            let key = parseInt(keys[0])
            this.setState({
                expandedRowRender: () => {
                    const columns_in = [
                        {title: '编号', dataIndex: 'id', key: 'id'},
                        {title: '贴吧', dataIndex: 'name', key: 'name'},
                        {
                            title: '签到状态',
                            dataIndex: 'sign',
                            key: 'sign',
                            render: signed => {
                                if (signed === 1) {
                                    return <CheckOutlined style={{color: "#2895ff"}}/>
                                } else {
                                    return <CloseOutlined style={{color: "#ff0000"}}/>

                                }
                            }
                        }
                    ];

                    let data_in = []
                    for (let i=0; i<this.state.list[key].liked.length; i++) {
                        data_in.push({
                            id: i + 1,
                            key: i.toString(),
                            name: this.state.list[key].liked[i].name,
                            sign: this.state.list[key].liked[i].is_signed
                        })
                    }
                    return <Table columns={columns_in} dataSource={data_in} pagination={false} />;
                }
            })
        }
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
                ellipsis: true,
            }
        ]

        let data = []
        for (let i=0; i<this.state.list.length; i++) {
            data.push({
                id: i + 1,
                key: i.toString(),
                username: this.state.list[i].username
            })
        }

        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={data}
                    expandable={true}
                    expandedRowRender={this.state.expandedRowRender}
                    onExpandedRowsChange={this.handleExpand}
                />
            </div>
        );
    }
}
