function setEditHandler(){
  $('#edit-form').submit(function(e){
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
        location.reload();
      }
    });
    // console.log(payload);
  });
};

$(function(){
  setEditHandler();
})
