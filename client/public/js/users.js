console.log("Users.js loaded");
$(function(){
  setSubmitHandler();
});

function setSubmitHandler(){
  $("#new-user").submit(function(e){
    e.preventDefault();
    console.log("Button works!");

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
      data:     payload
    });
  });
};


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
