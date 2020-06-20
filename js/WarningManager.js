class CreditWarning{
    constructor(year, semester, warnings){
        this.semester = semester;
        this.warnings = warnings;
        this.DOM = document.createElement("div");
        this.DOM.id = year + '-' + semester + '-Credit-Warning';
        this.DOM.classList.add("warning");
        this.DOM.innerText = 'Too many courses for ' + year + ' ' + semester;
        warnings.appendChild(this.DOM);
    }

    remove(){
        this.DOM.remove();
    }
}

class CourseWarning{
    constructor(needingRequirement, theRequirement, warnings){
        this.needingRequirement = needingRequirement;
        this.theRequirement = theRequirement;
        this.DOM = document.createElement("div");
        this.DOM.id = needingRequirement + '-without-' + theRequirement+ '-req-Warning';
        this.DOM.innerText = needingRequirement + ' is without recommnded class: ' + theRequirement + "\n";
        this.DOM.classList.add("warning");
        console.log(this.DOM);
        warnings.appendChild(this.DOM);
    }

    hide(){
        return this.DOM.style.display = "none";
    }

    isHidden(){
        return this.DOM.style.display == "none";
    }

    reveal(){
        return this.DOM.style.display = "initial";
    }
}

class WarningManager{
    constructor(){
        this.courseWarningDOM = document.getElementById("CourseWarnings");
        this.creditWarningDOM = document.getElementById("CreditWarnings");
        this.courseWarnings = [];
        this.creditWarnings = [];
    }

    //curCourseJson is the JSON of the course being added
    addCourseWarning(courseName, curCourseJson){
        console.log(curCourseJson);
        let reqs = curCourseJson['req'];
        reqs.forEach(req => {
            let reqName = req[0] + req[1];

            let courseWarning = new CourseWarning(courseName, reqName, this.courseWarningDOM);
            this.courseWarnings.push(courseWarning);
            

        });
    }


    revealCourseWarning(needing, needed, reveal){
        this.courseWarnings.forEach(function(warning){
            console.log(warning)
            if (warning.needingRequirement == needing && warning.theRequirement == needed){
                console.log("found course warning")
                if (reveal){
                    warning.reveal();
                } else {
                    warning.hide();
                }
                
            }
        });
    }


    //hide course warning where this is the needing side
    hideCoursesNeeding(courseName){
        this.CourseWarning.forEach(function(warning){

        });
    }



    revealCoursesNeeding(courseName){

    }

    //hide course warning where this is the needed side
    hideCoursesNeeded(courseName){

    }

    revealCoursesNeeded(courseName){

    }

    addCreditWarning(year, term){
        let semName = null;
        if (term == 'A' || term == 'B'){
            semName = 'A-B';
        } else {
            semName = 'C-D';
        }
        let creditWarning = new CreditWarning(year, semName, this.creditWarnings);
        this.creditWarnings.push(creditWarning);

    }

    removeCreditWarning(year, term){
        let semName = null;
        if (term == 'A' || term == 'B'){
            semName = 'A-B';
        } else {
            semName = 'C-D';
        }
        this.creditWarnings.forEach(function(item, index, object){
            if (item.year == year && item.semester == semName){
                item.remove();
                object.splice(index, 1);
            }
        });
    }
}