//// Rendering Map and Places ////

// Google Map with geolocation (if browser and user permit)
var map;
var initialLocation;
var sydney = new google.maps.LatLng(-34.397, 150.644)
var browserSupportFlag = new Boolean();
var markers = [];
var cookiesUser = JSON.parse(Cookies.get().current_user);
//  Global variables storing current user and current place objects. NOT VERY ELEGANT BUT... ¯\_(ツ)_/¯
var currentUser = {};
var currentPlace = {};
// EXPERIMENTAL-CATEGORY-SORT
var filter = [];
var allMarkers = [];
var infowindow = null;

//// Create Google map on page load with autocomplete searchBox ////
function initMap() {
  console.log('initializing');
  var options = {
    zoom: 16,
    maxZoom: 19,
    minZoom: 5
  };
  map = new google.maps.Map(document.getElementById('map'), options);
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

  // Add geocoder in order to retrieve POIs by latlng on click...
  geocoder = new google.maps.Geocoder;

  // Override info window prototype to include "add to favorites" button on built-in POIs
  var fx = google.maps.InfoWindow.prototype.setPosition;
  google.maps.InfoWindow.prototype.setPosition = function () {
    if (this.logAsInternal) {
      google.maps.event.addListenerOnce(this, 'map_changed',function(){
        var map = this.getMap();
        if (map) {
          google.maps.event.trigger(map, 'click', {content: this.getContent(), latlng: this.getPosition()});
        }
      });
    }
    fx.apply(this,arguments);
  }

  google.maps.event.addListenerOnce(map,'click',function(e){
      var $latlng     = $(e.latlng);
      console.log($latlng);
      geocoder.geocode({
        'location': e.latlng
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            console.log([results]);
            alert("You would think this ''" + results[0].place_id + "'' is the correct place id, but it's not");
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });


      var $infowindow = $(e.content);
      console.log($infowindow);
      var $saveButton = $('<button id="save-place">Add to favorites</button>');
      $infowindow.append($saveButton);
      $infowindow.append('<div style="display:none;" class="infowindow-expanded">')

      $saveButton.click(function(){
        var $notes           = ('<textarea class="notes" placeholder="Add notes">');
        var $confirmButton   = ('<button class="confirm">Save</button>');
        var $expandedArea    = $('.infowindow-expanded');

        $expandedArea.show();
        $saveButton.hide();
        if ($expandedArea.children().length === 0){
          $expandedArea.append($notes);
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
      renderFavorites();
    }
  })
} // end getCurrentUser

// Sets all markers on map
function setMapOnAll(map) {
  for (var i = 0; i < allMarkers.length; i++) {
    allMarkers[i].setMap(map);
  }
}

// Removes the markers from the map and array
function clearMarkers() {
  setMapOnAll(null);
  allMarkers = [];
}

//// Rendering markers for existing user favorites ////
function renderFavorites() {
  var favorites = []
  //  EXPERIMENTAL-CATEGORY-SORT
  var filterList = [];
  var index = null;
  for (var i = 0; i < filter.length; i++) {
    if (filter[i] == "coffee"){
      filterList.push("cafe","coffee");
    } else if (filter[i] == "restaurant"){
      filterList.push("restaurant","meal_delivery","meal_takeaway");
    } else if (filter[i] == "bar"){
      filterList.push("bar","night_club");
    } else if (filter[i] == "store"){
      filterList.push("store","bicycle_store","book_store","clothing_store","convenience_store",
                      "department_store","electronics_store","furniture_store","hardware_store",
                      "home_goods_store","jewelry_store","liquor_store","pet_store","shoe_store");
    } else if (filter[i] == "movie"){
      filterList.push("movie_rental","movie_theater");
    } else if (filter[i] == "park"){
      filterList.push("amusement_park","park","rv_park");
    } else if (filter[i] == "museum"){
      filterList.push("museum");
    }
  }

  for (var i = 0; i < currentUser.favorites.length; i++) {
    if(filterList.indexOf(currentUser.favorites[i].type) === -1){
      favorites.push(currentUser.favorites[i]);
    }
  }
  // for (var i = 0; i < currentUser.favorites.length; i++) {
  //   addMarker(currentUser.favorites[i]);
  // }
  for (var i = 0; i < favorites.length; i++) {
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

  var counter = 0;
  var marker = new google.maps.Marker({
       position: latlng,
       map: map,
       icon: icon,
       id: counter
  });
  allMarkers.push(marker);
  addFavoriteInfo(favorite, marker,counter);
  counter++;
}

//// Pop up an infoWindow when a favorite is clicked ////
function addFavoriteInfo (favorite, marker,counter) {

  marker.addListener('click', function(){
    if (infowindow) {
      infowindow.close();
    }
    infowindow = new google.maps.InfoWindow();
    console.log(favorite.notes);
    infowindow.open(map, this);
    console.log(favorite._id);
    var contentStr = '<h5>'+favorite.name+'</h5><p>'+favorite.address;
    if (favorite.notes) contentStr += '<p><em>'+favorite.notes+'</em></p>';
    contentStr += '<br><button id="delete-place" data-id="' + counter + '">Remove from favorites</button><br>';
    infowindow.setContent(contentStr);
    deleteFavorite(favorite._id, marker);
  })
}

//// Delete a favorite ////
function deleteFavorite(favoriteId, marker) {
  $(document).off().on('click', '#delete-place', function(infowindow){
    $.ajax({
      url: '/api/favorite/' + favoriteId,
      method: 'delete',
      success: function(data){
        marker.setMap(null);
      }
    })
  })
}

//// Load Google Places search results ////
function getPlaceResults(searchBox, map) {

  // Listen for event fired when user selects a prediction and retrieve more details for that place
  // If there are markers from a previous search, clear them first.
  searchBox.addListener('places_changed', function() {
    if (Object.keys(markers)){
      Object.keys(markers).forEach(function(markerKey){
        console.log(markerKey);
        markers[markerKey].setMap(null);
      })
    }

    // Fresh markers array
    markers = [];

    // Close profile before loading results if it is open
      var profile = $('#profile-container');
      if (profile.is(':visible')){
        closeProfile();
      }

    // Same for the navigation bar
      var navBar = $('#navigation');
      if (navBar.is(':visible')){
        navBar.hide();
      }

    var places = searchBox.getPlaces();


    if (places.length == 0) {
      return;
    }

    // Clear out old markers
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = {};

    // Add new markers for each Place
    var bounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
    counter = 0;
    places.forEach(function(place){

      var icon = {
        url: place.icon,
        size: new google.maps.Size(71,71),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(17,34),
        scaledSize: new google.maps.Size(30,30)
      };

      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        id: counter
      })

      // markers.push(marker);
      markers[counter] = marker;


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
            console.log(infowindow);
            infowindow.open(map,marker);


            savePlace(infowindow, place, marker.id);
            setConfirmHandler(infowindow);


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
      counter++;
    });
    console.log(markers);
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
function savePlace(infowindow, place, counter){
  console.log(counter);
  var saveButton = $('#save-place');
  currentPlace = place;
  $(document).off().on('click', '#save-place', function(infowindow){
    var $notes           = ('<textarea class="notes" placeholder="Add notes">');
    var $confirmButton   = ('<button class="confirm" data-id="' + counter + '">Save</button>');
    var $expandedArea    = $('.infowindow-expanded');

    $expandedArea.show();
    saveButton.hide();
    if ($expandedArea.children().length === 0){
      $expandedArea.append($notes);
      $expandedArea.append($confirmButton);
      setConfirmHandler(place, $notes);
    }
  })
};

// IRWIN CODE -- store place data as a new favorite in the user's db record on confirm
function setConfirmHandler(infowindow, $notes){
  $('.confirm').click(function(e){
    e.preventDefault();
    var payload = {
      name: currentPlace.name,
      place_id: currentPlace.place_id,
      type: currentPlace.types[0],
      address: currentPlace.formatted_address,
      lat: currentPlace.geometry.location.lat(),
      lng: currentPlace.geometry.location.lng(),
      notes: $('.notes').val()
    };
    console.log($(this).attr('data-id'))
    $.ajax({
      url: '/api/users/edit/addfavorite',
      method: 'put',
      saveButton: $(this),
      data: payload,
      success: function(data){

        var counter = $(this.saveButton).attr('data-id');
        var marker = markers[counter];


        // TEMP: append to profile div
        var $li = $('<li>').text(data.name);
        $('#favorite-places').append($li);

        // Remove icon in favor of new
        marker.setMap(null);
        getCurrentProfileUser();
      }
    });
    getCurrentUser();
  })
}
// END OF IRWIN CODEEEEE


//// Opening & Interacting with Navigation Menus ////
function controlFilterMenu() {
  // var navButton = $('#hamburger-button');
  var filter = $('#filter');
  var navBar = $('#navigation');

  filter.clickToggle(function(){
    navBar.slideDown();
  }, function() {
    navBar.slideUp();
  })
  // navButton.clickToggle(function(){
  //   navBar.slideDown();
  // }, function(){
  //   navBar.slideUp();
  // })
}

function toggleCategory() {
  // TODO make AJAX calls to filter through places by category
  // var toggler = $('.cat-toggle');
  // toggler.clickToggle(function(){
  //   $(this).removeClass('fa-toggle-on');
  //   $(this).addClass('fa-toggle-off');
  //   filter.push($(this)[0].id);
  // }, function(){
  //   $(this).removeClass('fa-toggle-off');
  //   $(this).addClass('fa-toggle-on');
  //   filter.pop($(this)[0].id);
  // });

  // EXPERIMENTAL HANDLER
  var wholeToggler = $('.whole-toggle');
  wholeToggler.clickToggle(function(){
    $(this).children().removeClass('fa-toggle-on');
    $(this).children().addClass('fa-toggle-off');
    console.log('filter ' + $(this).children()[0].id);
    filter.push($(this).children()[0].id);
    clearMarkers();
    renderFavorites();
  }, function(){
    $(this).children().removeClass('fa-toggle-off');
    $(this).children().addClass('fa-toggle-on');
    console.log('show ' + $(this).children()[0].id);
    var index = filter.indexOf($(this).children()[0].id);
    filter.splice(index, 1);
    clearMarkers();
    renderFavorites();
  });
};


//// Opening & Editing Profile ////
function controlProfileMenu() {
  var profileDiv = $('.profile-menu');
  var profileMenu = $('#dropdown-menu');
  profileDiv.clickToggle(
    function() {
      profileMenu.slideDown();
    }, function() {
      profileMenu.slideUp();
    }
  );
}

function openProfile() {
  var profileLink = $('#profile-link');
  var profileMenu = $('#dropdown-menu');
  profileLink.click(function(){
    var navBar = $('#navigation');
    if (navBar.is(':visible')){
      navBar.hide();
    }
    console.log('sup');
    var profile = $('#profile-container');
    profile.slideDown();
    profileMenu.slideUp();
  })
//   profileLink.clickToggle(function(){
//     console.log('yay');
//     // Close navbar before loading results if it is open
//     var navBar = $('#navigation');
//     if (navBar.is(':visible')){
//       navBar.hide();
//     }
//
//     var profile = $('#profile-container');
//     profile.show();
//   }, function(){
//     closeProfile();
//   })
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

  deleteFavorite();

  initMap();
  resetLocation();

  controlFilterMenu();
  toggleCategory();
  controlProfileMenu();

  openProfile();
  handleCloseButton();

  setLogoutHandler();
  getCurrentUser();

})
