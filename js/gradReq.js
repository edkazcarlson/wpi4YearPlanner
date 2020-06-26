function filterCourses(courses, allowedDepts){
    let toReturn = []
    courses.forEach(function(course){
        if (allowedDepts.includes(course.dept)){
            toReturn.push(course);
        }
    });
    return toReturn;
}

class courseModel{
    constructor(dept, level){
        this.dept = dept;
        this.level = parseInt(level);
    }
}

class gradRule{
    //rule is a function that takes a set of courses
    constructor(rule){
        this.rule = rule;
    }
    //returns an array of messages of what has not been fullfilled, if has been fullfilled, returns an empty array
    fulfilled(courses){
        return this.rule(courses);
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
            //break;
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
    return toReturn;
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
    console.log(courses);
    let toReturn = [];
    let sysBinFulfilled = false;
    let theoryBinFulfilled = false;
    let deisgnBinFulfilled = false;
    let socialBinFulfilled = false;
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
        console.log(course.dept);
        console.log(course.level);
        console.log(typeof(course.level));
        console.log(typeof(designBinCoures[0]));
        if (course.dept == 'CS'){
            console.log("Is a cs course");
            totalCourses++;
            if (conflict1000Level.includes(course.level)){ //if its a course that can have a conflict 
                if (!accelPair1000Taken){//if they haven't taken the course's conflict yet, make it so that they have an add a course to coureses taken
                    accelPair1000Taken = true;
                } else { //if they have taken the conflicting course, add a warning to the toReturn and do not add a course taken
                    toReturn.push("Taking a conflicting course, cannot take both 1101 and 1102 for credit");
                    totalCourses--;
                }
            } else if (conflictOOLevel.includes(course.level)){
                if (!accelPairOOTaken){//if they haven't taken the course's conflict yet, make it so that they have an add a course to coureses taken
                    accelPairOOTaken = true;
                } else { //if they have taken the conflicting course, add a warning to the toReturn and do not add a course taken
                    toReturn.push("Taking a conflicting course, cannot take both 2102 or 2103 or 210X for credit");
                    totalCourses--;
                }
            } else if (conflictSys.includes(course.level)){
                if (!sysPairTaken){//if they haven't taken the course's conflict yet, make it so that they have an add a course to coureses taken
                sysPairTaken = true;
                } else { //if they have taken the conflicting course, add a warning to the toReturn and do not add a course taken
                    toReturn.push("Taking a conflicting course, cannot take both 2301 and 2303 for credit");
                    totalCourses--;
                }
            }


            if (course.level > 4000){
                highLevelCredCount++;
            }
            if (sysBinCourses.includes(course.level)){
                sysBinFulfilled == true;
            } else if (theoryBinCoures.includes(course.level)){ 
                theoryBinFulfilled = true;
            } else if (designBinCoures.includes(course.level)){
                deisgnBinFulfilled = true;
            } else if (course.level == 3043){
                socialBinFulfilled = true;
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
    
    if(!sysBinFulfilled){
        toReturn.push("Need at least 1 course from the systems bin (3013, 4513, 4515, 4516)");
    }
    if (!theoryBinFulfilled){
        toReturn.push("Need at least 1 course from the theory bin (3133, 4120, 4123, 4536)")
    }
    if (!deisgnBinFulfilled){
        toReturn.push("Need at least 1 course from the design bin (3041, 3431, 3733, 4233)")
    }
    if (!socialBinFulfilled){
        toReturn.push("Need at least 1 course from the ethics bin (CS 3043, GOV 2314, GOV 2315, ID 2314, STS 2208, IMGD 2000, IMGD 2001)")
    }
    if (highLevelCredCount < 5){
        toReturn.push("Need at least 5, 4000 level or higher courses");
    }
    if (totalCourses < 15){
        toReturn.push("Need at least 15 non-MQP cs courses");
    }
    return toReturn;
});

let csMajorMathReq = new gradRule(function(courses){
    courses = filterCourses(courses, ['MA']);
    let probFulfilled = false;
    let statsFulfilled = false;
    let atMostFour1000 = false;
    let creditFullfilled = false;
    let creditsCounted = 0;
    let thousandLevelCoursesTaken = 0;
    courses.forEach(function(course){
        if (course.level < 2000){
            thousandLevelCoursesTaken++;
            if (thousandLevelCoursesTaken <= 4){
                creditsCounted++;
            }
        } else {
            creditsCounted++;
            if (course.level == 2631 || course.level == 2621){
                probFulfilled = true;
            } else if (course.level == 2611 || course.level == 2612){
                statsFulfilled = true;
            }
        }
    });
    let toReturn = [];
    if (!probFulfilled){
        toReturn.push('Need to take a probability class, MA 2631 or 2631');
    }
    if (!statsFulfilled){
        toReturn.push('Need to take a statistics class, MA 2611 or MA 2612');
    }
    if (creditsCounted < 7){
        toReturn.push('Need at least 7 math courses');
    }
    return toReturn;
});

let csMajorSciEngReq = new gradRule(function(courses){
    courses = filterCourses(courses, ['BB', 'BME', 'CE', 'CH', 'CHE', 'ECE', 'ES', 'GE', 'ME', 'PH', 'RBE']);
    let hardSciTaken = new Map([['BB', 0], ['CH',0], ['GE',0], ['PH',0]]);
    let hardSci = ['BB', 'CH', 'GE', 'PH'];
    let coursesTaken = courses.size;
    let atLeastTwoTaken = false;
    courses.forEach(function(course){
        if (hardSci.includes(course.dept)){
            console.log("hard sci inclues: " + course.level + course.dept);
            hardSciTaken.set(course.dept, hardSciTaken.get(course.dept) + 1);
            console.log(hardSciTaken);
        }
    });
    hardSciTaken.forEach(function(val,key,map){
        console.log(val)
        if (val >= 2){
            atLeastTwoTaken = true;
        }
    });

    let toReturn = [];
    if (coursesTaken < 5){
        toReturn.push('Need at least 5 Science or Engineering classes');
    }
    if (!atLeastTwoTaken){
        toReturn.push('Need to take at least two courses in the same hard science discipline (BB, CH, GE, PH)');    
    }
    if (hardSciTaken < 3){
        toReturn.push('Need to take at least two hard science courses.');
    }
    return toReturn;
});

let meMajorReq = new gradRule(function(courses){
    courses = filterCourses(courses, ['MA', 'PH', 'BB', 'BCB', 'CH', 'CS', 'GE', 'AE', 'AREN', 'BME', 'CE', 'CHE', 'ECE', 'ES', 'ME', 'RBE']);
    let mathCourseLevelsNeed = new Map([[1021, 'Need to take MA 1021 Calculus 1'],[1022, 'Need to take MA 1022 Calculus 2'],[1023, 'Need to take MA 1023 Calculus 3'],
    [1024, 'Need to take MA 1024 Calculus 4'],[2051, 'Need to take MA 2051 Ordinary Differential Equations'],[2071, 'Need to take MA 2071 Linear Algebra']]);
    let requiredESLevel = [2501, 2502, 2503, 3004, 3003, 2001];
    let requiredEsCourses = new Map();
    requiredESLevel.forEach(function(level){
        requiredEsCourses.set(level, String.format('Need to take ES %d', strinlevel));
    })
    let toReturn =  [];
    let courseToRemove = [];
    let chCount = 0;
    let phCount = 0;
    let req38Done = false;
    courses.forEach(function(course){
        if (course.dept == 'MA'){
            mathCourseLevelsNeed.delete(course.level);
            courseToRemove.push(courseToRemove);
        } else if (course.dept == 'PH'){
            phCount++;
            courseToRemove.push(course)
        } else if (course.dept == 'CH') {
            chCount++;
            courseToRemove.push(courseToRemove);
        } else if (course.dept == 'CS'){
            if (course.level == 1004 || course.level == 1101){
                req38Done = true;
                courseToRemove.push(courseToRemove);
            }
        }
    });
    courseToRemove.forEach(function(course){
        courses.delete(course);
    });
    let mathSciCourses = filterCourses(courses, ['MA', 'PH', 'BB', 'BCB', 'CH', 'CS', 'GE']);
    if (mathSciCourses.size < 2){
        toReturn.push('Need at least 2 miscellaneous math and science courses');
    }
    mathCourseLevelsNeed.forEach(function(val,key,map){
        toReturn.push(val);
    });
    if ((phCount > 1 && chCount > 2) || (chCount > 1 && phCount > 2)){
        toReturn.push('Need at least 2 physics courses and 1 chemsitry course or 1 physics course and 2 chemistry courses');
    }

    let designCoursesToRemove = [];
    let req30Done = false;
    let req30Courses = [4320, 4322, 4810];
    let req34Done = false;
    let req34Courses = [4422, 4429];
    let req31Done = false;
    
    courses.forEach(function(course){
        if (course.dept == 'ES'){
            requiredEsCourses.delete(course.level);
            designCoursesToRemove.push(course);
        } else if (course.dept == 'ME'){
            if (req30Courses.includes(course.level)){
                req30Done = true;
                designCoursesToRemove.push(course);
            } else if (req34Courses.includes(course.level)){
                req34Courses = true;
                designCoursesToRemove.push(course);
            }
        }
    });

});


class majorGradReq{
    constructor(){
        this.reqs = [huaReq, huaCapstoneReq, ssReq, iqpReq, mqpReq];
    }
    addReqs(specificReq){
        this.reqs = this.reqs.concat(specificReq);
    }
    canGraduate(courses){
        let courseObjSet = new Set();
        courses.forEach(function(course){
            courseObjSet.add(new courseModel(course[0], course[1]));
        });
        let changesNeeded = [];
        this.reqs.forEach(function(req){
            changesNeeded = changesNeeded.concat(req.fulfilled(courseObjSet));
        });
        if (courses.size < 45 && changesNeeded.size == 0){
            changesNeeded = changesNeeded.concat("Need 3 free elective courses");
        }
        
        return changesNeeded;
    }
}

var csMajor = new majorGradReq();
csMajor.addReqs([csMajorCSReq, csMajorMathReq, csMajorSciEngReq]);

