"use strict";

angular
  .module("psJwtApp")
  .controller("LoginCtrl", function($scope, auth, alert, $auth) {
    $scope.submit = function() {
      $auth
        .login({ email: $scope.email, password: $scope.password })
        .then(function(res) {
          alert(
            "success",
            "Welcome",
            `Thanks for coming back ${res.data.user.email}!`
          );
        })
        .catch(handleError);
    };
    $scope.authenticate = function(provider) {
      $auth
        .authenticate(provider)
        .then(function(res) {
          // console.log("DATA", data);
          alert(
            "success",
            "Welcome",
            "Thanks for coming back " + res.data.user.displayName + "!"
          );
        })
        .catch(handleError);
    };

    function handleError(data) {
      alert("warning", "Something went wrong :(", data.message);
    }
  });
