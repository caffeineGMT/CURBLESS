// require modules
const PathFinder = require('./node_modules/geojson-path-finder');
const Converter = require('./node_modules/geojson');
const point = require('turf-point');
const fs = require('fs');

// fetch road network data. this must be in json format
const geojson = require('../Visualizer/df.json');
const start = require('../Visualizer/gdf_start.json');
const end = require('../Visualizer/gdf_end.json');

// fetch location data

var start_points = [];
var end_points = [];
var paths_array_wip = [];
var pathFinder = new PathFinder(geojson, { precision: 0.00050 });
var n = 0;

for (let i = 0; i < start.features.length; i++) {
    let start_point = point(start.features[i].geometry.coordinates);
    let end_point = point(end.features[i].geometry.coordinates);
    let path = pathFinder.findPath(start_point, end_point);
    if ((path != null) && (path.path.length != 1)) {
        // console.log(path.path.length);
        n++;
        let path_array = path.path;
        let path_array_wip =
        {
            line: path_array
        }
            ;
        paths_array_wip.push(path_array_wip);
        start_points.push(start_point);
        end_points.push(end_point);
    }
}
console.log(n);
console.log(paths_array_wip);

// var start_point = point([
//     -118.256195,
//     34.0471
// ]);
// var end_point = point([
//     -118.258643333333325,
//     34.048385
// ]);

// // calculate path
// var pathFinder = new PathFinder(geojson, { precision: 1e-3 });
// var path = pathFinder.findPath(start_point, end_point);
// if (path != null) {
//     var path_array = path.path;
//     var path_array_wip = [
//         {
//             line: path_array
//         }
//     ];
// }

// write path into geojson
var scooter_trips = Converter.parse(paths_array_wip, { LineString: 'line' });
var scooter_trips_string = JSON.stringify(scooter_trips, null, 4);
fs.writeFile('./scooter_trips.geojson', scooter_trips_string, (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log('File has been created');
});

