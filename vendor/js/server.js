$(document).ready(function(){
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
});

function submitForm() {
    var objectData =
        {
            Firstname: document.getElementById('txtFirstname').value,
            Lastname: document.getElementById('txtLastname').value,
            Username: document.getElementById('txtUsername').value,
            Password: document.getElementById('txtPassword').value               
        };

    var objectDataString = JSON.stringify(objectData);

        // alert(objectDataString);
    $("#signup").submit(function (event) {
        $.ajax({
            type: "post",
            url: "http://localhost:3000/admin/signup",
            contentType: "application/json",
            // data: objectDataString,
            data: JSON.stringify($("#signup").serialize()),
            success: function (data) {
                alert(JSON.stringify(data));
            },
            error: function () {
                alert('Error');
            }
        });
        // $.post('/route', $("#formId").serialize(), function (data) {
        //     console.log(data) //data is the response from the backend
        // });
        event.preventDefault();
    });
}