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

function getIndividualFile() {
    var ref = firebase.database().ref("timetableLink")
    var searchModule = document.getElementById("courseTitle").value
    var searchOutput = document.getElementById("searchOutput")
    var found = false
    var build = ""
    let url = ""


    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            if(childData.course == searchModule) {
                build += "<tr><td>" + childData.course + "</td>" +
                    "<td>" + childData.college + "</td>" +
                    "<td>" + childData.school + "</td>" +
                    "<td>" + childData.courseName + "</td>" +
                    "<td><a href='"+ childData.url +"'>Download</a>" + "</td></tr>"
                url=childData.url
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
        console.log(String(event[i]).trim().slice(0,11))

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
            beginDate=beginDate.slice(0,4)+"/"+beginDate.slice(4,6)+"/"+beginDate.slice(6,8)
            beginTime=String(subEvent[1]).trim().slice(9);
            beginTime=beginTime.slice(0,2)+":"+beginTime.slice(2,4)
        }
        console.log(String(event[i]).trim().slice(0,8))
        if (String(event[i]).trim().slice(0,5)==="DTEND".trim()) {
            let subEvent = String(event[i]).split(";")[1].split(":")
            endDate=String(subEvent[1]).slice(0,8);
            endDate=endDate.slice(0,4)+"/"+endDate.slice(4,6)+"/"+endDate.slice(6,8)
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
    searchedEventsArray.splice(index, index+1)
    changeOccurredSoUpdateEventsTable()
}

function addBlankEventToTable() {
    searchedEventsArray.push(["", "", "", "", "", "", "", "", ""])
    changeOccurredSoUpdateEventsTable()
}

function changeOccurredSoUpdateEventsTable() {
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
            "</tr>"


        document.getElementById("eventOutput").innerHTML += build
    }
}