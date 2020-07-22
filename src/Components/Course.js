import React, { Component } from 'react'
import { Button } from '@material-ui/core';

export class Course extends Component {

    onDragStart = (event, taskName) => {
        event.dataTransfer.setData("taskName", taskName);
        event.dataTransfer.setData("startYear", this.props.indices[0]);
        event.dataTransfer.setData("startTerm", this.props.indices[1]);
	}

    render() {
        return (
            <div className="course" id = {this.props.courseName} draggable onDragStart = {(event) => this.onDragStart(event, this.props.courseName)}>
            {this.props.courseName}
            <br/>
                <Button variant="outlined"
                onClick = {() => this.props.delCourse(this.props.courseName)}>Delete Course</Button>
            </div>
        )
    }
}

export default Course
