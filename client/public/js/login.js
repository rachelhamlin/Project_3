console.log("Users.js loaded");

//// Display Log In Form By Default ////
function changeForm() {
  var signupLink = $('#signup-link');
  var signupForm = $('#sign-up-div');

  var loginLink  = $('#login-link');
  var loginForm  = $('#login-div');

  signupLink.click(function(){
    loginForm.hide();
    signupForm.show();
  })

  loginLink.click(function(){
    signupForm.hide();
    loginForm.show();
  })
}

//// Sign Up / Log In ////
function setSubmitHandler(){
  $("#new-user").submit(function(e){
    e.preventDefault();

    var payload = {
      username:   $('#new-user').find('[name=username]').val(),
      email:      $('#new-user').find('[name=email]').val(),
      password:   $('#new-user').find('[name=password]').val(),
      firstName:  $('#new-user').find('[name=firstName]').val(),
      lastName:   $('#new-user').find('[name=lastName]').val()
    };
    console.log("Before save: " + payload);
    $.ajax({
      url:      '/api/users',
      method:   'post',
      data:     payload,
      success: function(data){
        Cookies.set('user_token', data.token);
        Cookies.set('current_user', data.currentUser);
        location.reload();
      }
    });
  });
};

function setLoginHandler(){
  $("#login-form").submit(function(e){
    e.preventDefault();
    var payload = {
      username:     $('#login-form').find('[name=username]').val(),
      password:     $('#login-form').find('[name=password]').val()
    };

    $.ajax({
      url:        '/api/auth',
      method:     'post',
      data:       payload,
      success:    function(data){
        console.log("Successful login");
        Cookies.set("user_token", data.token);

        // data.currentUser is starting to get too large to store in a cookie
        // temporarily trying to store just the username in the cookie instead
        // of the entire User object
        var cookieUser = {username: data.currentUser.username};
        Cookies.set("current_user", cookieUser);
        // Cookies.set("current_user", data.currentUser);
        location.reload();
      }
    });
  });
};

//// Custom method because jQuery deprecated .toggle() ////
$.fn.clickToggle = function(a, b) {
    return this.each(function() {
        var clicked = false;
        $(this).click(function() {
            if (clicked) {
                clicked = false;
                return b.apply(this, arguments);
            }
            clicked = true;
            return a.apply(this, arguments);
        });
    });
};

// On window load
$(function(){
  changeForm();
  setSubmitHandler();
  setLoginHandler();
});
