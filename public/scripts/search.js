const firebaseConfig = {
    apiKey: "AIzaSyC0tC_4a6VRHFHrmT9wTXMMW3pMZA2Vjmk",
    authDomain: "timetabledistribution.firebaseapp.com",
    databaseURL: "https://timetabledistribution-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "timetabledistribution",
    storageBucket: "timetabledistribution.appspot.com",
    messagingSenderId: "86161484106",
    appId: "1:86161484106:web:9e5a5e157cfc2105c839b3",
    measurementId: "G-74XC2ZTDCY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let searchedEventsArray = []
let courseID=""
let nameOfCollege=""
let nameOfCourse=""
let nameOfSchool=""


function getIndividualFile() {
    var ref = firebase.database().ref("timetableLink")
    var searchModule = document.getElementById("courseTitle").value
    var searchOutput = document.getElementById("searchOutput")
    var found = false
    var build = ""
    let url = ""
    searchedEventsArray=[]
    document.getElementById("eventOutput").innerHTML =""


    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData.course == searchModule) {
                build += "<tr><td id ='course'>" + childData.course + "</td>" +
                    "<td id='college'>" + childData.college + "</td>" +
                    "<td id='school'>" + getSchoolString(childData.school) + "</td>" +
                    "<td id ='courseName'>" + childData.courseName + "</td>" +
                    "<td><a href='"+ childData.url +"'>Download</a>" + "</td></tr>"
                url=childData.url
                courseID=childData.course
                nameOfCollege=childData.college
                nameOfCourse=childData.courseName
                nameOfSchool=childData.school
                found = true
            }
        });

        if(found == true) {
            searchOutput.innerHTML = build;
            getFileContents(url)
        } else {
            searchOutput.innerHTML = "File not found."
        }

    });

}

function getFileContents(url) {
    var xhr = new XMLHttpRequest();
    //xhr.responseType = 'json';
    xhr.onload = function(event) {
        var json= xhr.response;

        const myArray = String(json).trim().split("\n");
        let eventNum=0;

        for (let i=0; i<myArray.length; i++) {
            if (String(myArray[i]).trim()==="BEGIN:VEVENT".trim()) {
                getEventDetailsAndAddToArray(myArray.slice(i, myArray.length), eventNum)
                eventNum++
            }
        }
    };
    xhr.open('GET', url);
    xhr.send();
}

