"use strict";

angular
  .module("psJwtApp")
  .controller("RegisterCtrl", function($scope, alert, $auth) {
    Object.assign($scope, {
      email: "me@somewhere.com",
      password: "111",
      password_confirmation: null,
    });

    $scope.submit = function() {
      $auth
        .signup({
          email: $scope.email,
          password: $scope.password,
        })
        .then(function(res) {
          alert(
            "success",
            "Account Created!",
            `Welcome, ${res.data.user.email}!`
          );
        })
        .catch(function(res) {
          console.error("REGISTER", res);
          const { data } = res;
          alert("warning", "Something went wrong :(", data.message);
        });
    };
  });
