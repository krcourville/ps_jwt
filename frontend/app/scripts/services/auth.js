"use strict";

angular
  .module("psJwtApp")
  .service("auth", function($http, API_URL, authToken, $state, $window, $q) {
    this.login = function(email, password) {
      return $http
        .post(API_URL + "login", { email, password })
        .then(authSuccessful);
    };

    this.register = function(email, password) {
      return $http
        .post(API_URL + "register", {
          email,
          password,
        })
        .then(authSuccessful);
    };

    var clientId =
      "107784561122-cc7a13aifqmg94dqdemfv975kvu89qho.apps.googleusercontent.com";
    var urlBuilder = [
      "response_type=code",
      "client_id=" + clientId,
      "redirect_uri=" + window.location.origin,
      "scope=profile email",
    ];

    this.googleAuth = function() {
      var deferred = $q.defer();
      var url =
        "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join("&");
      var left = ($window.outerWidth - 500) / 2;
      var top = ($window.outerHeight - 500) / 2.5;
      var options = `width=500, height=500, left=${left}, top=${top}`;
      var popup = $window.open(url, "", options);
      $window.focus();

      function onMessage(event) {
        if (event.origin === $window.location.origin) {
          var code = event.data;
          $window.removeEventListener("message", onMessage);
          popup.close();

          $http
            .post(API_URL + "auth/google", {
              code,
              clientId,
              redirectUri: window.location.origin,
            })
            .then(function(res) {
              authSuccessful(res);
              deferred.resolve(res.data);
            });
        }
      }

      var listener = $window.addEventListener("message", onMessage);

      return deferred.promise;
    };

    function authSuccessful(res) {
      const { data } = res;
      authToken.setToken(data.token);
      return $state.go("main").then(() => data);
    }
  });
