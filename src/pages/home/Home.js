import React from "react";
import NodeNetworkAnimation from "../../components/NodeNetworkAnimation/NodeNetworkAnimation";

export default class Home extends React.Component {

    componentDidMount() {
        const container = document.querySelector('.am-home');
        const nodeNetworkAnimation = new NodeNetworkAnimation(container);
        container.appendChild(nodeNetworkAnimation.getCanvas());
    }

    render() {
        return <div className='am-home' style={{minHeight: '100vh'}}/>
    }
}