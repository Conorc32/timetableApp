document.getElementById("colleges").onchange = changeListener;
document.getElementById("colleges2").onchange = changeListener2;
var cal = ics();
var eventsArray = [];

function changeListener(){
    var value = this.value
    var newDropdown = ""
    if (value == "arts"){
        newDropdown += "<option value='education'>School of Education</option>";
        newDropdown += "<option value='english'>School of English & Creative Arts</option>";
        newDropdown += "<option value='geography'>School of Geography, Archaeology and Irish Studies</option>";
        newDropdown += "<option value='history'>School of History & Philosophy</option>";
        newDropdown += "<option value='languages'>School of Languages, Literatures and Cultures</option>";
        newDropdown += "<option value='politics'>School of Political Science and Sociology</option>";
        newDropdown += "<option value='psychology'>School of Psychology</option>";
    }else if (value == "business"){
        newDropdown += "<option value='economics'>J.E. Cairnes School of Business & Economics</option>";
        newDropdown += "<option value='law'>School of Law</option>";
        newDropdown += "<option value='shannon'>Shannon College of Hotel Management</option>";
    } else if (value == "science"){
        newDropdown += "<option value='biology'>School of Biological and Chemical Sciences</option>";
        newDropdown += "<option value='computer'>School of Computer Science</option>";
        newDropdown += "<option value='engineering'>School of Engineering</option>";
        newDropdown += "<option value='mathematical'>School of Mathematical and Statistical Sciences</option>";
        newDropdown += "<option value='natural'>School of Natural Sciences</option>";
    } else if (value == "medicine"){
        newDropdown += "<option value='medicine'>School of Medicine</option>";
        newDropdown += "<option value='nursing'>School of Nursing & Midwifery</option>";
        newDropdown += "<option value='health'>School of Health Sciences</option>";
    }
    document.getElementById("schools").innerHTML = newDropdown;
}

function changeListener2(){
    var value = this.value
    var newDropdown = ""
    if (value == "arts"){
        newDropdown += "<option value='education'>School of Education</option>";
        newDropdown += "<option value='english'>School of English & Creative Arts</option>";
        newDropdown += "<option value='geography'>School of Geography, Archaeology and Irish Studies</option>";
        newDropdown += "<option value='history'>School of History & Philosophy</option>";
        newDropdown += "<option value='languages'>School of Languages, Literatures and Cultures</option>";
        newDropdown += "<option value='politics'>School of Political Science and Sociology</option>";
        newDropdown += "<option value='psychology'>School of Psychology</option>";
    }else if (value == "business"){
        newDropdown += "<option value='economics'>J.E. Cairnes School of Business & Economics</option>";
        newDropdown += "<option value='law'>School of Law</option>";
        newDropdown += "<option value='shannon'>Shannon College of Hotel Management</option>";
    } else if (value == "science"){
        newDropdown += "<option value='biology'>School of Biological and Chemical Sciences</option>";
        newDropdown += "<option value='computer'>School of Computer Science</option>";
        newDropdown += "<option value='engineering'>School of Engineering</option>";
        newDropdown += "<option value='mathematical'>School of Mathematical and Statistical Sciences</option>";
        newDropdown += "<option value='natural'>School of Natural Sciences</option>";
    } else if (value == "medicine"){
        newDropdown += "<option value='medicine'>School of Medicine</option>";
        newDropdown += "<option value='nursing'>School of Nursing & Midwifery</option>";
        newDropdown += "<option value='engineering'>School of Health Sciences</option>";
    }
    document.getElementById("schools2").innerHTML = newDropdown;
}

function createAndUpload() {
    addAllTableElementsToArray()
    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Uploading...";

    var courseTitle = document.getElementById("courseTitle2").value;

    for (let i = 0; i < eventsArray.length; i++) {
        let currEvent = eventsArray[i];
        let rrule  = "";
        let beginTime=currEvent[5].replace(":","");
        let endTime=currEvent[6].replace(":","") ;
        if (currEvent[7] != "once" && currEvent[7] != "YEARLY" && currEvent[7]!="DAILY") {
            rrule = {freq:currEvent[7], count:currEvent[8]};
        }
        cal.addEvent(currEvent[0], currEvent[1], currEvent[2], currEvent[3], currEvent[4], beginTime, endTime,rrule);
    }
    eventsArray = [];
    clearTable();

    var file = cal.blobForUpload();
    var newFile = new File([file], courseTitle+'.ics', {type: 'text/calendar'});

    var storageRef = firebase.storage().ref("images/" + newFile.name);
    var uploadTask = storageRef.put(newFile);
    uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    }, function (error) {
        console.log(error.message);
        document.getElementById("upload").innerHTML = "Upload Failed";
    }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            saveMessage2(downloadURL);
            return false;
        });
    });
}

