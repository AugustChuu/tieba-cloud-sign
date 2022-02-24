import style from "./footer.module.css"
import {GithubOutlined, QqOutlined} from "@ant-design/icons";

export default function Footer() {
    return (
        <div className={style.footer}>
            <div className={style.content}>
                <p className={style.text}>Copyleft 2022 by August-chuu</p>
                <div style={{display: 'flex'}}>
                    <a className={style.icon}
                        href={"https://github.com/AugustChuu"}>
                        <GithubOutlined />
                    </a>
                    <a className={style.icon}
                        href={"tencent://message/?uin=2296033930&Site=&Menu=yes"}>
                        <QqOutlined />
                    </a>
                </div>
            </div>
        </div>
    )
}
