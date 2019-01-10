const fetch = require('node-fetch');
const fs = require('fs');

var satID = [41328, 41019, 40730, 40534, 40294, 40105, 39741, 39533, 39166, 38833, 37753, 36585, 35752, 32711, 32384, 32260, 29601, 29486, 28874, 28474, 28361, 28190, 28129, 27704, 27663, 26605, 26407, 26360, 25933, 24876, 22877, 43567, 43566, 43565, 43564, 43058, 43057, 43056, 43055, 41862, 41861, 41860, 41859, 41550, 41549, 41175, 41174, 40890, 40889, 40545, 40544, 40129, 40128, 38858, 38857, 37847, 37846, 43508, 41554, 41330, 40315, 40001, 39620, 39155, 37938, 37869, 37868, 37867, 37829, 37372, 37139, 37138, 37137, 36402, 36401, 36400, 36113, 36112, 36111, 33468, 33467, 33466, 33380, 33379, 33378, 32395, 32394, 32393, 32277, 32276, 32275, 29672, 29671, 29670, 28917, 28916, 28915, 28510, 28509, 28508, 28114, 28113, 28112, 27619, 27618, 27617, 26989, 26988, 26987, 26566, 26565, 26564, 25595, 25594, 25593, 23736, 23735, 23734, 23622, 23621, 23620, 23513, 23512, 23511, 23398, 23397, 23396, 23205, 23204, 23203, 23045, 23044, 23043, 22514, 22513, 22512, 22058, 22057, 22056, 21855, 21854, 21853, 21218, 21217, 21216, 21008, 21007, 21006, 20621, 20620, 20619, 20026, 20025, 20024, 19751, 19750, 19749, 19503, 19502, 19501, 19165, 19164, 19163, 18357, 18356, 18355, 16963, 16962, 16961, 16398, 16397, 16396, 15699, 15698, 15697, 15261, 15260, 15259, 14979, 14978, 14977, 14592, 14591, 14590, 14260, 14259, 14258, 13607, 13606, 13603, 43648, 43647, 43603, 43602, 43582, 43581, 43539, 43246, 43245, 43208, 43207, 43108, 43107, 43002, 43001, 41434, 41315, 40938, 40749, 40748, 40549, 38953, 38775, 38774, 38251, 38250, 38091, 37948, 37763, 37384, 37256, 37210, 36828, 36590, 36287, 34779, 31115, 30323, 27813, 26643, 26599, 43286, 42928, 41469, 41384, 41241, 40547, 40269, 39635, 39199, 42965, 42917, 42738, 37158];

var timer = function() {
    async function jsonParse (satellite) {
        const res = await fetch(`https://www.n2yo.com/rest/v1/satellite/positions/${satID[satellite]}/52.070499/4.300700/0/1/&apiKey=`);
        
        const json = await res.json();
        const location = json.positions[0].satlatitude+","+json.positions[0].satlongitude;
        const satInfo = {
            "type": "Feature",
            "properties": {
                "name": json.info.satname,
                "ID": satID[satellite],
                "iconSize": [100, 100],
            },
            "geometry": {
                "type": "Point",
                "coordinates": [json.positions[0].satlongitude+","+json.positions[0].satlatitude],
            }
        }

        const parsed = JSON.stringify(satInfo);


        const meta = await fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?size=600x300&location=${location}&pitch=90&key=`)
        const metadata = await meta.json();

        let foundSats;
        
        if(metadata.status === "ZERO_RESULTS"){ 
            return;
        } else {
            const timestamp = Math.floor(new Date() / 1000);
            foundSats = location;
            console.log(foundSats);

            const sky = await fetch(`https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${foundSats}&pitch=90&key=`);
            const skyDest = fs.createWriteStream(`sky/${timestamp}.jpg`);
            const land = await fetch(`https://maps.googleapis.com/maps/api/staticmap?center=${foundSats}&zoom=20&size=640x640&maptype=satellite&key=`);
            const landDest = fs.createWriteStream(`land/${timestamp}.jpg`);

            sky.body.pipe(skyDest);
            land.body.pipe(landDest);
            // console.log("IMAGE FOUND! " + satName )
            return;
        };
    };

    for(var i = 0; i < satID.length; i++){
        jsonParse(i);
    }
};

setInterval(timer, 7000)
