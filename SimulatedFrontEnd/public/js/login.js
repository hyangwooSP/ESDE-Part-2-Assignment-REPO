let $loginFormContainer = $('#loginFormContainer');
if ($loginFormContainer.length != 0) {
    console.log('Login form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    var login_attempts = 3;
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'http://localhost:5000';
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let webFormData = new FormData();
        webFormData.append('email', email);
        webFormData.append('password', password);

        axios({
                method: 'post',
                url: baseUrl + '/api/user/login',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                //Inspect the object structure of the response object.
                //console.log('Inspecting the respsone object returned from the login web api');
                //console.dir(response);
                userData = response.data;
                if (userData.role_name == 'user') {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('user/manage_submission.html');
                    return;
                }
                if (response.data.role_name == 'admin') {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('user_id', userData.user_id);
                    localStorage.setItem('role_name', userData.role_name);
                    window.location.replace('admin/manage_users.html');
                    return;
                }
            })
            .catch(function(response) {
                //Handle error
                document.getElementById("loginFormContainer").reset();
                grecaptcha.reset();
                login_attempts = login_attempts - 1;
                if(login_attempts==0)
                {
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '4000',
                    text: "No more login attempts available.",
                }).show();
                 document.getElementById("emailInput").disabled=true;
                 document.getElementById("passwordInput").disabled=true;
                 document.getElementById("submitButton").disabled=true;
                }
                else
                {
                 console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '4000',
                    text: "Unable to login. " + login_attempts + " login attempts left. Check your email and password",
                }).show();
                }
                
            });
    });

} //End of checking for $loginFormContainer jQuery object