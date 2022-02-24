import style from "./homepage.module.css"
import {Button} from "antd";
import {useNavigate} from "react-router";
import Footer from "../footer/footer"

export default function Homepage() {
    document.title = "August-chuu的贴吧云签到"

    const source = () => {
        window.open("https://github.com/AugustChuu/tieba-cloud-sign")
    }

    const navigate = useNavigate()
    return (
        <div className={style.body}>
            <div className={style.mask}/>
                <div className={style.content}>
                    <h1 className={style.title}>
                        贴吧云签到
                    </h1>
                    <p className={style.text}>
                        基于 Flask + ReactJS 的前后端分离项目，本项目为永久免费
                    </p>
                    <div className={style.button}>
                        <Button
                            style={{
                                background: "#82bfff",
                                color: "black"
                            }}
                            type={"primary"}
                            onClick={e => navigate("/login")}
                            size={"large"}
                        >开始使用</Button>
                        <Button
                            style={{
                                background: "#dadada",
                                marginRight: "80px",
                                float: "right"
                            }}
                            type={"default"}
                            onClick={source}
                            size={"large"}
                        >项目源码</Button>
                    </div>
                </div>
                <div className={style.placeholder}><Footer /></div>
        </div>
    )
}
