import React from "react";
import NavBar from "./navBar";
import Container from "./container/container";
import {isLogin} from "../util/auth";
import  {Navigate} from "react-router";
import Header from "./header/header";
import Footer from "./footer/footer";

export default function Panel() {
    document.title = "August-chuu的贴吧云签到"

    if (!isLogin()) {
        return <Navigate to={"/login"} />
    }

    return (
        <div style={{height: "100%"}}>
            <div className="App" style={{
                display: "block",
                minHeight: "100%",
                marginBottom: "-140px"
            }}>
                <Header />
                <div style={{display: "flex"}}>
                    <NavBar />
                    <Container />
                </div>
                <div style={{height: "140px"}} />
            </div>
            <Footer />
        </div>
    )
}
