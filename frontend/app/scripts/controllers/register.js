"use strict";

angular
  .module("psJwtApp")
  .controller("RegisterCtrl", function($scope, alert, auth) {
    Object.assign($scope, {
      email: "me@somewhere.com",
      password: "111",
      password_confirmation: null,
    });

    $scope.submit = function() {
      auth
        .register($scope.email, $scope.password)
        .then(function(data) {
          alert("success", "Account Created!", `Welcome, ${data.user.email}!`);
        })
        .catch(function(res) {
          console.error("REGISTER", res);
          const { data } = res;
          alert("warning", "Something went wrong :(", data.message);
        });
    };
  });
