"use strict";

let map;
let service;
let infowindow;
let json;

/* grab information form the form */
function getQuery() {
    var geocoder= new google.maps.Geocoder();
    let query = document.forms['queryForm']['query'].value;
    let zip = document.forms['queryForm']['zip'].value; 
    var json;

    /* get json object */
    const Http = new XMLHttpRequest();
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&sensor=true&key=AIzaSyCHo3PURM20ItmQlRgnS4gGWxyTnUaEIj8"
    Http.open("GET", url, false);
    Http.send(null);


    json = JSON.parse(Http.responseText);

    /*
    Http.onreadystatechange = (e) => {
      json = JSON.parse(Http.responseText);
      //console.log(json);
      //console.log(Http.responseText)
    }
    */

    console.log(json);
    console.log("zip = " + zip);

    initMap(query, 48.7959658, -122.4523385);  
}

/* function to fetch json of the user's zipcode */
async function getData(url) {
  const response = await fetch(url);
  return response.json();
}



/* initialize the map */
function initMap(query, lat, lng) {
  const HERE = new google.maps.LatLng(lat, lng); //currently hardcoded latitude and longitude
  console.log("lat = " + lat + ", long = " + lat);
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