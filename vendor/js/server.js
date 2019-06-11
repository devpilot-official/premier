$(document).ready(function(){
    allteams(); //All Teams
    getAllOngoingFixtures(); //Ongoing for admin
    getAllTodayFixtures(); // All fixtures for today
    getOngoingFixtures(); //Ongoing for home
    finishedMatches(); // All finished matches
    sideongoing(); // All ongoing in sidebar
    sidepending(); // All pending in sidebar

    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var output = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    $("#today_date").append("<div>Today: " + output + "</div>");

    var val = Math.floor(1000 + Math.random() * 9000);
    var username = localStorage.getItem('username');
    var password = localStorage.getItem('password');
    var firstname = localStorage.getItem('firstname');
    var lastname = localStorage.getItem('lastname');
    $("#cont").html(firstname + " " + lastname);


    $("#signin").submit(function (event) {
        $.post("http://localhost:3000/admin/signin", $("#signin").serialize(), function (data) {
            //alert(JSON.stringify(data.UserDetails[0].ID)) //data is the response from the backend
            localStorage.setItem('username', data.UserDetails[0].Username);
            localStorage.setItem('password', data.UserDetails[0].Password);
            localStorage.setItem('firstname', data.UserDetails[0].Firstname);
            localStorage.setItem('lastname', data.UserDetails[0].Lastname);

            window.location.href = 'admin/index.html';
        });
        event.preventDefault();
    });

    $("#c_signin").submit(function (event) {
        $.post("http://localhost:3000/user/signin", $("#c_signin").serialize(), function (data) {
            alert(JSON.stringify(data)) //data is the response from the backend
        });
        event.preventDefault();
    });

    $("#team_register").submit(function (event) {
        $("#txtTeamID").val(Math.floor(1000 + Math.random() * 9000));
        $.post("http://localhost:3000/team/add", $("#team_register").serialize(), function (data) {
            $("#txtTeamName").val("");
            $("#txtDetails").val("");
            var dialog = bootbox.dialog({
                title: 'Go Score',
                message: '<p><i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;&nbsp;Please wait...</p>'
            });
                        
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html(data.message + '!');
                }, 3000);
            });
        });

        event.preventDefault();
    });

    $("#add_fixture").submit(function (event) {
        $("#txtFixtureID").val(Math.floor(10000 + Math.random() * 90000));
        $.post("http://localhost:3000/fixture/add", $("#add_fixture").serialize(), function (data) {
            $("#txtTeamOne").val("");
            $("#txtTeamTwo").val("");
            $("#txtVenue").val("");
            $("#txtDateTime").val("");

            var dialog = bootbox.dialog({
                title: 'Go Score',
                message: '<p><i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;&nbsp;Please wait...</p>'
            });
                        
            dialog.init(function(){
                setTimeout(function(){
                    dialog.find('.bootbox-body').html(data.message + '!');
                }, 3000);
            });
        });

        event.preventDefault();
    });

    $("#user_reg_form").submit(function (event) {
        var dialog = bootbox.dialog({
            title: 'Go Score - User registration',
            message: '<p><i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;&nbsp;Please wait...</p>'
        });
                    
        dialog.init(function(){
            setTimeout(function(){
                dialog.find('.bootbox-body').html("Congratulations to you motherfucker");
            }, 10000);
        });
    });
});

function logout() {
    localStorage.clear();
    window.location.href = '../index.html';
}

function allteams() {
    $("#teams").empty();
    $("#txtTeamOne").empty();
    $("#txtTeamTwo").empty();

    $.get("http://localhost:3000/team/", function (data) {
        for (var i = 0; i < data.Teams.length; i++) {
            $("#teams").append('<tr><td>' + data.Teams[i].ID + '</td><td>' + data.Teams[i].TeamName + '</td><td>' + data.Teams[i].TeamDetails + '</td><td></td></tr>');
            $("#txtTeamOne").append('<option value="' + data.Teams[i].TeamName + '">' + data.Teams[i].TeamName + '</option>');
            $("#txtTeamTwo").append('<option value="' + data.Teams[i].TeamName + '">' + data.Teams[i].TeamName + '</option>');
        }
    });
}

function getAllTodayFixtures() {
    $("#today_pending_fixture").empty();

    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;

    $.get("http://localhost:3000/fixture/today/", {match: matchDay}, function (data) {
        for (var i = 0; i < data.Fixture.length; i++) {
            $("#today_pending_fixture").append('<tr><td>' + data.Fixture[i].FixtureDate + '</td><td>' + data.Fixture[i].TeamOneID + '</td><td> VS </td><td>' + data.Fixture[i].TeamTwoID + '</td><td><input type="button" class="btn btn-success btn-sm" value="Start Match" onclick="startmatch(' + data.Fixture[i].FixtureID + ')"></td></tr>');
        }
    });
}

function startmatch(fixtureID) {
    $.get("http://localhost:3000/fixture/today/startmatch/", {matchID: fixtureID}, function (data) {
        bootbox.alert(data.message);
        location.reload();
    });
}

function endmatch(fixtureID) {
    $.post("http://localhost:3000/fixture/today/endmatch/", {FixtureID: fixtureID}, function (data) {
        bootbox.alert("Fixture ID: " + data.message);
        location.reload();
    });
}