function getEventDetailsAndAddToArray(event, num) {
    let subject = "Doesn't exist."
    let description = "Doesn't exist."
    let location = "Doesn't exist."
    let beginDate = "Doesn't exist."
    let endDate = "Doesn't exist."
    let beginTime = "Doesn't exist."
    let endTime = "Doesn't exist."
    let frequency = "Doesn't exist."
    let freqCount = "Doesn't exist."
    let onceSelected = ""
    let dailySelected= ""
    let weeklySelected= ""
    let monthlySelected = ""
    let yearlySelected = ""

    for (let i=0; i<event.length; i++) {
        if (String(event[i]).trim().slice(0,7)=="SUMMARY".trim()) {
            subject=String(event[i]).trim().split(";")[1].split(":")[1];
        }
        if (String(event[i]).trim().slice(0,11)=="DESCRIPTION".trim()) {
            description=String(event[i]).trim().slice(12);
        }
        if (String(event[i]).trim().slice(0,8)=="LOCATION".trim()) {
            location=String(event[i]).trim().slice(9);
        }
        if (String(event[i]).trim().slice(0,7)=="DTSTART".trim()) {
            let subEvent = String(event[i]).split(";")[1].split(":")
            beginDate=String(subEvent[1]).trim().slice(0,8);
            beginDate=beginDate.slice(4,6)+"/" + beginDate.slice(6,8) + "/" + beginDate.slice(0,4);
            beginTime=String(subEvent[1]).trim().slice(9);
            beginTime=beginTime.slice(0,2)+":"+beginTime.slice(2,4)
        }

        if (String(event[i]).trim().slice(0,5)==="DTEND".trim()) {
            let subEvent = String(event[i]).split(";")[1].split(":")
            endDate=String(subEvent[1]).slice(0,8);
            endDate=endDate.slice(4,6)+"/" + endDate.slice(6,8) + "/" + endDate.slice(0,4);
            endTime=String(subEvent[1]).slice(9);
            endTime=endTime.slice(0,2)+":"+endTime.slice(2,4)
        }
        if (String(event[i]).trim().slice(0,5)=="rrule".trim()) {
            let subEvent = String(event[i]).split(":")
            let subSub = subEvent[1].split(";")
            frequency=String(subSub[0]).trim().slice(5);
            freqCount=String(subSub[1]).trim().slice(6);
        }
    }

    if (frequency==="once") {
        onceSelected = "selected"
    } else if (frequency==="DAILY") {
        dailySelected="selected"
    } else if (frequency==="WEEKLY"){
        weeklySelected="selected"
    } else if (frequency==="MONTHLY") {
        monthlySelected="selected"
    } else {
        yearlySelected="selected"
    }
    console.log("beginDate:" + beginDate)
    console.log("endDate:" + endDate)
    console.log("begintime:" + beginTime)
    console.log("endTime:" + endTime)


    let build = "<tr><td><input type='text' className='form-control' id='subject"+ num +"' value='" +subject +"'></td>" +
        "<td><input type='text' class='form-control' id='description"+ num +"'value='"+ description +"'></td>" +
        "<td><input type='text' class='form-control' id='location"+ num +"' value='" + location +"'></td>" +
        "<td><input type='text' class='form-control' id='begin"+ num +"' value='" + beginDate +"'></td>" +
        "<td><input type='text' class='form-control' id='end"+ num +"' value='" + endDate +"'></td>" +
        "<td><input type='time' class='form-control' id='beginTime"+ num +"' value='" + beginTime +"'></td>" +
        "<td><input type='time' class='form-control' id='endTime"+ num +"' value='" + endTime +"'></td>" +
        "<td><select name='Frequency' id='frequency"+ num +"' class='form-select' value='"+frequency+"'>" +
        "                                <option value='once'" + onceSelected + ">One off</option>" +
        "                                <option value='DAILY'" + dailySelected + ">Daily</option>" +
        "                                <option value='WEEKLY'" + weeklySelected +" >Weekly</option>" +
        "                                <option value='MONTHLY'" + monthlySelected + " >Monthly</option>" +
        "                                <option value='YEARLY'" + yearlySelected + " >Yearly</option>" +
        "                            </select></td>" +
        "<td><input type='text' class='form-control' id='freqCount"+ num +"' placeholder='Enter length of time to repeat i.e. 12 weeks' value='"+freqCount+"'</td>" +
        getRemoveArrayButton(num) +
        "</tr>"

    searchedEventsArray.push([subject, description, location, beginDate, endDate, beginTime, endTime, frequency, freqCount])
    document.getElementById("eventOutput").innerHTML += build
}

function getRemoveArrayButton(index) {
    return "<td><button type='button' onclick='removeElement(" +index+")'> Remove</button></td>"
}

function removeElement(index) {
    let len = searchedEventsArray.length
    searchedEventsArray=[]

    for(let i=0;i<len;i++) {
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
        searchedEventsArray.push([subject, description, location, beginDate, endDate,  beginTime, endTime, frequency, freqCount])
    }

    searchedEventsArray.splice(index, 1)
    changeOccurredSoUpdateEventsTable()
}

function addBlankEventToTable() {
    let len = searchedEventsArray.length
    searchedEventsArray=[]

    for(let i=0;i<len;i++) {
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
        searchedEventsArray.push([subject, description, location, beginDate, endDate,  beginTime, endTime, frequency, freqCount])
    }

    searchedEventsArray.push(["", "", "", "", "", "", "", "", ""])
    changeOccurredSoUpdateEventsTable()
}

