import { relative } from "path";

class course{
    constructor(dept, level){
        this.dept = dept;
        this.level = level;
    }
}

class gradRule{
    //rule is a function that takes a set of courses
    constructor(rule){
        this.coursesTowardsThisRule = new Set();
        this.rule = rule;
    }
    //returns an array of messages of what has not been fullfilled, if has been fullfilled, returns an empty array
    fulfilled(){
        return rule(this.coursesTowardsThisRule);
    }
}

let huaReq = new gradRule(function(courses){
    let depts = new Map();
    courses.forEach(course => {
        if (depts.has(course.dept)){
            depts.set(course, depts.get(course) + 1);
        } else {
            depts.set(course, 1);
        }
    });
    let depthCountFulfilled = false;
    let depth = null;
    depts.forEach(function(value, key, map){
        if (key >= 3){
            depthFulfilled = true;
            depth = value;
            break;
        }
    });

    let depthLevelFulfilled = false;
    let breadthFulfilled = false;
    courses.forEach(course =>{
        if (course.dept == depth){
            if (course.level > 2000){
                depthLevelFulfilled = true;
            }
        } else {
            breadthFulfilled = true;
        }
    })

    let totalCourseCountFulfilled = courses.size >= 5;
    let toReturn = [];
    if (!depthCountFulfilled){
        toReturn.push("Need at least 3 non capstone depth courses");
    }
    if (!depthLevelFulfilled){
        toReturn.push("Need at least 1 2000 level or highger course in your depth");
    }
    if (!breadthFulfilled){
        toReturn.push("Need at least 1 course outside of your depth bucket");
    }
    if (!totalCourseCountFulfilled){
        toReturn.push("Need at least 5 non capstone humanities courses");
    }
});




class majorGradReq{
    constructor(){
        this.reqs = [];
    }
    addReq(){

    }
}