const treasureMap = treasureMap || {};

treasureMap.addInfoWindow = function(find, pin) {
  google.maps.event.addListener(pin, 'click', () => {
    if (typeof this.infoWindow != 'undefined') this.infoWindow.close();
    console.log();
    this.infoWindow = new google.maps.InfoWindow({
      content: `<img src="${find.imageURL}"><p>${find.objectType}</p><p>${find.lat}${find.lng}</p>`
    });
    this.infoWindow.open(this.map, pin);
    this.map.setCenter(pin.getPosition());
    this.map.panBy(0, -200);
  });
};

treasureMap.createFindPin = function(find) {
  let latLng = new google.maps.LatLng(find.lat, find.lng);
  let pin = new google.maps.Marker({
    position: latLng,
    map: this.map
  });
  this.addInfoWindow(find, pin);
};

treasureMap.loopThroughFinds = function(data) {
  console.log(data);
  $.each(data.finds, (index, find) => {
    treasureMap.createFindPin(find);
  });
};

treasureMap.getFinds = function() {
  $.get('http://localhost:3000/api/finds').done(this.loopThroughFinds);
  console.log(find.objectType);
};

treasureMap.mapSetup = function() {
  let mapArea = document.getElementById('map-canvas');

  let mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(mapArea, mapOptions);
  this.getFinds();
};

$(treasureMap.mapSetup.bind(treasureMap));
