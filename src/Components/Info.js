import React, { Component } from 'react'

export class Info extends Component {
    render() {
        return (
            <ul>
                <a href = "#/StudentResources" target="_blank" rel="noopener noreferrer"><button>Resources</button></a>
                <li>No Guarantee that this works or is accurate<br/>PE courses are not listed, required to have 4 to graduate</li>
                <li>If you see any problems or have ideas to improve, email me at <a href = "mailto: ekcarlson@wpi.edu">ekcarlson@wpi.edu</a></li>
                <li>Known TODOS: add better support for grad classes <br/> update course scraper/brute force course requirements for more accurate course requirements</li>
                
            </ul>
        )
    }
}

export default Info
