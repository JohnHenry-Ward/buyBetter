"use strict";

let map;
let service;
let infowindow;


function getLatLong(query, zip) {
  console.log("zip from getLatLong = " + zip);
  var latitude;
  var longitude;

  // URL to the api
  const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&sensor=true&key=AIzaSyCHo3PURM20ItmQlRgnS4gGWxyTnUaEIj8";

  // asynchronously call the api 
  fetch(url)
    .then(function (response) {
      console.log("returning json");
      return response.json(); // get json 
    })
    .then(function (jsonResponse) { // do something with jsonResponse 

      // set the latitude and longitude based on the user's zipcode
      latitude = jsonResponse.results[0].geometry.location.lat;
      longitude = jsonResponse.results[0].geometry.location.lng;
      console.log("lat = " + latitude);
      console.log("long = " + longitude);
      

      //grab lat and long
      const location = new google.maps.LatLng(latitude, longitude);
      infowindow = new google.maps.InfoWindow();
      
      console.log("lat type " + typeof(latitude));
      //userPosition
      const userPosition = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      console.log('userpos');
      console.log(userPosition);
      //initalize the map
      const map = new google.maps.Map(document.getElementById("map"), {
        center: userPosition,
        zoom: 12,
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
      console.log(`QUERY: ${query}`);
      var request = {
        location: location,
        radius: '10000', //in meters
        keyword: query,
        type: ['store']
      };
      //make the request and handle the result
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, (results, status) => { // stores are in results
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let stores = document.getElementById('stores');
          /* traverse through stores found */
          console.log("results = " + results);
          for (let i = 0; i < results.length; i++) { // find a way to get the address from results

            //console.log("result["+i+"].geometry.location = " + results[i].geometry.location); // prints a tuple (lat,lng)
            //console.log(JSON.stringify(results[i])); 
            //console.log("results["+i+"].vicinity = " + results[i].vicinity); 

            createMarker(results[i], map); // result[i] -> place, map -> map

            /* create div element for each store */
            let store = document.createElement('DIV');
            store.setAttribute('class', 'store');

            /* get the name of the store and create list to store attributes of store */
            let name = document.createElement('ul');
            name.innerHTML = results[i].name; // for each store found, insert the name of the store into html
            
            /* get the current address of store, store it as an attribute of the store */
            let address = document.createElement('li');
            address.innerText= results[i].vicinity;
            name.appendChild(address);

            /* create the list */
            store.appendChild(name);
            store.appendChild(address);
            stores.appendChild(store);

            let placeID = results[i].place_id;
            // storeURLrequest(placeID, map); this will create a lot of requests DO NOT COMMENT THIS OUT RIGHT NOW
          }
        }
      });
    });
}



function initMap(query, zipcode) {
  console.log('initMap');
  if (query == undefined || query == '') {
    return;
  }

  // document.getElementById('temp').style.display = "none";
  // document.getElementById('temp').style.visibility = "hidden";

  console.log(`Query: ${query}`);
  console.log(`zipcode: ${zipcode}`);
  //const HERE = new google.maps.LatLng(latitude, longitude); 
  //const userPosition = {lat: latitude, lng: longitude};
  getLatLong(query, zipcode);

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

function createPopUp(storeName) {
  console.log(storeName.includes('Amazon'));
  if (storeName == '-1' || storeName.includes('Amazon') || storeName.includes('amazon')) {
    const popup = document.getElementById('popupStore');
    popup.style.display = 'none';
  } else {
    const popupName = document.getElementById('popupStoreName');
    popupName.innerHTML = storeName;
  }
}

function closePopUp() {
  const popup = document.getElementById('popupStore');
  popup.style.display = 'none';
}

function searchGoogle(name) {
  window.open(`https://google.com/search?q=${name}`, '_blank');
}