import React, { Component } from 'react'

export class Info extends Component {
    render() {
        return (
            <div>
                <a href = "resources.html" target="_blank" rel="noopener noreferrer">Resources</a>
                <div>No Guarantee that this works or is accurate<br/>PE courses are not listed, required to have 4 to graduate</div>
                <div>If you see any problems or have ideas to improve, email me at <a href = "mailto: ekcarlson@wpi.edu">ekcarlson@wpi.edu</a></div>
                <div>Known TODOS: add better support for grad classes <br/> update course scraper/brute force course requirements for more accurate course requirements</div>
                
            </div>
        )
    }
}

export default Info
