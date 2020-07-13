import React, { Component } from 'react'
import CourseSearcher from './Components/CourseSearcher'
import GradReqs from './Components/GradReqsList'
import StudentData from './Components/StudentData'
import Info from './Components/Info'
import Warnings from './Components/Warnings'
import Board from './Components/Board'
import CustomLi from './Components/CustomLi'
import './css/auto-complete.css'
import './css/index.css'
import './css/dragula.css'
import './css/skeleton.css'


export class App extends Component {
  constructor(props){
    super(props);
    let courseGrid = [];
		let outOfWPICourses = [];
		for (let i = 0 ; i < 4 ; i++){
			let yearArray = []
			for (let j = 0; j < 4 ; j++){
				yearArray.push([]);
			}
			courseGrid.push(yearArray);
		}
    this.state = {courseToAdd : '', courses : courseGrid, outOfWPICourses: outOfWPICourses, delCourse: this.delCourse}
    this.courseSet = new Set();
  }

  addCourse = (courseName) => {
    if (this.courseSet.has(courseName)){
      alert("Already taken this course.");
    } else {
      this.courseSet.add(courseName);
      this.setState({courseToAdd: courseName});
      let copy = this.state.courses;
      copy[0][0].push(courseName);
      this.setState({courses: copy});
      this.setState({outOfWPICourses: new Set(['ooga booga'])})
      console.log(this.state)
    }

  }

  delCourse = (name) =>{

  }
  
  render() {
    return (
      <div>
        <p >{this.state.courseToAdd}</p>
        <h2 className="section-title"><span>4 Year Planner</span></h2>
        <div className = "holy-grail-body customBody">
          <div className = "holy-grail-sidebar-1"></div>
          <Board delCourse = {this.state.delCourse} 
                  outOfWPICourses = {this.state.outOfWPICourses} 
                  courses = {this.state.courses}/>
          <div id = "sidebar" className = "sidebar hg-sidebar">
              <CourseSearcher addCourse = {this.addCourse.bind(this)}/>
              <StudentData/>
              <button type="button" onClick="checkGradReq()">Check graduation requirements</button>
              <Warnings courses = {this.state.courses} outOfWPICourses = {this.state.outOfWPICourses}/>
              <Info/>
          </div>
          <GradReqs/>
        </div>
      </div>
    )
  }
}


export default App
