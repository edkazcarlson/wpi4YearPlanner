import React, { Component } from 'react'
import Course from './Course'

export class Board extends Component {
    constructor(props){
        super(props);
        this.dragulaList = [];
    }

    onDragStart = (event, taskName) => {
    	event.dataTransfer.setData("taskName", taskName);
	}
	onDragOver = (event) => {
	    event.preventDefault();
	}

	onDrop = (event, indices) => {
        let fromOut = false;
        let toOut = false;
        let taskName = event.dataTransfer.getData("taskName");
        let startYear = parseInt(event.dataTransfer.getData("startYear"));
        let startTerm = parseInt(event.dataTransfer.getData("startTerm"));
        if (startYear == -1){
            fromOut = true;
        }
        if (indices[0] == -1){
            toOut = true;
        }
        this.props.moveCourse(taskName, [startYear, startTerm], indices, fromOut, toOut);
	}

    //positions are in format <year>-<term>-body, returns the respective index for the courseGrid
	//ex: Sophmore-B-body would return [1,1]
	posNameToIndex(posName){
		const splitName = posName.split('-');
		const firstIndex = yearArray.indexOf(splitName[0]);
		const secondIndex = termArray.indexOf(splitName[1]);
		return [firstIndex, secondIndex];
	}

    render() {
        return (
        <div>
            <div id="outOfWPICol">
                <div className="header">Courses Taken Outside WPI</div>
                <div className="body" id="outOfWPIBody"
                onDragOver={(event)=>this.onDragOver(event)}
                onDrop={(event)=>{this.onDrop(event, [-1, -1])}} >
                    {this.props.outOfWPICourses.map((course) => (
                        <Course key = {course} 
                        courseName = {course} 
                        delCourse = {this.props.delCourse}
                        indices = {[-1, -1]}/>
                    ))}
                </div>
            </div> {
            yearIndices.map((yearIndex) => (
                <div key = {yearArray[yearIndex]} id={yearArray[yearIndex]} className="yearWrapper">
                {termIndicies.map((termIndex) => (
                    <div key = {yearArray[yearIndex] + termArray[termIndex]} id={yearArray[yearIndex] + termArray[termIndex]} >
                        <div className="header">{yearArray[yearIndex] + " " + termArray[termIndex]} term</div>
                        <div className="body" 
                        id={yearArray[yearIndex] + "-" + termArray[termIndex] + "-body"} 
                        onDragOver={(event)=>this.onDragOver(event)}
                        onDrop={(event)=>{this.onDrop(event, [yearIndex, termIndex])}}>
                            {this.props.courses[yearIndex][termIndex].map((course) => (
                            <Course key = {course}
                            courseName = {course} 
                            delCourse = {this.props.delCourse}
                            indices = {[yearIndex, termIndex]}/>))
                            }
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
