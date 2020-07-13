import React, { Component } from 'react'

export class Course extends Component {
    render() {
        return (
            <div className="course">
            {this.props.courseName}
            <br/>
                <button onClick = {this.props.delCourse(this.props.courseName)}>Delete Course</button>
            </div>
        )
    }
}

export default Course
