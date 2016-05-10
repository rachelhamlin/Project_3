console.log("Users.js loaded");
$(function(){
  setSubmitHandler();
  setLoginHandler();
  setLogoutHandler();
});

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
        console.log(data);
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
        Cookies.set('user_token', data.token);
        Cookies.set('current_user', data.currentUser);
        console.log(data);
        location.reload();
      }
    })
  })
};

function setLogoutHandler(){
  $("#logout-button").click(function(e){
    e.preventDefault();
    Cookies.remove('user_token');
    Cookies.remove('current_user');
    location.reload();
  })
}
// $(“#new-resource”).submit(function(e){
// 	e.preventDefault();
// 	$.ajax({ url: “/api/resources”,
// 			method: “post”,
// 			data: { name: $(“#new-resource”).find(“[name=name]”).val(),
// 					age: $(“#new-resource”).find(“[name=age]”).val(),
// 					color: $(“#new-resource”).find(“[name=color]”).val()
// 				},
// 			success: function(resource){
// 				renderResource(resource);
// 			}
// 	});
// });
