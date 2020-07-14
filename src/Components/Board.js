import React, { Component } from 'react'
import Course from './Course'
import Dragula from 'react-dragula'

export class Board extends Component {
    constructor(props){
        super(props);
        this.dragulaList = [];
    }

    //positions are in format <year>-<term>-body, returns the respective index for the courseGrid
	//ex: Sophmore-B-body would return [1,1]
	posNameToIndex(posName){
		const splitName = posName.split('-');
		const firstIndex = yearArray.indexOf(splitName[0]);
		const secondIndex = termArray.indexOf(splitName[1]);
		return [firstIndex, secondIndex];
	}

    dragulaDecorator = (domElement) => {
        this.dragulaList.push(domElement);
        if (domElement.id == 'Senior-D-body'){
            let trueThis = this;
            // Dragula(this.dragulaList).on('drop',  function(e1, target, source){
            //     let fromOut = source.id == 'outOfWPIBody';
            //     console.log(target)
            //     let toOut = target.id == 'outOfWPIBody';
            //     trueThis.props.moveCourse(e1.id, trueThis.posNameToIndex(source.id),trueThis.posNameToIndex(target.id),
            //      fromOut, toOut);
            // }
            // );
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
                            {(yearIndex == 0 && termIndex == 0 && this.props.newCourse != '') ?  
                            <Course key = {this.props.newCourse} 
                            courseName = {this.props.newCourse} 
                            delCourse = {this.props.delCourse}/> : null
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
