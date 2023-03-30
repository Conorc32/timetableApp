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

// Reference messages collection
var messagesRef = firebase.database().ref("message");

// Listen for form submit

function uploadTimetable() {
    if(document.getElementById("file").value != ""){
        var uploadtext = document.getElementById("upload").innerHTML;
        document.getElementById("upload").innerHTML = "Uploading...";
        var file = document.getElementById("file").files[0];
        var courseTitle = document.getElementById("courseTitle").value;
        var newFile = new File([file], courseTitle+'.ics', {type: 'text/calendar'});

        file = renameFile(file, courseTitle);
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
            });
        });
    }
    else{
        var uploadtext = document.getElementById("upload").innerHTML;
        document.getElementById("upload").innerHTML = "Please select a file";

        // After 2 sec make it empty
        setTimeout(function(){
            document.getElementById("upload").innerHTML = uploadtext;
            }, 2000);
    }
}
// https://firebasestorage.googleapis.com/v0/b/timetabledistribution.appspot.com/o/images%2Fcurry.jpg?
// alt=media&token=a0bd652e-cbbf-4d23-8e30-46184e68538a
//https://firebasestorage.googleapis.com/v0/b/timetabledistribution.appspot.com/o/images%2Fcurry.jpg?alt=media&token=ddcfbc81-5695-4f35-8952-20f7e90f8ed8
// Save message to firebase
function saveMessage(downloadURL) {
    var courseTitle = document.getElementById("courseTitle").value;
    var school = document.getElementById("schools").value;
    var college = document.getElementById("colleges").value;
    var courseName = document.getElementById("courseName").value;

    var newTimetableLinkRef = firebase.database().ref("timetableLink/"+courseTitle);

    newTimetableLinkRef.set({
        url: downloadURL,
        course: courseTitle,
        courseName: courseName,
        school: getSchoolFromSchoolString(school),
        college: college
    });
    document.getElementById("upload").innerHTML = "Upload Successful";
    //Make file input empty
    document.getElementById("file").value = "";
}

function showimage(){
    var uniqueId= document.getElementById("unique").value;
    if(uniqueId==""){
        alert("Unique Id is empty\n Please enter a Unique Id");
        return;
    }
    var ref = firebase.database().ref("image");
    var flag = 0;
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        if (childData.number == uniqueId){
        
        flag = 1;
        window.open(childData.url, "_blank");
        }
        });
    }
    );
    // After some time if flag is still 0 then show alert
    // setTimeout(function(){
        
    // if(flag == 0){
    //     alert("File not found Check the Unique ID");
    // }
    // }, 5000);
}


function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

function getFileContents2(url) {
    var xhr = new XMLHttpRequest();
    //xhr.responseType = 'json';
    xhr.onload = function(event) {
        var json= xhr.response;
        console.log(json);      // now you read the file content
    };
    xhr.open('GET', url);
    xhr.send();
}

