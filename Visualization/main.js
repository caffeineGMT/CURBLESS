mapboxgl.accessToken = 'pk.eyJ1IjoiY2FmZmVpbmVnbXQiLCJhIjoiY2p6MmR5M3V0MDR1YTNsbjRqYzhmN3c0aSJ9.TBsNtz57qu1jqaymu-Icmg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'Styles/Minimo(ck0u4u0ml0ci51clxgcxra56y)/style.json',
  center: [-118.255, 34.047],
  zoom: 16
  // center: [-118.494, 34.017],
  // center: [-118.494, 34.013],
  // zoom: 16
});

map.on("load", function () {
  /*DTLA-related data*/
  map.addSource("Downtown_LA_curb", {
    type: 'geojson',
    data: 'Downtown_LA_curb.geojson'
  });
  map.addLayer({
    "id": "route",
    "type": "line",
    "source": "Downtown_LA_curb",
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": ['get', 'asset_subtype'],
      "line-width": 2
    }
  });

  map.addSource('DTLA_gdf_start', {
    type: 'geojson',
    data: 'DTLA_gdf_start.json'
  });
  map.addLayer({
    "id": "start",
    "type": "circle",
    "source": "DTLA_gdf_start",
    "paint": {
      "circle-radius": 5,
      "circle-color": "#006a4e",
      "circle-opacity": 0.3,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#006a4e"
    },
    "filter": ["==", "$type", "Point"],
  });

  map.addSource('DTLA_gdf_end', {
    type: 'geojson',
    data: 'DTLA_gdf_end.json'
  });
  map.addLayer({
    "id": "end",
    "type": "circle",
    "source": "DTLA_gdf_end",
    "paint": {
      "circle-radius": 5,
      "circle-color": "#9B1C31",
      "circle-opacity": 0.2,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#9B1C31"
    },
    "filter": ["==", "$type", "Point"],
  });

  map.addSource('network', {
    type: 'geojson',
    data: 'network.geojson'
  });

  map.addSource('scooter_trips', {
    type: 'geojson',
    data: 'scooter_trips.geojson'
  });
  map.addLayer({
    'id': 'scooter_trips',
    'type': 'line',
    'source': 'scooter_trips',
    'layout': {
      'line-join': 'miter',
      'line-cap': 'square'
    },
    'paint': {
      'line-color': '#FF0000',
      'line-width': 5
    }
  });

  /*Santa Monica related data*/

  // map.addSource("Santa_Monica_curb", {
  //   type: 'geojson',
  //   data: 'Santa_Monica_curb.geojson'
  // });
  // map.addLayer({
  //   "id": "route",
  //   "type": "line",
  //   "source": "Santa_Monica_curb",
  //   "layout": {
  //     "line-join": "round",
  //     "line-cap": "round"
  //   },
  //   "paint": {
  //     "line-color": ['get', 'asset_subtype'],
  //     "line-width": 2
  //   }
  // });

  // map.addSource('Santa_Monica_gdf_start', {
  //   type: 'geojson',
  //   data: 'Santa_Monica_gdf_start.json'
  // });
  // map.addLayer({
  //   "id": "start",
  //   "type": "circle",
  //   "source": "Santa_Monica_gdf_start",
  //   "paint": {
  //     "circle-radius": 5,
  //     "circle-color": "#006a4e",
  //     "circle-opacity": 0.3,
  //     "circle-stroke-width": 2,
  //     "circle-stroke-color": "#006a4e"
  //   },
  //   "filter": ["==", "$type", "Point"],
  // });

  // map.addSource('Santa_Monica_gdf_end', {
  //   type: 'geojson',
  //   data: 'Santa_Monica_gdf_end.json'
  // });
  // map.addLayer({
  //   "id": "end",
  //   "type": "circle",
  //   "source": "Santa_Monica_gdf_end",
  //   "paint": {
  //     "circle-radius": 5,
  //     "circle-color": "#9B1C31",
  //     "circle-opacity": 0.2,
  //     "circle-stroke-width": 2,
  //     "circle-stroke-color": "#9B1C31"
  //   },
  //   "filter": ["==", "$type", "Point"],
  // });

});


