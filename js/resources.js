function addLink(value, key, list){
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = value;
    a.innerText = key;
    a.target = '_blank';
    li.appendChild(a);
    list.appendChild(li);
}

function myLoad(){
    let courseResList = document.getElementById('CourseResourcesList');
    let courseMap = new Map();
    courseMap.set('Tracking Sheets', "https://www.wpi.edu/student-experience/resources/academic-advising/program-tracking-sheets");
    courseMap.set('Planner', "https://planner.wpi.edu/");
    courseMap.set('Registrar Course Schedule', "https://www.wpi.edu/offices/registrar/course-registration/schedules");
    courseMap.set('Oscar Course evals', "https://oscar.wpi.edu/");
    courseMap.set('Rate My Professor', 'https://www.ratemyprofessors.com/campusRatings.jsp?sid=1220');  
    courseMap.forEach(function(value, key, map){
        addLink(value,key,courseResList);
    });
    let stressResList = document.getElementById('StressResourcesList');
    let stressMap = new Map();
    stressMap.set('K-on', "https://myanimelist.net/anime/5680/K-On");
    stressMap.set('Yuru Camp△', "https://myanimelist.net/anime/34798/Yuru_Camp%E2%96%B3");
    stressMap.set('Aria', "https://myanimelist.net/anime/477/Aria_the_Animation");
    stressMap.set('Usagi Drop', "https://myanimelist.net/anime/10162/Usagi_Drop");
    stressMap.set('Yotsuba To', "https://myanimelist.net/manga/104/Yotsuba_to");
    stressMap.set('Yokohama Kaidashi Kikou', "https://myanimelist.net/manga/4/Yokohama_Kaidashi_Kikou");
    stressMap.forEach(function(value, key, map){
        addLink(value,key,stressResList);
    });
}
window.onload = myLoad;