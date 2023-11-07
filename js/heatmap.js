let map = L.map('map').setView([41.3394606113,2.1447694302], 12)

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})

osm.addTo(map)

let coordinates=[];

async function loadFromCSV() {
  const response = await fetch("http://localhost:3000/csv");
  const fcsv = await response.json(); 
  const obj = eval(fcsv);
  
  //console.log(obj);
  
  obj.forEach((data) => 
  {
	let trama = data["data.trama"];
	let lon = trama.split(";")[4];
	let lat = trama.split(";")[5];
	//${data.user} 
	//${data.date}
	//${data.type} 
	//${data["data.trama"]}
	
	coordinates.push( {x: lat, y: lon , date: data.date } ); 
	
  });
  
  // Create an array of GeoJSON features
	const features = coordinates.map(coord => ({
	  type: 'Feature',
	  geometry: {
		type: 'Point',
		coordinates: [coord.x, coord.y],
	  },
	  properties: {
		name: 'Marker',
		area:40,
		date: coord.date
	  },
	}));

	// Create a GeoJSON object
	const geojsonObject = {
	  type: 'FeatureCollection',
	  features: features,
	};
	
	addGeoJson(geojsonObject)
  
}

async function addGeoJson(datas) {
  const heatData = datas.features.map(heatDataConvert)
  const heatMap = L.heatLayer(heatData, { radius: 10 })
  heatMap.addTo(map)
  //const markers = L.geoJson(datas)
  //markers.addTo(map)
}

function heatDataConvert(feature) {
  return [
    feature.geometry.coordinates[1],
    feature.geometry.coordinates[0],
    feature.properties.area,
  ]
}

// default map settings
function centerMap() {
  map.setView([41.3394606113,2.1447694302], 12)
}

loadFromCSV()
