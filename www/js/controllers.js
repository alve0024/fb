angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $cordovaOauth, $timeout, $localStorage, $location){

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });


  // Triggered in the login modal to close it 
  $scope.closeLogin = function() { 
    $scope.modal.hide(); 
  };

  $scope.$on('openLogin', function(){
    // alert("Called the event openLogin");
    $scope.login();
  });

  // Open the login modal 
  $scope.login = function() { 
    // alert("You called login");
    $scope.modal.show(); 
  };


  $scope.loginFB = function () {
    $cordovaOauth.facebook(1185817128161808, ["email", "public_profile"]).then(function (result) {
      $localStorage.accessToken = result.access_token;
      $location.path("/app/playlists");
    }, function (error) {
      alert(error);
      console.log(error);
    });
  };

  $scope.logout = function () { 
    delete $localStorage.accessToken; 
    $scope.login(); 
  };
})

.controller('PlaylistsCtrl', ['$scope', '$stateParams', '$http', '$localStorage',
  function($scope, $stateParams, $http, $localStorage, $location) {
    $scope.init = function () {
      if ($localStorage.hasOwnProperty("accessToken") === true) {
        $http.get("https://graph.facebook.com/v2.8/me", {
          params: {
            access_token: $localStorage.accessToken,
            fields: "id, cover, name, first_name, last_name, age_range, link, gender, locale, picture, timezone, updated_time, verified, email",
            format: "json"
          }
        }).then(function (result) {
          alert("You are logged in!");
          $scope.profileData = result.data;
          $location.path('/app/playlists');
        }, function (error) {
          alert("There was a problem getting your profile.");
          console.log(error);
        });
      } else {
        alert("You are not logged in!");
        $scope.$emit('openLogin', []);
      }
    };
}]);





