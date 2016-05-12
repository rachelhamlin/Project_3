//// Rendering Map and Places ////

// Google Map with geolocation (if browser and user permit)
var map;
var initialLocation;
var sydney = new google.maps.LatLng(-34.397, 150.644)
var browserSupportFlag = new Boolean();
var markers = [];
var cookiesUser = JSON.parse(Cookies.get().current_user);
var currentUser = getCurrentUser();

// IRWIN CODE -- Global variable storing current place object. NOT VERY ELEGANT BUT... ¯\_(ツ)_/¯
var currentPlace = {};
// END OF IRWIN CODE

//// Create Google map on page load with autocomplete searchBox ////
function initMap() {
  console.log('initializing');
  var options = {
    zoom: 16,
    maxZoom: 19,
    minZoom: 5
  };
  map = new google.maps.Map(document.getElementById('map'), options);
  console.log(map.data);
  // console.log(google.maps.MapTypeStyleFeatureType);
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

  // Pass searchBox & map to get place results from user search input
  getPlaceResults(searchBox, map);

  // Just in case anyone thinks otherwise, Sergey is the best
  // Sergey is the Best is a function that updates the Place results on map drag (see mapupdate.js)
  function sergeyIsTheBest() {
    google.maps.event.trigger(input, 'focus');
    google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
    google.maps.event.trigger(input, 'places_changed', searchBox);
  }

  map.addListener('dragend', function(){
    sergeyIsTheBest();
  })

  $('#search-submit').click(function(){
    sergeyIsTheBest();
  });

  $('')


  // Override info window prototype to include "add to favorites" button on built-in POIs
  var fx = google.maps.InfoWindow.prototype.setPosition;
  google.maps.InfoWindow.prototype.setPosition = function () {
    if (this.logAsInternal) {
      google.maps.event.addListenerOnce(this, 'map_changed',function(){
        var map = this.getMap();
        if (map) {
          google.maps.event.trigger(map, 'click', {content: this.getContent()});
        }
      });
    }
    fx.apply(this,arguments);
  }

  google.maps.event.addListenerOnce(map,'click',function(e){
      var $infowindow = $(e.content);
      console.log($infowindow);
      var $saveButton = $('<button id="save-place">Add to favorites</button>');
      $infowindow.append($saveButton);
      $infowindow.append('<div style="display:none;" class="infowindow-expanded">')

      $saveButton.click(function(){
        var $notes           = ('<textarea class="notes" placeholder="Add notes">');
        var $selectList      = ('<select id="customListOptions"><option value="Summer Patio Spots">Summer Patio Spots</option><option value="Fancy Restaurants">Fancy Restaurants</option></select><br>');
        var $confirmButton   = ('<button class="confirm">Save</button>');
        var $expandedArea    = $('.infowindow-expanded');

        $expandedArea.show();
        $saveButton.hide();
        if ($expandedArea.children().length === 0){
          $expandedArea.append($notes);
          $expandedArea.append($selectList);
          $expandedArea.append($confirmButton);
        }
      }) //submitSave

    })

}; // end InitMap

//// Get data for the logged in user ////
function getCurrentUser() {
  $.ajax({
    url: '/api/users/' + cookiesUser.username,
    method: 'get',
    success: function(user){
      currentUser = user;
      renderFavorites(currentUser);
    }
  })
} // end getCurrentUser


//// Rendering markers for existing user favorites ////
function renderFavorites(currentUser) {
  var favorites = currentUser.favorites;
  for (var i = 0; i < currentUser.favorites.length; i++) {
    var favorite = favorites[i];
    addMarker(favorites[i]);
  }
}

function addMarker(favorite) {
  var lat    = favorite.lat;
  var lng    = favorite.lng;
  var latlng = new google.maps.LatLng(lat, lng);
  var icon = {
    url: '/media/star_icon.png', // url
    scaledSize: new google.maps.Size(25, 25), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};

  var marker = new google.maps.Marker({
       position: latlng,
       map: map,
       icon: icon
       });

   addFavoriteInfo(favorite, marker);
}

//// Pop up an infoWindow when a favorite is clicked ////
function addFavoriteInfo (favorite, marker) {
  var infowindow = new google.maps.InfoWindow();
  marker.addListener('click', function(){
    infowindow.open(map, this);

    var contentStr = '<h5>'+favorite.name+'</h5><p>'+favorite.address;
    if (favorite.notes) contentStr += '<p>'+favorite.notes+'</p>';
    contentStr += '<br><button id="delete-place">Remove from favorites</button><br>';
    infowindow.setContent(contentStr);
  })
}