function changeOccurredSoUpdateEventsTable() {
    document.getElementById("eventOutput").innerHTML =""
    for(let i=0; i<searchedEventsArray.length; i++) {
        let subject = searchedEventsArray[i][0]
        let description = searchedEventsArray[i][1]
        let location = searchedEventsArray[i][2]
        let beginDate = searchedEventsArray[i][3]
        let endDate = searchedEventsArray[i][4]
        let beginTime = searchedEventsArray[i][5]
        let endTime = searchedEventsArray[i][6]
        let frequency = searchedEventsArray[i][7]
        let freqCount = searchedEventsArray[i][8]
        let num = i
        let onceSelected = ""
        let dailySelected= ""
        let weeklySelected= ""
        let monthlySelected = ""
        let yearlySelected = ""

        if (frequency==="once") {
            onceSelected = "selected"
        } else if (frequency==="DAILY") {
            dailySelected="selected"
        } else if (frequency==="WEEKLY"){
            weeklySelected="selected"
        } else if (frequency==="MONTHLY") {
            monthlySelected="selected"
        } else {
            yearlySelected="selected"
        }

        let build = "<tr><td><input type='text' class='form-control' id='subject"+ num +"' value='" +subject +"'></td>" +
            "<td><input type='text' class='form-control' id='description"+ num +"'value='"+ description +"'></td>" +
            "<td><input type='text' class='form-control' id='location"+ num +"' value='" + location +"'></td>" +
            "<td><input type='text' class='form-control' id='begin"+ num +"' value='" + beginDate +"'></td>" +
            "<td><input type='text' class='form-control' id='end"+ num +"' value='" + endDate +"'></td>" +
            "<td><input type='time' class='form-control' id='beginTime"+ num +"' value='" + beginTime +"'></td>" +
            "<td><input type='time' class='form-control' id='endTime"+ num +"' value='" + endTime +"'></td>" +
            "<td><select name='Frequency' id='frequency"+ num +"' class='form-select' value='"+frequency+"'>" +
            "                                <option value='once'" + onceSelected + ">One off</option>" +
            "                                <option value='DAILY'" + dailySelected + ">Daily</option>" +
            "                                <option value='WEEKLY'" + weeklySelected +" >Weekly</option>" +
            "                                <option value='MONTHLY'" + monthlySelected + " >Monthly</option>" +
            "                                <option value='YEARLY'" + yearlySelected + " >Yearly</option>" +
            "                            </select></td>" +
            "<td><input type='text' class='form-control' id='freqCount"+ num +"' placeholder='Enter length of time to repeat i.e. 12 weeks' value='"+freqCount+"'</td>" +
            getRemoveArrayButton(num) +
            "</tr>"


        document.getElementById("eventOutput").innerHTML += build
    }
}


function createAndUpload() {
    let cal = ics();
    let len = searchedEventsArray.length



    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Uploading...";

    var courseTitle = document.getElementById("courseTitle").value;


    for (let i = 0; i < searchedEventsArray.length; i++) {
        let currEvent = searchedEventsArray[i];
        let rrule  = "";
        let beginTime=currEvent[5].replace(":","");
        let endTime=currEvent[6].replace(":","") ;
        if (currEvent[7] != "once" && currEvent[7]!="DAILY") {
            rrule = {freq:currEvent[7], count:currEvent[8]};
        }
        cal.addEvent(currEvent[0], currEvent[1], currEvent[2], currEvent[3], currEvent[4], beginTime, endTime,rrule);
    }

    searchedEventsArray=[]
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
            saveMessage(downloadURL);
            searchedEventsArray=[];
            changeOccurredSoUpdateEventsTable();
            document.getElementById("upload").innerHTML = "Upload";
            return false;
        });
    });
}

function saveMessage(downloadURL) {
    var newTimetableLinkRef = firebase.database().ref("timetableLink/" + courseID);

    newTimetableLinkRef.set({
        url: downloadURL,
        course: courseID,
        courseName: nameOfCourse,
        school: getSchoolFromSchoolString(nameOfSchool),
        college: nameOfCollege
    });
    document.getElementById("upload").innerHTML = "Upload Successful";
    //Make file input empty
    return false;
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