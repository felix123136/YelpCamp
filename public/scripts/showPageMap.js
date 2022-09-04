mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: coordinates,
  zoom: 12,
  projection: "globe",
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<strong>${title}</strong><p>${loc}</p>`
);

// create DOM element for the marker
const el = document.createElement("div");
el.id = "marker";

// create the marker
new mapboxgl.Marker(el)
  .setLngLat(coordinates)
  .setPopup(popup) // sets a popup on this marker
  .addTo(map);
