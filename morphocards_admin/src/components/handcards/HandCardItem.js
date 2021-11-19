import React from 'react';

export default class HandCardItem extends React.Component {

    render() {
        return(
            <li className="card-element">
                <p><b>{this.props.element.id}</b><span>{this.props.element.value}</span></p>
                <button>x</button>
            </li>
        );
    }

}