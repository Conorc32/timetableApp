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

function getIndividualFile() {
    var ref = firebase.database().ref("timetableLink")
    var searchModule = document.getElementById("courseTitle").value
    var searchOutput = document.getElementById("searchOutput")
    var found = false
    var build = ""


    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData.course == searchModule) {
                build += "<tr><td>" + childData.course + "</td>" +
                    "<td>" + childData.college + "</td>" +
                    "<td>" + childData.school + "</td>" +
                    "<td>" + childData.courseName + "</td>" +
                    "<td><a href='"+ childData.url +"'>Download</a>" + "</td></tr>"
                found = true
            }
        });

        if(found == true) {
            searchOutput.innerHTML = build;
        } else {
            searchOutput.innerHTML = "File not found."
        }

    });

}