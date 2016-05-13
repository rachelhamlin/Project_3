var cookiesUser = JSON.parse(Cookies.get().current_user);
var currentUser = {};

function setEditHandler(){
  $('#edit-user').click(function(e){
    e.preventDefault();
    var payload = {
      firstName:  $('#edit-form').find('[name=firstName]').val(),
      lastName:   $('#edit-form').find('[name=lastName]').val(),
      username:   $('#edit-form').find('[name=username]').val(),
      email:      $('#edit-form').find('[name=email]').val(),
      // password:   $('#edit-form').find('[name=password]').val()
    }
    $.ajax({
      url:      '/api/users/edit',
      method:   'put',
      data:     payload,
      success: function(data){
        Cookies.set('user_token', data.token);
        Cookies.set('current_user', data.currentUser);
        // location.reload();
        getCurrentProfileUser();
      }
    });
    // console.log(payload);
  });
};

function setDeleteHandler(){
  $('#delete-user').click(function(e){
    e.preventDefault();
    $.ajax({
      url: "/api/users/",
      method: "delete",
      success: function(data){
        Cookies.remove('user_token');
        Cookies.remove('current_user');
        location.reload();
      }
    });
  });
};

function getCurrentProfileUser() {
  $.ajax({
    url: '/api/users/' + cookiesUser.username,
    method: 'get',
    success: function(user){
      currentUser = user;
      renderForm();
    }
  });
}

function renderForm(){

  $('#edit-profile').empty();
  // var $div = $('<div>').attr("id","edit-profile");
  var $div = $('#edit-profile');
  var $h1 = $('<h1>').text("Edit Profile");
  var $h2 = $('<h2>').text(currentUser.firstName + ' ' + currentUser.lastName);

  var $form = $('<form>').attr("id","edit-form");
  var $labelFirstName = $('<label>').text("First Name");
  var $inputFirstName = $('<input>').attr({"type":"text", "name":"firstName", "value":currentUser.firstName});
  var $labelLastName = $('<label>').text("Last Name");
  var $inputLastName = $('<input>').attr({"type":"text", "name":"lastName", "value":currentUser.lastName});
  var $labelUsername = $('<label>').text("Username");
  var $inputUsername = $('<input>').attr({"type":"text", "name":"username", "value":currentUser.username});
  var $labelEmail = $('<label>').text("Email");
  var $inputEmail = $('<input>').attr({"type":"text", "name":"email", "value":currentUser.email});
  var $inputSubmit = $('<input>').attr({"id":"edit-user","type":"submit", "value":"Edit"});
  var $inputDelete = $('<input>').attr({"id":"delete-user","type":"submit", "value":"Delete"});
  $form.append($labelFirstName);
  $form.append($inputFirstName);
  $form.append($labelLastName);
  $form.append($inputLastName);
  $form.append($labelUsername);
  $form.append($inputUsername);
  $form.append($labelEmail);
  $form.append($inputEmail);
  $form.append($inputSubmit);
  $form.append($inputDelete);

  $div.append($h1);
  $div.append($h2);
  $div.append($form);

  var $ul = $('<ul>');
  for (var i = 0; i < currentUser.favorites.length; i++) {
    $ul.append($('<li>').text(currentUser.favorites[i].name));
  }
  $div.append($ul);

  setEditHandler();
  setDeleteHandler();
}

$(function(){
  // setEditHandler();
  // setDeleteHandler();
  getCurrentProfileUser();
})
