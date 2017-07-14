"use strict";

angular
  .module("psJwtApp")
  .controller("LogoutCtrl", function(authToken, $state) {
    console.log("AUTH_LOGOUT");
    authToken.removeToken();

    $state.go("main");
  });
