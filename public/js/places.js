"use strict";

let map;
let service;
let infowindow;

function getResults(query, zip) {
  if (query == undefined || query == '' || zip == undefined || zip == '') {
    return;
  }
  var latitude;
  var longitude;

  // URL to the api
  const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&sensor=true&key=AIzaSyCHo3PURM20ItmQlRgnS4gGWxyTnUaEIj8";

  // asynchronously call the api 
  fetch(url)
    .then(function (response) {
      return response.json(); // get json 
    })
    .then(function (jsonResponse) { // do something with jsonResponse 

      // set the latitude and longitude based on the user's zipcode
      latitude = jsonResponse.results[0].geometry.location.lat;
      longitude = jsonResponse.results[0].geometry.location.lng;

      //grab lat and long
      const location = new google.maps.LatLng(latitude, longitude);
      infowindow = new google.maps.InfoWindow();
      //userPosition
      const userPosition = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
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
          for (let i = 0; i < results.length; i++) { // find a way to get the address from results

            let thisMarker = createMarker(results[i], map); // result[i] -> place, map -> map

            /* create div element for each store */
            let store = document.createElement('DIV');
            store.setAttribute('class', 'store');

            store.addEventListener('click', () => {
              linkStoreToMap(thisMarker, results[i], map);
            });

            /* get the name of the store and create list to store attributes of store */
            let name = document.createElement('p');
            name.setAttribute('class', 'storeName');
            name.innerHTML = results[i].name; // for each store found, insert the name of the store into html
            
            /* get the current address of store, store it as an attribute of the store */
            let address = document.createElement('p');
            address.setAttribute('class', 'storeAddress');
            address.innerText= 'Address: ' + results[i].vicinity;

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

  return marker;
}

function linkStoreToMap(marker, place, map) {
  infowindow.setContent(place.name);
  infowindow.open(marker.get("map"), marker);
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