import React from "react";
import {CloudOutlined} from "@ant-design/icons";
import style from "./header.module.css"

export default function Header() {
    return (
        <div className={style.header}>
            <CloudOutlined className={style.icon}/>
            <h1 className={style.text}>August-chuu 的 贴吧云签到</h1>
        </div>
    )
}
