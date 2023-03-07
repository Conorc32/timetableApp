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