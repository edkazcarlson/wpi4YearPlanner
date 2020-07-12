import React, { Component } from 'react'
import Course from './Course'
import Dragula from 'react-dragula'

export class Board extends Component {
    constructor(props){
        super(props);
        this.dragulaList = [];
    }

    dragulaDecorator = (domElement) => {
        this.dragulaList.push(domElement);
        console.log(domElement);
        if (domElement.id == 'Senior-D-body'){
            Dragula(this.dragulaList)
        }
    }

    render() {
        return (
        <div>
            <div id="outOfWPICol">
                <div className="header">Courses Taken Outside WPI</div>
                <div className="body" id="outOfWPIBody" ref = {this.dragulaDecorator}>
                    {this.props.outOfWPICourses.entries((course) => (
                        <Course key = {course} courseName = {course} delCourse = {this.props.delCourse}/>
                    ))}
                </div>
            </div> {
            yearIndices.map((yearIndex) => (
                <div key = {yearArray[yearIndex]} id={yearArray[yearIndex]} className="yearWrapper">
                {termIndicies.map((termIndex) => (
                    <div key = {yearArray[yearIndex] + termArray[termIndex]} id={yearArray[yearIndex] + termArray[termIndex]} >
                        <div className="header">{yearArray[yearIndex] + " " + termArray[termIndex]} term</div>
                        <div className="body" id={yearArray[yearIndex] + "-" + termArray[termIndex] + "-body"} ref = {this.dragulaDecorator}>
                            {this.props.courses[yearIndex][termIndex].map((course) => (
                                <Course key = {course} courseName = {course} delCourse = {this.props.delCourse}/>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            ))}
        </div>);
    }
}
let yearArray = ['Freshman', 'Sophmore', 'Junior', 'Senior'];
let termArray = ['A', 'B', 'C', 'D'];
let yearIndices = [0,1,2,3];
let termIndicies = [0,1,2,3];
export default Board
