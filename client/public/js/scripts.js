console.log("it's alive");

console.log('wassssupppp');

var initialLocation;
var sydney = new google.maps.LatLng(-34.397, 150.644)
var browserSupportFlag = new Boolean();

function initMap() {
  console.log('initializing');
  var options = {
    zoom: 15
  };
  var map = new google.maps.Map(document.getElementById('map'), options);

  console.log(navigator.geolocation);
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
      });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = sydney;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }
}


$(function(){

  initMap();

})
