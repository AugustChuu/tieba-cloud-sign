import React from "react";
import {Route, Routes} from "react-router"
import Login from "./component/login/login";
import Register from "./component/register/register";
import Panel from "./component/panel";
import {HashRouter} from "react-router-dom";
import Homepage from "./component/homepage/homepage";

export default function AppRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route exact path={"/"} element={<Homepage />} />
                <Route exact path={"/console"} element={<Panel />} />
                <Route exact path={"/login"} element={<Login />} />
                <Route exact path={"/register"} element={<Register />} />
                <Route path={"/*"} element={<Panel />} />
            </Routes>
        </HashRouter>
    )
}

