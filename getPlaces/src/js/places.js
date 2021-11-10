"use strict";

let map;
let service;
let infowindow;
let json;

/* grab information form the form */
function getQuery() {

    let query = document.forms['queryForm']['query'].value; // get what user is searching for
    let zip = document.forms['queryForm']['zip'].value;  // get zipcode the user inputs 
    var lat;
    var long;

    /* get json object */
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&sensor=true&key=AIzaSyCHo3PURM20ItmQlRgnS4gGWxyTnUaEIj8"

    /* asynchronously call the api */
    fetch(url)
    .then(function(response) {
      return response.json(); // get json 
    })
    .then(function(jsonResponse) {
      // do something with jsonResponse

      // set the latitude and longitude based on the user's zipcode
      lat = jsonResponse.results[0].geometry.location.lat;
      long = jsonResponse.results[0].geometry.location.lng;
      //console.log("(lat,long) = " + "("+lat+","+ long+")");
      //console.log("jsonResponse.results[0].geometry.location.lat = " + JSON.stringify(jsonResponse.results[0].geometry.location.lat));
      //console.log("jsonResponse.results[0].geometry.location.lng = " + JSON.stringify(jsonResponse.results[0].geometry.location.lng));
      // initialize the map based on the user's latitude and longitude
      initMap(query, lat, long);  
    });


    console.log("zip = " + zip);
}

/* function that will traverse through json object and return an array containing longitude and latitude */
function getLatLong(json)
{
  var longLat = new Array();

  /* traverse through json */


  return longLat;
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