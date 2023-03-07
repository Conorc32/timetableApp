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

document.addEventListener("DOMContentLoaded", function() {
    getFilesByCollege();
});

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
                console.log(snapshot.val())
                build += "<tr><td>" + childData.course + "</td>" +
                    "<td>" + childData.college + "</td>" +
                    "<td>" + childData.school + "</td>" +
                    "<td>" + childData.url + "</td></tr>"
            });
        }
    );

    filesTable.innerHTML=build
}

function getFilesByCollege(){
    var ref = firebase.database().ref("timetableLink");
    var byCollegeOutput = document.getElementById("byCollege")


    ref.on("value", function(snapshot) {


        var artsBuild =
            "<h2>College of Arts, Social Sciences & Celtic Studies</h2>" +
            "<button class='btn btn-primary' type='button' " +
            "data-bs-toggle='collapse' data-bs-target=\"#artsTimetables\">" +
            "View Timetables</button>" +
            "<div class='collapse' id='artsTimetables'>" +
            "<table class='table table-bordered'><thead>" +
            "<tr><th>Course ID</th>" +
            "<th>School</th>" +
            "<th>Url</th></tr></thead>" +
            "<tbody class='table-group-divider'>"
        var scienceBuild =
            "<h2>College of Science & Engineering</h2>" +
            "<button class='btn btn-primary' type='button' " +
            "data-bs-toggle='collapse' data-bs-target=\"#scienceTimetables\">" +
            "View Timetables</button>" +
            "<div class='collapse' id='scienceTimetables'>" +
            "<table class='table table-bordered'><thead>" +
            "<tr><th>Course ID</th>" +
            "<th>School</th>" +
            "<th>Url</th></tr></thead>" +
            "<tbody class='table-group-divider'>"
        var businessBuild =
            "<h2>College of Business, Public Policy, & Law</h2>" +
            "<button class='btn btn-primary' type='button' " +
            "data-bs-toggle='collapse' data-bs-target=\"#businessTimetables\">" +
            "View Timetables</button>" +
            "<div class='collapse' id='businessTimetables'>" +
            "<table class='table table-bordered'><thead>" +
            "<tr><th>Course ID</th>" +
            "<th>School</th>" +
            "<th>Url</th></tr></thead>" +
            "<tbody class='table-group-divider'>"
        var medicineBuild =
            "<h2>College of Medicine, Nursing, & Health Sciences</h2>" +
            "<button class='btn btn-primary' type='button' " +
            "data-bs-toggle='collapse' data-bs-target=\"#medicineTimetables\">" +
            "View Timetables</button>" +
            "<div class='collapse' id='medicineTimetables'>" +
            "<table class='table table-bordered'><thead>" +
            "<tr><th>Course ID</th>" +
            "<th>School</th>" +
            "<th>Url</th></tr></thead>" +
            "<tbody class='table-group-divider'>"

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            console.log(snapshot.val())
            var build = "<tr><td>" + childData.course + "</td>" +
                    "<td>" + childData.school + "</td>" +
                    "<td>" + childData.url + "</td></tr>"
                if (childData.college == "arts") {
                    artsBuild += build
                } else if (childData.college == "science") {
                    scienceBuild += build
                } else if (childData.college == "medicine") {
                    medicineBuild += build
                } else {
                    businessBuild += build
                }
        });

        artsBuild += "</tbody></table></div>"
        businessBuild += "</tbody></table></div>"
        scienceBuild += "</tbody></table></div>"
        medicineBuild += "</tbody></table></div>"

        var totalBuild =artsBuild + scienceBuild + businessBuild + medicineBuild
        byCollegeOutput.innerHTML=totalBuild

        }
    );
}



