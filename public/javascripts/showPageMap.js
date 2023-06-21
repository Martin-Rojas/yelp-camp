mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
   container: "map", // container ID
   // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
   style: "mapbox://styles/mapbox/streets-v12", // style URL
   center: campground.geometry.coordinates, // starting position [lng, lat]
   zoom: 9, // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Create a default Marker, colored black, rotated 45 degrees.
const marker2 = new mapboxgl.Marker({ color: "red", rotation: 45 })
   .setLngLat(campground.geometry.coordinates)
   .addTo(map);

const popup = new mapboxgl.Popup({ offset: 25 })
   .setLngLat(campground.geometry.coordinates)
   .setHTML(`<h4>${campground.title}</h4>`)
   .addTo(map);
