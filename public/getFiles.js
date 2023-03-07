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

function getFiles(){
    var ref = firebase.database().ref("timetableLink");
    var filesTable = document.getElementById("fileTable")
    var build =
        "<tr><th>Course ID</th>" +
        "<th>College</th>" +
        "<th>School</th>" +
        "<th>Url</th></tr>"
    ref.on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                build += "<tr><td>" + childData.course + "</td>" +
                    "<td>" + childData.college + "</td>" +
                    "<td>" + childData.school + "</td>" +
                    "<td>" + childData.url + "</td></tr>"
            });
        }
    );

    filesTable.innerHTML=build
}