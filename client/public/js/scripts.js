console.log('wassssupppp');

// Google Map with geolocation (if browser and user permit)
var initialLocation;
var sydney = new google.maps.LatLng(-34.397, 150.644)
var browserSupportFlag = new Boolean();

function initMap() {
  console.log('initializing');
  var options = {
    zoom: 16
    // TODO style map for uniqueness
    // styles: [{
    //   stylers: [{ visibility: 'simplified' }]
    // }]
  };
  var map = new google.maps.Map(document.getElementById('map'), options);
  var geoMarker = new GeolocationMarker(map);

  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
      });
  }
  // If browser doesn't support geolocation
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

  // Autocomplete search box within #search-term UI
  var input = document.getElementById('search-term');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the searchBox results toward current map viewport
  map.addListener('bounds_changed', function(){
    searchBox.setBounds(map.getBounds());
  })

  // Return Place results
  getPlaceResults(searchBox, map);
}; // end InitMap



function getPlaceResults(searchBox, map) {
  var markers = [];
  // Listen for event fired when user selects a prediction and retrieve more details for that place
  searchBox.addListener('places_changed', function() {
    console.log('ARE YOU LISTENING TO ME');
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out old markers
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place){
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71,71),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(17,34),
        scaledSize: new google.maps.Size(20,20)
      };

      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


// Run on document load

$(function(){

  initMap();

})
