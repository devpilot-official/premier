$(document).ready(function(){
    $("#signup").submit(function (event) {
        $.post("http://localhost:3000/admin/signup", $("#signup").serialize(), function (data) {
            alert(JSON.stringify(data.message)) //data is the response from the backend
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