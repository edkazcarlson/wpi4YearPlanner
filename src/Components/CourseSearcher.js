import React, { Component } from 'react'
import {courseData} from '../data/reactGetCourses'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Button, Paper } from '@material-ui/core';



export class CourseSearcher extends Component {
    constructor(props){
        super(props);
        this.state = {chosenCourse: ''};
    }


    
    render() {
        return (
            <div>
                <Autocomplete
                    value={this.state.chosenCourse}
                    onChange={(event, newValue) => {
                        this.setState({chosenCourse: newValue});
                    }}
                    options={courseData().map((course) => course.courseTitle)}
                    renderInput={(params) => <TextField {...params} label="Course Search" variant="outlined" />}
                />
                <Button variant="outlined" id = "entryButton" type = "button" onClick = {this.addCourse}>Add Course</Button>
            </div>
        )
    }
    addCourse = () =>{
        this.props.addCourse(this.state.chosenCourse);
    }
}



export default CourseSearcher
