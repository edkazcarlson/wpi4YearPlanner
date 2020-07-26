import React, { Component } from 'react'
import { Button } from '@material-ui/core';

export class StudentResourcesPage extends Component {
    constructor(props){
        super(props);
        this.state = {courseRes: this.courseResList(), stressRes: this.stressResList()}
    }

    courseResList(){
        let courseList = [];
        courseList.push(['Tracking Sheets', "https://www.wpi.edu/student-experience/resources/academic-advising/program-tracking-sheets"]);
        courseList.push(['Planner', "https://planner.wpi.edu/"]);
        courseList.push(['Registrar Course Schedule', "https://www.wpi.edu/offices/registrar/course-registration/schedules"]);
        courseList.push(['Oscar Course evals', "https://oscar.wpi.edu/"]);
        courseList.push(['Rate My Professor', 'https://www.ratemyprofessors.com/campusRatings.jsp?sid=1220']);  
        courseList.push(['Bannerweb', 'https://bannerweb.wpi.edu/']);
        courseList.push(['Academic calendars and catalogs', 'https://www.wpi.edu/academics/calendar-catalogs'])
        courseList.push(['Project Catalog', 'https://eprojects.wpi.edu/'])
        return courseList;
    }

    stressResList(){
        let stressList = [];
        stressList.push(['K-on', "https://myanimelist.net/anime/5680/K-On", 'https://cdn.myanimelist.net/images/anime/10/76120.jpg']);
        stressList.push(['Yuru Camp', "https://myanimelist.net/anime/34798/Yuru_Camp%E2%96%B3", 'https://cdn.myanimelist.net/images/anime/4/89877.jpg']);
        stressList.push(['Aria', "https://myanimelist.net/anime/477/Aria_the_Animation", 'https://cdn.myanimelist.net/images/anime/2/77620.jpg']);
        stressList.push(['Usagi Drop', "https://myanimelist.net/anime/10162/Usagi_Drop", 'https://cdn.myanimelist.net/images/anime/2/29665.jpg']);
        stressList.push(['Yotsuba To', "https://myanimelist.net/manga/104/Yotsuba_to", 'https://cdn.myanimelist.net/images/manga/3/57369.jpg']);
        stressList.push(['Yokohama Kaidashi Kikou', "https://myanimelist.net/manga/4/Yokohama_Kaidashi_Kikou", 'https://cdn.myanimelist.net/images/manga/1/171813.jpg']);
        return stressList;
    }
    


    render() {
        return (
            <div style={{minHeight: '100vh'}}>
                <a href = "./"><Button variant = "outlined">Return to main page</Button></a>
                <h1 id = "CourseResources" style = {{textAlign: 'center'}}>Course Resources</h1>
                <ul id = "CourseResourcesList" style = {{width: '50%', margin: 'auto'}}>
                    {this.state.courseRes.map((tuple) => {
                        return <li style = {{width: '50%', margin: 'auto', fontSize : 16}} key = {tuple[0]}><a href = {tuple[1]}>{tuple[0]}</a></li>
                    })}
                </ul>
                <h1 id = "Stress Resources" style = {{textAlign: 'center'}}>Stress Resoucres</h1>
                <div id = "StressResourcesList" className="yearWrapper" 
                style = {{flex: 'auto', flexWrap : 'wrap'}} >
                    {this.state.stressRes.map((tuple, index) => {
                        console.log(index)
                        return (
                        <a style = {{padding: 10, margin: 'auto'}} href = {tuple[1]} target="_blank" rel="noopener noreferrer">
                            <img width = "225" height = "330" src = {tuple[2]} alt = {tuple[0]} onClick = {() => {window.open(tuple[1])}}></img>
                        </a>);
                    })}
                </div>
            </div>
        )
    }
}

export default StudentResourcesPage
