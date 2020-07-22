import React, { Component } from 'react'
import { Select, MenuItem } from '@material-ui/core';

export class StudentData extends Component {

    onChange = (event) => {
        console.log(event.target.value);
        this.props.changeMajor(event.target.value);
    }

    render() {
        return (
            <div>
                <Select defaultValue = 'CS' style = {{margin: '5px'}} autoWidth = {true} name="major" id="major" onChange = {this.onChange}>
                    <MenuItem value="CS">Computer Science</MenuItem>
                    <MenuItem value="ME">Mechanical Engineering</MenuItem>
                </Select>
            </div>
        )
    }
}

export default StudentData
