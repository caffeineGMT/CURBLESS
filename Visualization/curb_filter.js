//load modules
const Converter = require('./node_modules/geojson');
const fs = require('fs');

//read curb geojson file
const curb_json = require('../Visualizer/SanDiego_LittleItaly_curb.json');

//helper function: analyse curb statistic data and list out all the break-downs
function curb_statistic_collector(curb_json) {
    //temp var
    let cf = curb_json.features;
    let len = curb_json.features.length;
    //return var
    let ghJSON_collection = {
        curb_stats: []
    };
    for (let i = 0; i < len - 1; i++) {
        //search for the start of one block
        if ((i == 0) || (cf[i].geometry.type == 'Point'
            && cf[i + 1].geometry.type == 'LineString')) {
            //sidewalk stats
            let curb_info = {};
            let indivisual_unparkable_curb = [];
            let sidewalk_len = 0;
            let unparkable_curb_sum = 0;
            let curb_cut_sum = 0;
            let j = i + 1;
            //loop over all the curbs in that block
            while (cf[j].geometry.type == 'LineString') {
                //unparkable curb stats
                let current_curb_len =
                    cf[j].properties.distance_end_meters
                    - cf[j].properties.distance_start_meters;
                indivisual_unparkable_curb.push(current_curb_len.toFixed(2));
                unparkable_curb_sum += current_curb_len;
                //keep track of the length of sidewalk
                sidewalk_len = cf[j].properties.distance_end_meters;
                //calculate sub-division of unparkable curb
                if (cf[j].properties.asset_type == 'Curb Cut') {
                    let current_curb_cut_len =
                        cf[j].properties.distance_end_meters
                        - cf[j].properties.distance_start_meters;
                    curb_cut_sum += current_curb_cut_len;
                }
                j++;
            }
            let parkable_curb_sum = sidewalk_len - unparkable_curb_sum;
            let parkable_ratio = parkable_curb_sum / sidewalk_len;
            let unparkable_ratio = unparkable_curb_sum / sidewalk_len;
            let paint_sum = unparkable_curb_sum - curb_cut_sum;
            let curb_cut_ratio = curb_cut_sum / sidewalk_len;
            let paint_ratio = paint_sum / sidewalk_len;
            curb_info.indivisual_unparkable_curb = indivisual_unparkable_curb;
            curb_info.sidewalk_len = sidewalk_len.toFixed(2);
            curb_info.unparkable_curb_sum = unparkable_curb_sum.toFixed(2);
            curb_info.parkable_curb_sum = parkable_curb_sum.toFixed(2);
            curb_info.unparkable_ratio = unparkable_ratio.toFixed(2);
            curb_info.parkable_ratio = parkable_ratio.toFixed(2);
            curb_info.curb_cut_sum = curb_cut_sum.toFixed(2);
            curb_info.paint_sum = paint_sum.toFixed(2);
            curb_info.curb_cut_ratio = curb_cut_ratio.toFixed(2);
            curb_info.paint_ratio = paint_ratio.toFixed(2);
            //big collection
            ghJSON_collection.curb_stats.push(curb_info);
        }
    }
    return ghJSON_collection;
}

function data_cleaner(ghJSON_collection) {
    let cleaned_data = {
        curb_stats: []
    };
    let len = ghJSON_collection.curb_stats.length;
    for (let i = 0; i < len; i++) {
        if (ghJSON_collection.curb_stats[i].unparkable_ratio <= 1.0
            & ghJSON_collection.curb_stats[i].unparkable_ratio >= 0.0) {
            cleaned_data.curb_stats.push(ghJSON_collection.curb_stats[i]);
        }
    }
    return cleaned_data;
}

let c = curb_statistic_collector(curb_json);
console.log(c.curb_stats.length);
let dc = data_cleaner(c);
console.log(dc.curb_stats.length);

let curb_analysis_string = JSON.stringify(dc, null, 4);
fs.writeFile('./SanDiego_LittleItaly_analysis.json', curb_analysis_string, (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log('File has been created');
});