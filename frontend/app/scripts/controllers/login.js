"use strict";

angular
  .module("psJwtApp")
  .controller("LoginCtrl", function($scope, auth, alert) {
    $scope.submit = function() {
      auth
        .login($scope.email, $scope.password)
        .then(function(data) {
          alert(
            "success",
            "Welcome",
            `Thanks for coming back ${data.user.email}!`
          );
        })
        .catch(handleError);
    };
    $scope.google = function() {
      auth
        .googleAuth()
        .then(function(data) {
          alert(
            "success",
            "Welcome",
            "Thanks for coming back " + data.user.displayName + "!"
          );
        })
        .catch(handleError);
    };

    function handleError(data) {
      alert("warning", "Something went wrong :(", data.message);
    }
  });
