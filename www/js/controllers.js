angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $cordovaOauth, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
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

  // Open the login modal
  $rootScope.login = function() {
    $scope.modal.show();
  };

  // $scope.on('redirectToLoginPage', function(event, data) {
  //   $scope.login();
  // });

  $scope.loginFB = function () {
    $cordovaOauth.facebook(1185817128161808, ["email", "public_profile"]).then(function (result) {
      $localStorage.accessToken = result.access_token;
      // $location.path("/app/playlists");
    }, function (error) {
      alert(error);
      console.log(error);
    });
  };

  $scope.logout = function () {
    delete $localStorage.accessToken;
    $scope.login();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $rootScope, $stateParams, $http, $localStorage) {
  // $scope.loginPage = LoginPage;

  $scope.init = function () {
    if ($localStorage.hasOwnProperty("accessToken") === true) {
      $http.get("https://graph.facebook.com/v2.8/me", {
        params: {
          access_token: $localStorage.accessToken,
          fields: "id, cover, name, first_name, last_name, age_range, link, gender, locale, picture, timezone, updated_time, verified, email",
          format: "json"
        }
      }).then(function (result) {
        $scope.profileData = result.data;
      }, function (error) {
        alert("There was a problem getting your profile.");
        console.log(error);
      });
    } else {
        alert("Not loged in!");
        // $scope.$emit('redirectToLoginPage', '');
      // $rootScope.login();
    }
  };

});

// .service('LoginPage', function() {
//   return {};
// });