//// Load Google Places search results ////
function getPlaceResults(searchBox, map) {
  var markers = [];
  // Listen for event fired when user selects a prediction and retrieve more details for that place
  searchBox.addListener('places_changed', function() {

    // Close profile before loading results if it is open
      var profile = $('#profile-container');
      if (profile.is(':visible')){
        closeProfile();
      }

    // Same for the navigation bar
      var navBar = $('#navigation');
      if (navBar.is(':visible')){
        closeNav();
      }

    var places = searchBox.getPlaces();
    // Irwin - Experimenting
    console.log("Irwin-Stuff");
    console.log(places[0].geometry.location.lat());
    // --------------------

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
            contentStr += '<br><button id="save-place">Add to favorites</button><br>';
            contentStr += '<div style="display:none;" class="infowindow-expanded">';
            infowindow.setContent(contentStr);
            infowindow.open(map,marker);

            savePlace(infowindow, place);
            //
            // var payload = {
            //   name: place.name
            // }


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


//// Saving Places (Add Notes and/or Add To List) ////
function savePlace(contentStr, place){
  console.log(place);
  currentPlace = place;
  var saveButton = $('#save-place');
  $(document).off().on('click', '#save-place', function(infowindow){
    var $notes           = ('<textarea class="notes" placeholder="Add notes">');
    var $selectList      = ('<select id="customListOptions"><option value="Summer Patio Spots">Summer Patio Spots</option><option value="Fancy Restaurants">Fancy Restaurants</option></select><br>');
    var $confirmButton   = ('<button class="confirm">Save</button>');
    var $expandedArea    = $('.infowindow-expanded');

    // TODO grab data list Custom List options from user's data, if any exist
    // <input type="text" name="customList" list="customListName"/>
    //   <datalist id="customListName">
    //       <option value="Summer Patio Spots">Summer Patio Spots</option>
    //       <option value="Fancy Restaurants">Fancy Restaurants</option>
    //       <option value="Hidden Gems">Hidden Gems</option>
    //   </datalist>

    // TODO add a cancelation / slideUp feature to this in case the person does NOT want to save the place

    $expandedArea.show();
    saveButton.hide();
    if ($expandedArea.children().length === 0){
      $expandedArea.append($notes);
      $expandedArea.append($selectList);
      $expandedArea.append($confirmButton);
      // HANDLE CONFIRM SAVE BUTTON ACTION
      setConfirmHandler(place);
    }
  })
};


// IRWIN CODE -- Click Event Handler for CONFIRM SAVE BUTTON
function setConfirmHandler(){
  $('.confirm').click(function(e){
    e.preventDefault();

    var payload = {
      name: currentPlace.name,
      place_id: currentPlace.place_id,
      type: currentPlace.types[0],
      address: currentPlace.formatted_address,
      lat: currentPlace.geometry.location.lat(),
      lng: currentPlace.geometry.location.lng(),
    };
    $.ajax({
      url: '/api/users',
      method: 'put',
      data: payload,
      success: function(data){
        console.log(data);
        var $li = $('<li>').text(data.name);
        $('#favorite-places').append($li);
        // Let's handle closing the info window after user clicks "confirm save button"
      }
    });
    getCurrentUser();
  })
}
// END OF IRWIN CODEEEEE



//// Opening & Interacting with Navigation Menu ////
function controlNav() {
  var navButton = $('#hamburger-button');
  var navBar = $('#navigation');
  navButton.clickToggle(function(){
    navBar.slideDown();
  }, function(){
    navBar.slideUp();
  })
}

function toggleCategory() {
  // TODO make AJAX calls to filter through places by category
  var toggler = $('.cat-toggle')
  toggler.clickToggle(function(){
    $(this).removeClass('fa-toggle-on');
    $(this).addClass('fa-toggle-off');
  }, function(){
    $(this).removeClass('fa-toggle-off');
    $(this).addClass('fa-toggle-on');
  })
}


//// Opening & Editing Profile ////
function openProfile() {
  var profileIcon = $('.profile-img');
  profileIcon.clickToggle(function(){
    // Close navbar before loading results if it is open
    var navBar = $('#navigation');
    if (navBar.is(':visible')){
      closeNav();
    }

    var profile = $('#profile-container');
    profile.slideDown();
  }, function(){
    closeProfile();
  })
}

function handleCloseButton() {
  var closeButton = $('#close-profile');
  closeButton.click(function(){
    closeProfile();
  });
}

function closeProfile() {
  var profile = $('#profile-container');
  profile.slideUp();
}

//// Log Out ////
function setLogoutHandler(){
  $("#logout-link").click(function(e){
    e.preventDefault();
    Cookies.remove('user_token');
    Cookies.remove('current_user');
    location.reload();
  })
}


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

// Run on document load
$(function(){

  initMap();
  resetLocation();

  controlNav();
  toggleCategory();

  openProfile();
  handleCloseButton();

  setLogoutHandler();

})
