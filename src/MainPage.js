import React, { Component } from 'react'
import CourseSearcher from './Components/CourseSearcher'
import GradReqsList from './Components/GradReqsList'
import StudentData from './Components/StudentData'
import Info from './Components/Info'
import Warnings from './Components/Warnings'
import Board from './Components/Board'
import './css/auto-complete.css'
import './css/index.css'
import './css/skeleton.css'




export class MainPage extends Component {
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
    this.state = {courseToAdd : '', 
                  courses : courseGrid, 
                  outOfWPICourses: outOfWPICourses, 
                  delCourse: this.delCourse,
                  major: 'CS',
                  courseJSON : null
                }
    if (window.location.href == 'https://edkazcarlson.github.io/wpi4YearPlanner/#/'){
      fetch('data/allCourses.json')
      // .then((resp) => {console.log(resp.text())})
      .then((response) => (response.json()))
      .then((data) => {console.log(data); this.setState({courseJSON : data})});
      this.courseSet = new Set();
    } else {
      console.log()
      fetch('wpi4YearPlanner/data/allCourses.json')
      // .then((resp) => {console.log(resp.text())})
      .then((response) => (response.json()))
      .then((data) => {console.log(data); this.setState({courseJSON : data})});
      this.courseSet = new Set();
    }
  }

  addCourse = (courseName) => {
    if (this.courseSet.has(courseName)){
      alert("Already taken this course.");
    } else if (this.state.courseJSON.hasOwnProperty(courseName.split(" ")[0] + '.json')){
      this.courseSet.add(courseName);
      this.setState({courseToAdd: courseName});
      let copy = this.state.courses;
      copy[0][0].push(courseName);
      this.setState({courses: copy});
    } else {
      alert("No course with this name exists");
    }
  }

  changeMajor = (newMajor) => {
    this.setState({major: newMajor});
  }

  moveCourse = (courseName, fromTuple, toTuple, fromOut, toOut) => {
    if (!fromOut && !toOut){ //stays in normal bounds
      let copy = this.state.courses;
      copy[fromTuple[0]][fromTuple[1]] = copy[fromTuple[0]][fromTuple[1]].filter(function(termCourse){
        return termCourse != courseName;
      });
      copy[toTuple[0]][toTuple[1]].push(courseName);
      this.setState({courses: copy});
    } else if (!fromOut && toOut){//starts in ends out
      let copy = this.state.courses;
      copy[fromTuple[0]][fromTuple[1]] = copy[fromTuple[0]][fromTuple[1]].filter(function(termCourse){
        return termCourse != courseName;
      });
      let outOfCopy = this.state.outOfWPICourses;
      outOfCopy.push(courseName);
      this.setState({courses: copy});
      this.setState({outOfWPICourses: outOfCopy});
    } else if (fromOut && !toOut){ //starts out ends in
      let outOfCopy = this.state.outOfWPICourses;
      outOfCopy = outOfCopy.filter(function(termCourse){
        return termCourse != courseName;
      });
      let mainCopy = this.state.courses;
      mainCopy[toTuple[0]][toTuple[1]].push(courseName);
      this.setState({courses: mainCopy});
      this.setState({outOfWPICourses: outOfCopy});
    } else {
      //stays out
    }
  }

  delCourse = (toDel) =>{
    let normalCourseCpy = this.state.courses.map((yr) => {
      let yrList = [];
      yr.map((term) => {
        let filterTerm = term.filter((name) => (name != toDel));
        yrList.push(filterTerm);
      })
      return yrList;
    });
    this.setState({courses: normalCourseCpy});
    this.setState({outOfWPICourses: this.state.outOfWPICourses.filter((name) => (toDel != name))})
  }
  
  render() {
    return (
      <div>
        <h2 className="section-title"><span>4 Year Planner</span></h2>
        <div className = "holy-grail-body customBody">
          <div className = "holy-grail-sidebar-1"></div>
          <Board delCourse = {this.state.delCourse} 
                  outOfWPICourses = {this.state.outOfWPICourses} 
                  courses = {this.state.courses}
                  newCourse = {this.state.courseToAdd}
                  moveCourse = {this.moveCourse.bind(this)}/>
          <div id = "sidebar" className = "sidebar hg-sidebar" style = {{textAlign: 'center'}}>
              <CourseSearcher addCourse = {this.addCourse.bind(this)}/>
              <StudentData changeMajor = {this.changeMajor} major = {this.state.major}/>
              <Warnings courseJSON = {this.state.courseJSON}
               courses = {this.state.courses} 
               outOfWPICourses = {this.state.outOfWPICourses}/>
              <Info/>
          </div>
          <GradReqsList major = {this.state.major} courses = {this.state.courses} outOfWPICourses = {this.state.outOfWPICourses}/>
        </div>
      </div>
    )
  }
}


export default MainPage
