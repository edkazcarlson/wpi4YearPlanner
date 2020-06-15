import { relative } from "path";

function filterCourses(courses, allowedDepts){
    let toReturn = []
    courses.forEach(function(course){
        if (allowedDepts.includes(course.dept)){
            toReturn.push(course);
        }
    });
    return toReturn;
}

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
    let courseToBucket = new Map();
    courseToBucket.set('AR', ['Art']);
    courseToBucket.set('EN', ['Art', 'Lang', 'Lit']);
    courseToBucket.set('TH', ['Art']);
    courseToBucket.set('MU', ['Art']);
    courseToBucket.set('AB', ['Lang']);
    courseToBucket.set('CN', ['Lang']);
    courseToBucket.set('GN', ['Lang']);
    courseToBucket.set('SP', ['Lang']);
    courseToBucket.set('WR', ['Lit']);
    courseToBucket.set('RH', ['Lit']);
    courseToBucket.set('HI', ['Hist']);
    courseToBucket.set('HU', ['Hist']);
    courseToBucket.set('INTL', ['Hist']);
    courseToBucket.set('PY', ['Phil']);
    courseToBucket.set('RE', ['Phil']);

    let deptThatCanCountTowards = [];
    courseToBucket.forEach(function(val, key){
        deptThatCanCountTowards.push(val);
    })

    let huaCourses = filterCourses(courses, deptThatCanCountTowards);



    let buckets = new Map();
    huaCourses.forEach(course => {
        let bucketArr = courseToBucket.get(couse);
        bucketArr.forEach( bucket => {
            if (buckets.has(bucket)){
                buckets.set(bucket, buckets.get(bucket) + 1);
            } else {
                buckets.set(bucket, 1);
            }
        });
    });
    let depthCountFulfilled = false;
    let depth = null;
    buckets.forEach(function(value, key, map){
        if (key >= 3){
            depthFulfilled = true;
            depth = value;
            break;
        }
    });

    let depthLevelFulfilled = false;
    let breadthFulfilled = false;
    huaCourses.forEach(course =>{
        if (course.dept == depth){
            if (course.level > 2000){
                depthLevelFulfilled = true;
            }
        } else {
            breadthFulfilled = true;
        }
    })

    let totalCourseCountFulfilled = huaCourses.size >= 5;
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

let huaCapstoneReq = new gradRule(function(courses){
    let passing = false;
    courses.forEach(course => {
        if (course.dept == 'HU' && (course.level == 3900 || course.level == 3910)){
            passing = true;
        }
    })
    let toReturn = [];
    if (!passing){
        toReturn.push('No capstone selected');
    }
    return toReturn;
});

let ssReq = new gradRule(function(courses){
    courses = filterCourses(courses, ['ECON', 'ENV', 'GOV', 'PSY', 'SD', 'SOC', 'SS', 'STS', 'ID2050']);
    courses = courses.filter(function(course){
        if (course.dept == 'ID' && course.level != '2050'){
            return true;
        }

    });
    let passing = false;
    passing = courses.size >= 2;
    let toReturn = [];
    if (!passing){
        toReturn.push('Need 2 social science classes');
    }
    return toReturn;
});

let iqpReq = new gradRule(function(courses){
    courses = filterCourses(courses, 'IQP');
    let passing = courses.size >= 3;
    let toReturn = [];
    if (!passing){
        toReturn.push('Need to take IQP');
    }
    return toReturn;
});

let mqpReq = new gradRule(function(courses){
    courses = filterCourses(courses, 'MQP');
    let passing = courses.size >= 3;
    let toReturn = [];
    if (!passing){
        toReturn.push('Need to take MQP');
    }
    return toReturn;
});

let csMajorCSReq = new gradRule(function(courses){
    let sysBinFulfilled = false;
    let theoryBinFulfilled = false;
    let deisgnBinFulfilled = false;
    let socialBinFulfilled = false;
    let fiveThirds4000OrHigherFulfilled = false;
    let highLevelCredCount = 0;
    let totalCourseCountFulfilled = false;
    let totalCourses = 0;
    let accelPair1000Taken = false;
    let accelPairOOTaken = false;
    let sysPairTaken = false;
    let sysBinCourses = [3013, 4513, 4515, 4516];
    let theoryBinCoures = [3133, 4120, 4123, 4536];
    let designBinCoures = [3041, 3431, 3733, 4233];
    let conflict1000Level = [1101, 1102];
    let conflictOOLevel = [2102, 2103, '210X'];
    let conflictSys = [2301, 2303];

    courses.forEach(course => {
        if (course.dept == 'CS'){
            if (conflict1000Level.includes(course.level)){ //if its a course that can have a conflict 
                //if they haven't taken the course's conflict yet, make it so that they have an add a course to coureses taken
                //if they have taken the conflicting course, add a warning to the toReturn and do not add a course taken

                
            }


            if (course.level > 4000){
                highLevelCredCount++;
            }
            if (sysBinCourses.includes(course.level)){
                sysBinFulfilled == true;
            } else if (theoryBinCoures.includes(course.level)){ 
                theoryBinFulfilled = true;
            } else if (designBinCoures.includes(course.level)){
                theoryBinFulfilled = true;
            }
        } else {
            switch(course.dept){
                case 'GOV':
                    if (course.level == 2314 || course.level == 2315){
                        socialBinFulfilled = true;
                    }
                    break;
                case 'ID':
                    if (course.level == 2314){
                        socialBinFulfilled = true;  
                    }
                    break;
                case 'STS':
                    if (course.level == 2208){
                        socialBinFulfilled = true;
                    }
                    break;
                case 'IMGD':
                    if (course.level == 2000 || couse.level == 2001){
                        socialBinFulfilled = true;
                    }
                    break;
            }
        }

    });
});

let csMajorMathReq = new gradRule(function(courses){

});

let csMajorSciEngReq = new gradRule(function(courses){

});

class majorGradReq{
    constructor(){
        this.reqs = [];
    }
    addReq(){

    }
}

