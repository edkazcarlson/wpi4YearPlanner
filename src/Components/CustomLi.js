import React, { Component } from 'react'

export class CustomLi extends Component {
    constructor(props){
        super(props);
        console.log('constructor called');
    }

    render() {
        console.log('render called')
        return (
            <ul>
                {this.props.courses.map((course) => (
                    <li>{course}</li>
                ))}
            </ul>
        )
    }
}

export default CustomLi
