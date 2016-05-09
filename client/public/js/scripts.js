//// Rendering Map and Places ////

// Google Map with geolocation (if browser and user permit)
var map;
var initialLocation;
var sydney = new google.maps.LatLng(-34.397, 150.644)
var browserSupportFlag = new Boolean();
var markers = [];

function initMap() {
  console.log('initializing');
  var options = {
    zoom: 16
    // TODO style map for uniqueness
    // styles: [{
    //   stylers: [{ visibility: 'simplified' }]
    // }]
  };
  map = new google.maps.Map(document.getElementById('map'), options);
  var geoMarker = new GeolocationMarker(map);

  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      console.log("You are here " + initialLocation);
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

  // Pass Place function searchBox & map to get Place results
  getPlaceResults(searchBox, map);
  updatePlaceResults(searchBox, map);

}; // end InitMap


function getPlaceResults(searchBox, map) {
  // var markers = [];
  // Listen for event fired when user selects a prediction and retrieve more details for that place
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out old markers
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];


    // Add new markers for each Place
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
    places.forEach(function(place){
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71,71),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(17,34),
        scaledSize: new google.maps.Size(20,20)
      };

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      })

      markers.push(marker);

      var request = {
        reference: place.reference
      };
      google.maps.event.addListener(marker, 'click', function(){
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place,status){
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            var contentStr = '<h5>'+place.name+'</h5><p>'+place.formatted_address;
            if (!!place.formatted_phone_number) contentStr += '<br>'+place.formatted_phone_number;
            if (!!place.website) contentStr += '<br><a target="_blank" href="'+place.website+'">'+place.website+'</a>';
            contentStr += '<br>'+place.types+'</p>';
            contentStr += '<button id="save-place">Save</button>';
            infowindow.setContent(contentStr);
            infowindow.open(map,marker);
          } else {
            var contentStr = "<h5>No Result, status="+status+"</h5>";
            infowindow.setContent(contentStr);
            infowwindow.open(map,marker);
          }
        });
      });

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

    });
    map.fitBounds(bounds);
  })
}// end GetPlaceResults


function updatePlaceResults(searchBox, map) {
  map.addListener('dragend', function() {
    console.log('congrats you dragged it');
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    var bounds = map.getBounds();
    places.forEach(function(place){
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71,71),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(17,34),
        scaledSize: new google.maps.Size(20,20)
      };

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      })

      markers.push(marker);
  });

  })
} // end updatePlaceResults

function resetLocation() {
  var geoButton = $('#re-geolocate');
  geoButton.click(function(){
    if(browserSupportFlag == true){
      map.setCenter(initialLocation);
      map.setZoom(16);
    } else {
      alert("Geolocation service failed.");
    }
  })
}; // end resetLocation


//// Saving Places ////
function savePlace(){
  var saveButton = $('#save-place');
  $(document).on('click', '#save-place', function(){
    alert("Okay, saving!");
  })
};

// Run on document load
$(function(){

  initMap();
  resetLocation();
  savePlace();

})
