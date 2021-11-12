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

  //start service
  service = new google.maps.places.PlacesService(map);
  
  
  
  
  //get nearby stores 
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      //store nearby stores found
      var stores = [];
      document.getElementById('output').innerHTML = '';
      for (let i = 0; i < results.length; i++) {
        
        //add marker
        createMarker(results[i]);

        
        //append to webpage
        document.getElementById('output').innerHTML += "<div id="+ results[i].name.replace(/\s/g, '') + ">" + results[i].name + '</div>' + '<br>';
        
        //go through store grab needed website
        
        var storeDetails = getNearbyStore(results[i]);

        stores.push(storeDetails);
      }
      
      
      // display and center the map
      document.getElementById('map').style.display = 'block';
      map.setCenter(results[0].geometry.location);

      //get place detail
      getPlaceDetail(service, stores);

    }
  });

  
  //Scrape through entry
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

/**
 * returns the given nearby store
 */
function getNearbyStore(store){
  return {
    "name": store['name'],
    "place_id": store['place_id']
  };
}

/**
 * gets place details
 */
function getPlaceDetail(service, stores){

  for(let i = 0; i < stores.length; i++){
    
    var request = {
      placeId: stores[i]['place_id'],
      fields: ['website','address_component', 'adr_address', 'business_status', 'formatted_address', 'geometry', 'icon', 'icon_mask_base_uri', 'icon_background_color', 'name', 'photo', 'place_id', 'plus_code', 'type', 'url','utc_offset_minutes', 'vicinity']
    };
    service.getDetails(request, callback);
  }

  function callback(place, status) {
    
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var website_description = "No Website Provided";
      if (place['website'] !== undefined){
        website_description = place['website'];
      }
      var id= place.name.replace(/\s/g, '');
      //add website in the website
      document.getElementById(id).innerHTML += ' : ' + website_description;
    }
  }
}