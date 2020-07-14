function filterCourses(courses, allowedDepts){
    let list = [];
    courses.forEach(function(course){
        list.push(course);
    });
    let filtered = list.filter(function(course){
        return allowedDepts.indexOf(course.dept) != -1});
    return filtered;
}

function includesCourse(courses, dept, level){
    let toReturn = false;
    courses.forEach(function(course){
        if (course.dept  == dept && course.level == level){
            toReturn = true;
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
        deptThatCanCountTowards.push(key);
    })

    let huaCourses = filterCourses(courses, deptThatCanCountTowards);


    let buckets = new Map();
    huaCourses.forEach(course => {
        let bucketArr = courseToBucket.get(course);
        if (bucketArr != null){
            bucketArr.forEach( bucket => {
                if (buckets.has(bucket)){
                    buckets.set(bucket, buckets.get(bucket) + 1);
                } else {
                    buckets.set(bucket, 1);
                }
            });
        }
    });
    let depthCountFulfilled = false;
    let depth = null;
    buckets.forEach(function(value, key, map){
        if (key >= 3){
            depthCountFulfilled = true;
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
        if (course.dept == 'CS'){
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
                sysBinFulfilled = true;
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
                    if (course.level == 2000 || course.level == 2001){
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
    //first do the most restrictive requirements, delete those from the course list
    let toReturn = [];
    let meCourses = filterCourses(courses, ['MA', 'PH', 'BB', 'BCB', 'CH', 'CS', 'GE', 'AE', 'AREN', 'BME', 'CE', 'CHE', 'ECE', 'ES', 'ME', 'RBE']);
    let requiredESLevel = [2501, 2502, 2503, 3004, 3003, 2001];
    let requiredEsCourses = new Map();
    requiredESLevel.forEach(function(level){
        requiredEsCourses.set(level, 'Need to take ES ' + level);
    });
    let requiredMALevel = [1021, 1022, 1023, 1024, 2051, 2071]
    let requiredMACourses = new Map();
    let req30Done = false;
    let req34Done = false;
    let req31WithES = false;
    let req31WithNonES = false;
    let req38WithME = false;
    let req38WithCS = false;
    let req38WithBME = false;
    requiredMALevel.forEach(function(level){
        requiredMACourses.set(level, 'Need to take MA ' + level);
    });
    let toDrop = [];
    meCourses.filter(function(course){
        if (course.dept == 'MA'){
            requiredMACourses.delete(course.level);
            return false;
        } else if (course.dept == 'ES'){
            requiredEsCourses.delete(course.level);
            return false;
        } else if (course.dept == 'ECE' && course.level == 1799){
            return false;
        }
        return true;
    });
    requiredMACourses.forEach(function(val,key,map){
        toReturn.push(val);
    });
    requiredEsCourses.forEach(function(val,key,map){
        toReturn.push(val);
    });

    toDrop = [];
    meCourses.forEach(function(course){
        if (!req30Done && (course.dept == 'ME' && (course.level == 4320 || course.level == 4322 || course.level == 4810))){
            req30Done = true;
            toDrop.push(course);
        } else if (course.dept == 'ES' && course.level == 3001){
            req31WithES = true;
        } else if ((course.dept == 'CH' && course.level == 3510) || (course.dept == 'PH' && course.level == 2101)){
            req31WithNonES = true;
        } else if (!req34Done && (course.dept == 'ME' && (course.level == 4422 || course.level == 4429))){
            req34Done = true;
            toDrop.push(course);
        } else if (course.dept == 'ME' && (course.level == 2312 && course.level == 4512)){
            req38WithME = true;
        } else if (course.dept == 'CS' && (course.level == 1101 || course.level == 1004)){
            req38WithCS = true;
        } else if (course.dept == 'BME' && course.level == 1004){
            req38WithBME = true;
        }
    });
    let req31Done = req31WithES || req31WithNonES;
    //see the # of mathsci courses, then decide if you can use them for specific row req or you can use for row 25/26
    let possibleMiscMathSciCourses = filterCourses(meCourses, ['MA', 'PH', 'BB', 'BCB', 'CH', 'CS', 'GE']);
    let leeWaySciCourses = possibleMiscMathSciCourses.length - 2;
    let mustUseSciForThermo = false;
    let clear = false;
    let engAbove2000Count = 0;
    if (leeWaySciCourses == 0 && (includesCourse(possibleMiscMathSciCourses, 'CS', 1101) || includesCourse(possibleMiscMathSciCourses, 'CS', 1004))){ 
        //must use cs class towards the mathsci req
        if (req38WithBME && req38WithME){
            engAbove2000Count++
        }
    } else if (leeWaySciCourses > 0 && (includesCourse(possibleMiscMathSciCourses, 'CS', 1101) || includesCourse(possibleMiscMathSciCourses, 'CS', 1004))){
        //can use cs course towards mathsci req, mathsci fullfilled no matter what
        if (req38WithME && !req38WithBME){//req 38 fullfilled, 1 course to final 5 elective
            engAbove2000Count++;
        }else if (req38WithME && req38WithBME){ //req 38 fullfilled, 1 course to final 5 electives
            engAbove2000Count++;
        } 
    } else if (leeWaySciCourses >= 0){//38 is fullfilled
        if (!(req38WithCS || req38WithBME || req38WithME)){
            toReturn.push("Need a programming course");
        }
    } else {//38 not fulfilled
        toReturn.push("Student selected courses (25/26) requirement not fulfilled");
    }
    toDrop.forEach(function(course){
        meCourses.delete(course);
    });
    let esMECount = filterCourses(meCourses, ['ES', 'ME']).length;
    let engCourses = filterCourses(meCourses, ['AE', 'AREN', 'BME', 'CE', 'CHE', 'ECE', 'RBE']);
    engCourses.forEach(function(course){
        if (course.level > 2000){
            engAbove2000Count++;
        }
    });
    console.log(engAbove2000Count);
    console.log(esMECount);
    if (engAbove2000Count + esMECount < 5){
        toReturn.push('Number of elective engineering courses at or above 2000 level and ES and ME courses at or above 1000 level '+
        'must be 4 if using ES3001 for thermo requirement, otherwise need 5.');
    }
    return toReturn;
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

function getMajorReq(major){
    let csMajor = new majorGradReq();
    csMajor.addReqs([csMajorCSReq, csMajorMathReq, csMajorSciEngReq]);
    var meMajor = new majorGradReq();
    meMajor.addReqs([meMajorReq]);
    let majorToReqMap = new Map([['CS', csMajor],['ME', meMajor]]);
    return majorToReqMap.get(major);

}