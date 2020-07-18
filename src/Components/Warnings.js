import React, { Component } from 'react'

export class Warnings extends Component {

    buildCourseWarnings() {
        let takenCourses = new Set();
        this.props.outOfWPICourses.forEach(function(course){
            takenCourses.add(course.split(' ')[0]);
        })
        let courseJSON = this.props.courseJSON;
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

        return (
        <div id = "CourseWarnings">        
            {warnings.map((warning) => (
            <div style = {{color: 'red'}} key = {warning}>{warning}</div>
            ))}
        </div>);
    }

    buildCreditWarnings(){
        let warnings = [];
        let terms = ['A-B', 'C-D']
        this.props.courses.forEach(year => {
            for (let i = 0 ; i < 2 ; i++){
                let A = year[i*2];
                let B = year[i*2 + 1];
                if (A.length + B.length > 7){
                    warnings.push("Terms " + terms[i] + " have too many courses, taking more than 7 in a semester incurs a fee");
                }
            }
        })
        return (
            <div id = "CreditWarnings">
                {warnings.map((warning) => (
                    <div style = {{color: 'red'}} key = {warning}>{warning}</div>
                ))}
            </div>
        );
    }
    render() {
        return (
            <div id = "Warnings">
              {this.buildCreditWarnings()}
              {this.buildCourseWarnings()}
            </div>
        )
    }
}

export default Warnings
