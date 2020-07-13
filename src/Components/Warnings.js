import React, { Component } from 'react'

export class Warnings extends Component {
    constructor(props){
        super(props);
        this.state = {courseJSON : null};
        fetch('../data/allCourses.json').then(response => response.json()).then((data) => {this.setState({courseJSON : data})});
    }

    buildCourseWarnings() {
        let takenCourses = new Set(this.props.outOfWPICourses);
        let courseJSON = this.state.courseJSON;
        let warnings = [];
        this.props.courses.forEach(year => {
            year.forEach((term) => {
                let coursesTakenthisTerm = []
                term.forEach(function(course){
                    let courseID = course.split(' ')[0];
                    coursesTakenthisTerm.push(courseID);
                    courseJSON[courseID + '.json']['req'].forEach(function(courseTuple){
                       if (!takenCourses.has(courseTuple[0] + courseTuple[1])){
                           warnings.push("Course " + courseID + " has pre-req " + courseTuple[0] + courseTuple[1]);
                       }
                   });
                });
                coursesTakenthisTerm.forEach(function(course){
                    takenCourses.add(course);
                });
            })
        });
        console.log(warnings);

        return (
        <div id = "CourseWarnings">        
            {warnings.map((warning) => (
            <div style = {{color: 'red'}} key = {warning}>{warning}</div>
            ))}
        </div>);

    }
    render() {
        return (
            <div id = "Warnings">
              <div id = "CreditWarnings"></div>
              {this.buildCourseWarnings()}
            </div>
        )
    }
}

export default Warnings
