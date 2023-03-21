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
        newDropdown += "<option value='engineering'>School of Health Sciences</option>";
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

    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Uploading...";

    var courseTitle = document.getElementById("courseTitle2").value;

    console.log(eventsArray);

    for (let i = 0; i < eventsArray.length; i++) {
        let currEvent = eventsArray[i];
        let rrule  = "";
        if (currEvent[7] != "once") {
            rrule = {freq:currEvent[7], count:currEvent[8]};

        }
        cal.addEvent(currEvent[0], currEvent[1], currEvent[2], currEvent[3], currEvent[4], currEvent[5], currEvent[6],rrule);
    }
    console.log(eventsArray);
    console.log(cal.events());
    eventsArray = "";



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
    var subject = document.getElementById("subject").value
    var description = document.getElementById("description").value
    var location = document.getElementById("location").value
    var begin = document.getElementById("begin").value
    var end = document.getElementById("end").value
    var beginTime = document.getElementById("beginTime").value
    var endTime = document.getElementById("endTime").value
    var frequency = document.getElementById("frequency").value
    var freqCount = document.getElementById("freqCount").value

    beginTime = beginTime.replace(":", "")
    endTime = endTime.replace(":", "")

    //cal.addEvent(subject, description, location, begin, end, beginTime, endTime,rrule)
    eventsArray.push([subject, description, location, begin, end, beginTime, endTime, frequency, freqCount])

    var eventBuild = "<tr><td>" + subject + "</td>" +
        "<td>" + description + "</td>" +
        "<td>" + location + "</td>" +
        "<td>" + begin + "</td>" +
        "<td>" + end + "</td>" +
        "<td>" + beginTime + "</td>" +
        "<td>" + endTime + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + freqCount + "</td></tr>"

    document.getElementById("events").innerHTML += eventBuild;
    console.log(cal);
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
        school: school,
        college: college
    });
    document.getElementById("upload").innerHTML = "Upload Successful";
    //Make file input empty
    document.getElementById("file").value = "";
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
