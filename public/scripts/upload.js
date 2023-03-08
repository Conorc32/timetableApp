document.getElementById("colleges").onchange = changeListener;

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

function createAndUpload() {
    var subject = document.getElementById("subject").value
    var description = document.getElementById("description").value
    var location = document.getElementById("location").value
    var begin = document.getElementById("begin").value
    var end = document.getElementById("end").value
    var rrule = document.getElementById("rrule").value

    cal = ics();
    cal.addEvent(subject, description, location, begin, end, "")
    console.log(cal)

    var uploadtext = document.getElementById("upload").innerHTML;
    document.getElementById("upload").innerHTML = "Uploading...";

    var courseTitle = document.getElementById("courseTitle2").value;

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
        });
    });

}

function saveMessage2(downloadURL) {
    var courseTitle = document.getElementById("courseTitle2").value;
    var school = document.getElementById("schools2").value;
    var college = document.getElementById("colleges2").value;

    var newTimetableLinkRef = firebase.database().ref("timetableLink/"+courseTitle);

    newTimetableLinkRef.set({
        url: downloadURL,
        course: courseTitle,
        school: school,
        college: college
    });
    document.getElementById("upload").innerHTML = "Upload Successful";
    //Make file input empty
    document.getElementById("file").value = "";
}

function download() {
    cal.build();
    return cal.download();
}
