import React, { Component } from 'react'
import {courseData} from '../data/reactGetCourses'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';



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
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Course Search" variant="outlined" />}
                />
                <button id = "entryButton" type = "button" onClick = {this.addCourse}>Add Course</button>
            </div>
        )
    }
    addCourse = () =>{
        console.log("hit")
        this.props.addCourse(this.state.chosenCourse);
    }
}



export default CourseSearcher
