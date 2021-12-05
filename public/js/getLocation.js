// This is to get the latitude and longitude of the user
function getUserLocation() {
    navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let inputFieled = document.querySelector('#zip');
    inputFieled.value = `${lat},${long}`;
    return false;
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}