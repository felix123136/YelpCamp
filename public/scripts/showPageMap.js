mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: campground.geometry.coordinates,
  zoom: 12,
  projection: "globe",
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<strong>${campground.title}</strong><p>${campground.location}</p>`
);

// create the marker
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup) // sets a popup on this marker
  .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
