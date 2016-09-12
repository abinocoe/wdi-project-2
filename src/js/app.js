const treasureMap = treasureMap || {};

treasureMap.mapSetup = function() {
  let mapArea = document.getElementById('map-canvas');

  let mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(mapArea, mapOptions);
};

$(treasureMap.mapSetup.bind(treasureMap));

console.log($);
console.log(google);
