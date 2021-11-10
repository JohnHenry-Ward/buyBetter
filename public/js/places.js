"use strict";

let map;
let service;
let infowindow;

function getQuery() {
  let query = document.forms['queryForm']['query'].value;
  initMap(query);  
}

function initMap(query) {
  if (query == undefined || query == '') {
    document.getElementById('temp').innerHTML = "<h1>Search to display the map</h1>";
    return;
  }

  document.getElementById('temp').style.display = "none";
  document.getElementById('temp').style.visibility = "hidden";

  console.log(`Query: ${query}`);
  const HERE = new google.maps.LatLng(48.724430, -122.487360); //currently hardcoded latitude and longitude
  const userPosition = {lat: 48.724439, lng: -122.487360};
  infowindow = new google.maps.InfoWindow();
  //initalize the map
  const map = new google.maps.Map(document.getElementById("map"), {
    center: userPosition,
    zoom: 13,
  });
  const marker = new google.maps.Marker({
    map: map,
    position: userPosition,
    label: 'ME',
  });
  //add event listener over users marker
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent('Your Location');
    infowindow.open(marker.get("map"), marker);
  });
  //create the request
  var request = {
      location: HERE ,
      radius: '10000', //in meters
      keyword: query,
      type: ['store']
    };

  //make the request and handle the result
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById('output').innerHTML = '';
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i], map);
        document.getElementById('output').innerHTML += results[i].name + '<br>';
        let placeID = results[i].place_id;
        // storeURLrequest(placeID, map); this will create a lot of requests DO NOT COMMENT THIS OUT RIGHT NOW
      }
      document.getElementById('map').style.display = 'block';
      document.getElementById('map').style.visibility = 'visible';
      document.getElementById('output').style.display = 'block';
      document.getElementById('output').style.visibility = 'visible';
      // map.setCenter(results[0].geometry.location);
    }
  });
}

//cereates a red marker over each store
function createMarker(place, map) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name);
    infowindow.open(marker.get("map"), marker);
  });
}

//gets the URL of each store listed
function storeURLrequest(id, map) {
  console.log('test');
  let req = {
    placeId: id,
    fields: ['website'],
  }

  service = new google.maps.places.PlacesService(map);
  service.getDetails(req, (response, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(response);
    } else {
      console.log(status);
    }
  })
}