function updatescore(fixtureID) {
    // bootbox.alert("Update Score: " + $("#txtScore1_" + fixtureID).val() + " - " + $("#txtScore2_" + fixtureID).val());
    var score1 = $("#txtScore1_" + fixtureID).val();
    var score2 = $("#txtScore2_" + fixtureID).val();
    $.get("http://localhost:3000/fixture/today/updatescore/", {ScoreOne: score1, ScoreTwo: score2, FixtureID: fixtureID}, function (data) {
        bootbox.alert(data.message);
        location.reload();
    });
}

function sideongoing() {
    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;

    $.get("http://localhost:3000/fixture/today/ongoing/", {match: matchDay}, function (data) {
        for (var i = 0; i < data.Fixture.length; i++) {
            $("#today_ongoing_fixture_side").append('<tr><td>' + data.Fixture[i].TeamOneID + '</td><td>' + data.Fixture[i].TeamOneScore + '-' + data.Fixture[i].TeamTwoScore + '</td><td>' + data.Fixture[i].TeamTwoID + '</td></tr>');
        }
    });
}

function sidepending() {
    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;

    $.get("http://localhost:3000/fixture/today/", {match: matchDay}, function (data) {
        for (var i = 0; i < data.Fixture.length; i++) {
            $("#today_pending_fixture_side").append('<tr><td>' + data.Fixture[i].TeamOneID + '</td><td> VS </td><td>' + data.Fixture[i].TeamTwoID + '</td></tr>');
        }
    });
}

function getAllOngoingFixtures() {
    $("#today_ongoing_fixture").empty();
    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;

    $.get("http://localhost:3000/fixture/today/ongoing/", {match: matchDay}, function (data) {
        for (var i = 0; i < data.Fixture.length; i++) {
            $("#today_ongoing_fixture").append('<tr><td>' + data.Fixture[i].FixtureDate + '</td><td>' + data.Fixture[i].TeamOneID + '</td><td><input type="text" name="txtScore1_' + data.Fixture[i].FixtureID + '" id="txtScore1_' + data.Fixture[i].FixtureID + '" value="' + data.Fixture[i].TeamOneScore + '" size="3"> - <input type="text" name="txtScore2_' + data.Fixture[i].FixtureID + '" id="txtScore2_' + data.Fixture[i].FixtureID + '" value="' + data.Fixture[i].TeamTwoScore +  '" size="3"></td><td>' + data.Fixture[i].TeamTwoID + '</td><td><input type="button" class="btn btn-info btn-sm" value="Update" onclick="updatescore(' + data.Fixture[i].FixtureID + ')"><input type="button" class="btn btn-danger btn-sm" value="End Match" onclick="endmatch(' + data.Fixture[i].FixtureID + ')"></td></tr>');
        }
        
    });
}

function getOngoingFixtures() {
    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;

    $.get("http://localhost:3000/fixture/today/ongoing/", {match: matchDay}, function (data) {
        for (var i = 0; i < data.Fixture.length; i++) {
            $("#today_ongoing_fixture_home").append('<tr><td>' + data.Fixture[i].FixtureDate + '</td><td>' + data.Fixture[i].TeamOneID + '</td><td>' + data.Fixture[i].TeamOneScore + " - " + data.Fixture[i].TeamTwoScore +  '</td><td>' + data.Fixture[i].TeamTwoID + '</td><td>' + data.Fixture[i].FixtureStatus + '</td></tr>');
        }
        
    });
}

function finishedMatches() {
    $("#finished_fixture").empty();

    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;

    $.get("http://localhost:3000/fixture/today/finished/", {match: matchDay}, function (data) {
        for (var i = 0; i < data.Matches.length; i++) {
            $("#finished_fixture").append('<tr><td>' + data.Matches[i].FixtureDate + '</td><td>' + data.Matches[i].TeamOneID + '</td><td>' + data.Matches[i].TeamOneScore + ' - ' + data.Matches[i].TeamTwoScore +  '</td><td>' + data.Matches[i].TeamTwoID + '</td></tr>');
        }
        
    });
}

function getFixturesByDate(theDate) {
    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;

    $.get("http://localhost:3000/team/", $("#team_register").serialize(), function (data) {
        for (var i = 0; i < data.Teams.length; i++) {
            $("#teams").append('<tr><td>' + data.Teams[i].ID + '</td><td>' + data.Teams[i].TeamName + '</td><td>' + data.Teams[i].TeamDetails + '</td><td></td></tr>');
            $("#txtTeamOne").append("<option value'" + data.Teams[i].TeamID + '>' + data.Teams[i].TeamName + '</option>');
            $("#txtTeamTwo").append("<option value'" + data.Teams[i].TeamID + '>' + data.Teams[i].TeamName + '</option>');
        }
    });
}

function getFixturesByTime(theTime) {
    var currentdate = new Date(); 
    var year = currentdate.getFullYear();
    var month = currentdate.getMonth()+1;
    var day = currentdate.getDate();
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();

    var matchDay = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    var matchDayTime = matchDay + " " + (hours<10 ? '0' : '') + hours + ":" + (minutes<10 ? '0' : '') + minutes;
}