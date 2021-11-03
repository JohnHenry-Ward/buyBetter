"use strict";

let map;
let service;
let infowindow;

function getQuery() {
  let query = document.forms['queryForm']['query'].value;
  initMap(query);  
}

function initMap(query) {
  const HERE = new google.maps.LatLng(48.724430, -122.487360); //currently hardcoded latitude and longitude
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: HERE,
    zoom: 15
  });
  var request = {
      location: HERE ,
      radius: '10000',
      keyword: query,
      type: ['store']
    };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      document.getElementById('output').innerHTML = '';
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
        document.getElementById('output').innerHTML += results[i].name + '<br>';
      }
      document.getElementById('map').style.display = 'block';
      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name);
    infowindow.open(map);
  });
}