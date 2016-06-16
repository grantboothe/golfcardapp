var numplayers = 8;
var numholes = 19;
var objmine;

function addplayers() {
    $("#leftcard").html('');
    $("#rightcard").html('');
    numplayers += 1;
    buildcard();
};

function deleteplayers() {
    $("#leftcard").html('');
    $("#rightcard").html('');
    numplayers -= 1;
    buildcard();
};


function buildcard(teeboxid) {
    var holecollection = "";
    var playercollection = "";
    var totalscorecollection = "";

    for (var pl = 1; pl <= numplayers; pl++) {
        playercollection += "<div id='player" + pl + "' class='holebox playerbox'> Player " + pl + "</div><div id='total" + pl+ "'>0</div>"; //

    }

    for(var bob=18; bob >= 1; bob--){
        var title = "";
        if (bob == 18) {
            title = 'Total';
        }
        else {
            if (bob == 10)
                title = 'Out';
        }
        if (title !== 'Out' || title !== 'Total'){
            holecollection += "<div id='column" + bob + "' class='holecol'>"+ bob+"<div>par: "+ objmine.course.holes[(bob - 1)].tee_boxes[teeboxid].par+"<div>yards: " + objmine.course.holes[(bob - 1)].tee_boxes[teeboxid].yards+""+ "<div>hcp: "+objmine.course.holes[(bob - 1)].tee_boxes[teeboxid].hcp+"</div></div></div></div>";
        }
        else {
            holecollection += "<div id='column" + bob + "' class='holecol'>"+ title+"</div>";

        }
    }

    $("#leftcard").html(playercollection);
    $("#rightcard").html(holecollection);

    buildholes();
}

function buildholes() {
    for (var p = 1; p <= numplayers; p++) {
        for (var h = 1; h <= numholes; h++) {
            $("#column" + h).append("<input onkeyup='scoretotal(" + p + ")' id='player" + p + "hole" + h + "' class='holebox'/>");
        }
    }
    /*for(var z = 1; z <= numplayers; z++){
        $("#column" + h).append("<input onkeyup='scoretotal(" + p + ")' id='player" + p + "total" + h + "' class='totalbox'/>");
    }*/
}


beginTimer();

var teetime = 45;
var seconds = 60;


function beginTimer() {
    var thetimer = setInterval(function () {
        clocktick()
    }, 1000);
}

function clocktick() {
    if (seconds > 0) {
        seconds--;
    }
    else {
        teetime--;
        seconds = 60;
    }
    document.getElementById("countdown").innerHTML = teetime + ":" + seconds;
}

function selectCourse(id) {
    var extragolf = new XMLHttpRequest();
    extragolf.onreadystatechange = function () {
        if (extragolf.readyState == 4 && extragolf.status == 200) {
            objmine = JSON.parse(extragolf.responseText);

        }
    };

   /* for(var x = 0; x< myobj.courses[id].holes[0].tee_boxes.length; x++) {
        $("#theteebox").append("<option value = '" + myobj.courses[id].holes[0].tee_boxes[x] + "'>" + myobj.courses[id].holes[0].tee_boxes[x].tee_type + "</option> ");
    }*/
    $("#theteebox").append("<option value = '0'>men </option>");
    $("#theteebox").append("<option value = '1'>women </option>");
    $("#theteebox").append("<option value = '2'>pro </option>");
    extragolf.open("GET", "http://golf-courses-api.herokuapp.com/courses/" + id , true);
    extragolf.send();
    //buildcard();
}
var objmine = {};
var golflist;

function populatelist(city) {

    var body =
    {
        country: '',
        state: '',
        city: city,
        name: '',
        address: '',
        radius: "20"
    };

    golflist = new XMLHttpRequest();
    golflist.onreadystatechange = function () {
        if (golflist.readyState == 4 && golflist.status == 200) {
            myobj = JSON.parse(golflist.responseText);
            for (list = 0; list < myobj.courses.length; list++) {
                $("#courseSelectionMenu").append("<option value = '" + myobj.courses[list].id + "'>" + myobj.courses[list].name + "</option> ");
            }
        }

    };
    golflist.open("POST", "http://golf-courses-api.herokuapp.com/courses/search", true);
    golflist.setRequestHeader("Content-Type", "application/json");
    golflist.send(JSON.stringify(body));


    var testCourse = {};
    var closeCourses = {};
    var xhttp = new XMLHttpRequest();
    var local_obj = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};

    function loadMe() {
        $.post("https://golf-courses-api.herokuapp.com/courses", local_obj, function (data, status) {
            for (var p in closeCourses.courses) {
                $("#selectCourse").append(mydisplaydiv);
            }
            document.getElementById('golfDiv').style.display = 'block';
        });
    }



    
}

function setCourseInfo(teeboxid){
    buildcard(teeboxid);
}
function Messages(){
    if (totalScore < par){
        $('#message').append('<div class="success" role="alert")>On to the PGA!</div>')
    }
    else if (totalScore == par){
        $('#message').append('<div class="better" role="alert")>Good</div>')
    }
    else if (totalScore > par){
        $('#message').append('<div class="longways" role="alert")>Better luck next time</div>')
    }
    else if (totalScore > par && totalScore < par + 10){
        $('#message').appendC('<div class="danger" role="alert")>Get good scrub</div>')
    }
};


function scoretotal(theplayer){
    var thetotal = 0;
    var lasthole = $("#player" + theplayer + "hole" + 18).val();
    for(var t = 1; t < numholes; t++){
        thetotal += Number($("#player" + theplayer + "hole" + t).val());
    }
    if(lasthole != ""){
        alert("player " + theplayer + " score: " + thetotal);
    }
 //   $("#total" + theplayer).html(thetotal);
    document.getElementById("total" + theplayer).innerHTML = thetotal;
}
