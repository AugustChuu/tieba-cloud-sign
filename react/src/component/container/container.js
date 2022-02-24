import React from "react";
import Add from "../add/add";
import style from "./container.module.css"



export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: <Add />
        }
    }

    update(component) {
        this.setState({
            render: component
        })
    }

    render() {
        return (
            <div id={"container"} className={style.container}>
                {this.state.render}
            </div>
        );

    }
}
