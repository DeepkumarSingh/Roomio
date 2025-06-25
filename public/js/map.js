mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    //style:"mapbox://styles/mapbox/satellite-streets-v12", //style url
    style:"mapbox://styles/mapbox/navigation-night-v1", //style url
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color : "#ff6347"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h5>${listing.title} </h5> <b>Exact location will be provided after Login</b>`
    ))
    .addTo(map);
