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

function getFilesByCollege(){
    var ref = firebase.database().ref("timetableLink/");
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
            "<th>Course Name</th>" +
            "<th>Copy Url</th>" +
            "<th>Download link</th></tr></thead>" +
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
            "<th>Course Name</th>" +
            "<th>Copy Url</th>" +
            "<th>Download link</th></tr></thead>" +
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
            "<th>Course Name</th>" +
            "<th>Copy Url</th>" +
            "<th>Download link</th></tr></thead>" +
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
            "<th>Course Name</th>" +
            "<th>Copy Url</th>" +
            "<th>Download link</th></tr></thead>" +
            "<tbody class='table-group-divider'>"

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            console.log(snapshot.val())
            var copyString = 'copyToClipboard("'+childData.url+'")'
            var build =
                "<tr><td>" + childData.course + "</td>" +
                "<td>" + getSchoolString(childData.school) + "</td>" +
                "<td>" + childData.courseName + "</td>" +
                "<td><button type='button' onclick='"+ copyString+ "'>Copy</button></td>" +
                "<td><a href='" + childData.url + "'>Download</a></td></tr>"
            getFileContents(childData.url)

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

function getFileContents(url) {
    var xhr = new XMLHttpRequest();
    //xhr.responseType = 'json';
    xhr.onload = function(event) {
        var json= xhr.response;
        console.log(json);      // now you read the file c

        const myArray = json.split("\n");
        console.log(myArray[0])
        console.log("here")

    };
    xhr.open('GET', url);
    xhr.send();
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

function copyToClipboard(url) {
    // Copy the text inside the text field
    console.log(url);
    console.log(document.queryCommandSupported('copy'));
    navigator.clipboard.writeText(String(url));
}