function addEventToTimetable() {
    addAllTableElementsToArray()
    var subject = document.getElementById("subject").value
    var description = document.getElementById("description").value
    var location = document.getElementById("location").value
    var begin = document.getElementById("begin").value
    var end = document.getElementById("end").value
    var beginTime = document.getElementById("beginTime").value
    var endTime = document.getElementById("endTime").value
    var frequency = document.getElementById("frequency").value
    var freqCount = document.getElementById("freqCount").value
    eventsArray.push([subject, description, location, begin, end, beginTime, endTime, frequency, freqCount])
    addAllArrayElementsToTable();
    return false;
}

function saveMessage2(downloadURL) {
    var courseTitle = document.getElementById("courseTitle2").value;
    var school = document.getElementById("schools2").value;
    var college = document.getElementById("colleges2").value;
    var courseName = document.getElementById("courseName2").value;

    var newTimetableLinkRef = firebase.database().ref("timetableLink/" + courseTitle);

    newTimetableLinkRef.set({
        url: downloadURL,
        course: courseTitle,
        courseName: courseName,
        school: getSchoolFromSchoolString(school),
        college: college
    });
    ddocument.getElementById("upload2").innerHTML = "Upload Successful";
    setTimeout(function () {
        document.getElementById("upload2").innerHTML = "Upload";
    }, 3000);
    //Make file input empty
    return false;
}

function getFileContents(url) {
    var xhr = new XMLHttpRequest();
    //xhr.responseType = 'json';
    xhr.onload = function(event) {
        var json= xhr.response;
        console.log(json);      // now you read the file content
    };
    xhr.open('GET', url);
    xhr.send();
}

function getRemoveArrayButton(index) {
    return "<td><button type='button' onclick='removeElement(" +index+")'> Remove</button></td>"
}

function removeElement(index) {
    addAllTableElementsToArray();
    eventsArray.splice(index, 1);
    addAllArrayElementsToTable();
}

function getSchoolString(school) {
    switch (school) {
        case "education":
            return "School of Education";
        case "english":
            return "School of English & Creative Arts";
        case "geography":
            return "School of Geography, Archaeology and Irish Studies";
        case "history":
            return "School of History & Philosophy";
        case "languages":
            return "School of Languages, Literatures and Cultures";
        case "politics":
            return "School of Political Science and Sociology";
        case "economics":
            return "J.E. Cairnes School of Business & Economics";
        case "law":
            return "School of Law";
        case "shannon":
            return "Shannon College of Hotel Management";
        case "biology":
            return "School of Biological and Chemical Sciences";
        case "computer":
            return "School of Computer Science";
        case "engineering":
            return "School of Engineering";
        case "mathematical":
            return "School of Mathematical and Statistical Sciences";
        case "natural":
            return "School of Natural Sciences";
        case "medicine":
            return "School of Medicine";
        case "nursing":
            return "School of Nursing & Midwifery";
        case "health":
            return "School of Health Sciences";
        default:
            return school;
    }
}

function getSchoolFromSchoolString(string) {
    switch (string) {
        case "School of Education":
            return "education";
        case "School of English & Creative Arts":
            return "english";
        case "School of Geography, Archaeology and Irish Studies":
            return "geography";
        case "School of History & Philosophy":
            return "history";
        case "School of Languages, Literatures and Cultures":
            return "languages";
        case "School of Political Science and Sociology":
            return "politics";
        case "J.E. Cairnes School of Business & Economics":
            return "economics";
        case "School of Law":
            return "law";
        case "Shannon College of Hotel Management":
            return "shannon";
        case "School of Biological and Chemical Sciences":
            return "biology";
        case "School of Computer Science":
            return "computer";
        case "School of Engineering":
            return "engineering";
        case "School of Mathematical and Statistical Sciences":
            return "mathematical";
        case "School of Natural Sciences":
            return "natural";
        case "School of Medicine":
            return "medicine";
        case "School of Nursing & Midwifery":
            return "nursing";
        case "School of Health Sciences":
            return "health";
        default:
            return string;
    }
}

