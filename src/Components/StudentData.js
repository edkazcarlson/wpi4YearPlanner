import React, { Component } from 'react'

export class StudentData extends Component {

    onChange = () => {
        this.props.changeMajor(document.getElementById('major').value);
    }

    render() {
        return (
            <div>
                <select name="major" id="major" onChange = {this.onChange}>
                    <option value="CS">Computer Science</option>
                    <option value="ME">Mechanical Engineering</option>
                </select>
            </div>
        )
    }
}

export default StudentData
