console.log("Users.js loaded");
$(function(){
  setSubmitHandler();
});

function setSubmitHandler(){
  $("#login-submit").click(function(e){
    e.preventDefault();
    console.log("Button works!");
  });
};