function hideDivs() {
    let selectValue =document.getElementById("uploadOption").value
    let newDivs = document.getElementsByClassName("newUpload");
    let existingDivs = document.getElementsByClassName("existingUpload");
    if (selectValue==="new") {
        for(let i =0; i< newDivs.length;i++) {
            newDivs[i].style.display = "block";
        }
        for(let i =0; i< existingDivs.length;i++) {
            existingDivs[i].style.display = "none";
        }
    } else {
        for(let i =0; i< newDivs.length;i++) {
            newDivs[i].style.display = "none";
        }
        for(let i =0; i< existingDivs.length;i++) {
            existingDivs[i].style.display = "block";
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    let newDivs = document.getElementsByClassName("newUpload");
    for(let i =0; i< newDivs.length;i++) {
        newDivs[i].style.display = "none";
    }
});

function clearTable() {
    document.getElementById("events").innerHTML =""
}

function addAllTableElementsToArray() {
    let length = eventsArray.length
    eventsArray = []
    for(let i=0;i<length; i++) {
        let iString = ""+i
        let subject = document.getElementById("subject"+iString).value
        let description = document.getElementById("description"+iString).value
        let location = document.getElementById("location"+iString).value
        let beginDate = document.getElementById("begin"+iString).value
        let endDate = document.getElementById("end"+iString).value
        let beginTime = document.getElementById("beginTime"+iString).value
        let endTime = document.getElementById("endTime"+iString).value
        let frequency = document.getElementById("frequency"+iString).value
        let freqCount = document.getElementById("freqCount"+iString).value
        eventsArray.push([subject, description, location, beginDate, endDate,  beginTime, endTime, frequency, freqCount])
    }

}

function  addAllArrayElementsToTable() {
    document.getElementById("events").innerHTML =""
    for(let i=0; i<eventsArray.length; i++) {
        let subject = eventsArray[i][0]
        let description = eventsArray[i][1]
        let location = eventsArray[i][2]
        let beginDate = eventsArray[i][3]
        let endDate = eventsArray[i][4]
        let beginTime = eventsArray[i][5]
        let endTime = eventsArray[i][6]
        let frequency = eventsArray[i][7]
        let freqCount = eventsArray[i][8]
        let num = i
        let onceSelected = ""
        let dailySelected = ""
        let weeklySelected = ""
        let monthlySelected = ""
        let yearlySelected = ""

        if (frequency === "once") {
            onceSelected = " selected"
        } else if (frequency === "DAILY") {
            dailySelected = " selected"
        } else if (frequency === "WEEKLY") {
            weeklySelected = " selected"
        } else if (frequency === "MONTHLY") {
            monthlySelected = " selected"
        } else {
            yearlySelected = " selected"
        }

        let build = "<tr>" +
            "<td><input type='text' class='form-control' id='subject" + num + "' value='" + subject + "'></td>" +
            "<td><input type='text' class='form-control' id='description" + num + "'value='" + description + "'></td>" +
            "<td><input type='text' class='form-control' id='location" + num + "' value='" + location + "'></td>" +
            "<td><input type='text' class='form-control' id='begin" + num + "' value='" + beginDate + "'></td>" +
            "<td><input type='text' class='form-control' id='end" + num + "' value='" + endDate + "'></td>" +
            "<td><input type='time' class='form-control' id='beginTime" + num + "' value='" + beginTime + "'></td>" +
            "<td><input type='time' class='form-control' id='endTime" + num + "' value='" + endTime + "'></td>" +
            "<td><select name='Frequency' id='frequency" + num + "' class='form-select' value='" + frequency + "'>" +
            "                                <option value='once'" + onceSelected + ">One off</option>" +
            "                                <option value='DAILY'" + dailySelected + ">Daily</option>" +
            "                                <option value='WEEKLY'" + weeklySelected + " >Weekly</option>" +
            "                                <option value='MONTHLY'" + monthlySelected + " >Monthly</option>" +
            "                                <option value='YEARLY'" + yearlySelected + " >Yearly</option>" +
            "                            </select></td>" +
            "<td><input type='text' class='form-control' id='freqCount" + num + "' placeholder='Enter length of time to repeat i.e. 12 weeks' value='" + freqCount + "'</td>" +
            getRemoveArrayButton(num) +
            "</tr>"


        document.getElementById("events").innerHTML += build
    }
}