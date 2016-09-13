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
};

treasureMap.loggedInState = function(){
  $(".loggedOut").hide();
  $(".loggedIn").show();
  this.getFinds();
};

treasureMap.loggedOutState = function(){
  $(".loggedOut").show();
  $(".loggedIn").hide();
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

  return treasureMap.ajaxRequest(url, method, data, (data) => {
    if (data.token) treasureMap.setToken(data.token);
    treasureMap.loggedInState();
  });
};

treasureMap.logout = function() {
  event.preventDefault();
  this.removeToken();
  this.loggedOutState();
};


treasureMap.login = function() {
  if (event) event.preventDefault();

  this.$forms.html(`
    <div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" id="my-modal">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <form action="/login" method="post">
          <input type="text" id="email" name="email" placeholder="Email">
          <input type="password" id="password" name="password" placeholder="Password">
          <input type="submit" value="Signin">
          </form>
        </div>
      </div>
    </div>
    `);
  };

  treasureMap.register = function() {
    if (event) event.preventDefault();

    this.$forms.html(`
<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <form action="/register" method="post">
        <input type="text" id="username" name="user[username]"  placeholder="Username">
        <input type="text" id="email" name="user[email]" placeholder="Email">
        <input type="password" id="password" name="user[password]"  placeholder="Password">
        <input type="password" id="password" name="user[passwordConfirmation]"  placeholder="Confirm Password">
        <input type="submit" value="Register">
      </form>
    </div>
  </div>
</div>
      `);
    };

    treasureMap.init = function() {
      this.mapSetup();
      this.apiUrl = "http://localhost:3000/api";
      this.$forms = $(".forms");
      this.$main  = $("main");

      $(".register").on("click", this.register.bind(this));
      $(".login").on("click", this.login.bind(this));
      $(".logout").on("click", this.logout.bind(this));
      this.$forms.on("submit", "form", this.handleForm);

      if (this.getToken()) {
        this.loggedInState();
      } else {
        this.loggedOutState();
      }

    };

    $(treasureMap.init.bind(treasureMap));
