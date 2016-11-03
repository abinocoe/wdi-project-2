const treasureMap = treasureMap || {};

treasureMap.addInfoWindow = function(find, pin) {
  google.maps.event.addListener(pin, 'click', () => {
    if (typeof this.infoWindow != 'undefined') this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      content: `<img src="${find.imageURL}"><p>${find.objectType}</p><p>${find.broadPeriod}<p/>`
    });
    this.infoWindow.open(this.map, pin);
    this.map.setCenter(pin.getPosition());
    this.map.panBy(0, -200);
    this.$desc.html(`<p><h4>${find.objectType}</h4><br><h6>${find.broadPeriod}</h6><br>${find.description}</p>`);
    $('.widget-pane').addClass('thin');
  });
};

treasureMap.createFindPin = function(find) {
  let latLng = new google.maps.LatLng(find.lat, find.lng);
  let icon = {
    url: "./images/amphora.png",
    scaledSize: new google.maps.Size(25, 25),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0,0)
  };
  let pin = new google.maps.Marker({
    position: latLng,
    icon
    //map: this.map
  });
  this.markers.push(pin);
  this.addInfoWindow(find, pin);
};

treasureMap.loopThroughFinds = function(data) {
  $.each(data.finds, (index, find) => {
    this.createFindPin(find);
  });

  var options = {
    imagePath: 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m',
    maxZoom: 10
  };

  let markerCluster = new MarkerClusterer(this.map, this.markers, options);
};

treasureMap.getFinds = function() {
  // $.get('http://localhost:3000/api/finds').done(this.loopThroughFinds.bind(this));
  $.get('https://frozen-cliffs-13270.herokuapp.com/api/finds').done(this.loopThroughFinds.bind(this));
  console.log(find.objectType);
};

treasureMap.mapSetup = function() {
  let mapArea = document.getElementById('map-canvas');

  let mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(52.674905,-1.2164698),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"},{"color":"#716464"},{"weight":"0.01"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"simplified"},{"color":"#a05519"},{"saturation":"-13"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#84afa3"},{"lightness":52}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"visibility":"on"}]}]
  };

  this.map = new google.maps.Map(mapArea, mapOptions);
};

treasureMap.loggedInState = function(){
  $(".loggedOut").hide();
  $(".loggedIn").show();
  this.getFinds();
};

treasureMap.loggedOutState = function(){
  $(".loggedOut").show();
  $(".loggedIn").hide();
  $(".login").trigger("click");
};

treasureMap.setRequestHeader = function(xhr, settings) {
  return xhr.setRequestHeader("Authorization", `Bearer ${this.getToken()}`);
};

treasureMap.setToken = function(token){
  return window.localStorage.setItem("token", token);
};

treasureMap.getToken = function(){
  return window.localStorage.getItem("token");
};

treasureMap.removeToken = function(){
  return window.localStorage.clear();
};

treasureMap.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

treasureMap.handleForm = function(){
  event.preventDefault();

  let url    = `${treasureMap.apiUrl}${$(this).attr("action")}`;
  let method = $(this).attr("method");
  let data   = $(this).serialize();
  $('.modal').modal('toggle');

  return treasureMap.ajaxRequest(url, method, data, (data) => {
    if (data.token) treasureMap.setToken(data.token);
    treasureMap.loggedInState();
  });
};

treasureMap.sidebar = function() {
  $('.widget-pane').toggleClass('thin');
};

treasureMap.logout = function() {
  event.preventDefault();
  this.removeToken();
  this.loggedOutState();
};


treasureMap.login = function() {
  //if (event) event.preventDefault();
  this.$forms.html(`
    <div id="loginModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" id="my-modal">
    <div class="modal-dialog modal-sm">
    <div class="modal-content">
    <h4 class="modal-title">Login<h4>
    <form action="/login" method="post">
    <input type="text" id="email" name="email" placeholder="Email"><br>
    <input type="password" id="password" name="password" placeholder="Password"><br>
    <input class="enter" type="submit" value="Sign In">
    </form>
    </div>
    </div>
    </div>
    `);
  };

  treasureMap.register = function() {
    if (event) event.preventDefault();

    this.$forms.html(`
      <div id="registerModal" class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" id="my-modal">
      <div class="modal-dialog modal-sm">
      <div class="modal-content">
      <h4 class="modal-title">Register<h4>
      <form action="/register" method="post">
      <input type="text" id="username" name="user[username]"  placeholder="Username"><br>
      <input type="text" id="email" name="user[email]" placeholder="Email"><br>
      <input type="password" id="password" name="user[password]"  placeholder="Password"><br>
      <input type="password" id="password" name="user[passwordConfirmation]"  placeholder="Confirm Password"><br>
      <input class="enter" type="submit" value="Save">
      </form>
      </div>
      </div>
      </div>
      `);
    };

    treasureMap.init = function() {
      // this.apiUrl  = "http://localhost:3000/api";
      this.apiUrl  = "https://frozen-cliffs-13270.herokuapp.com/api";
      this.$forms  = $(".forms");
      this.$main   = $("main");
      this.markers = [];
      this.$desc   = $("#description-content");

      this.login.bind(this);
      this.mapSetup();

      $(".register").on("click", this.register.bind(this));
      $(".login").on("click", this.login.bind(this));
      $(".logout").on("click", this.logout.bind(this));
      $(".toggle").on("click", this.sidebar.bind(this));
      this.$forms.on("submit", "form", this.handleForm);


      if (this.getToken()) {
        this.loggedInState();
      } else {
        this.loggedOutState();
      }

    };

    $(treasureMap.init.bind(treasureMap));
