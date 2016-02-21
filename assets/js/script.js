var myApp = angular.module('myApp',
  ['ngRoute', 'firebase'])
  .constant('FIREBASE_URL', 'https://angulartwitter.firebaseio.com/');

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'RegistrationController'
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController'
    }).
    when('/success', {
      templateUrl: 'views/success.html',
      controller: 'SuccessController'
    }).
    otherwise({
      redirectTo: '/login'
    });
}]);

myApp.factory('Authentication', ['$rootScope', '$firebaseAuth', 'FIREBASE_URL',
  function($rootScope, $firebaseAuth, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    return {
      login: function(user) {
        $rootScope.message = "Logged in!!" + $scope.user.email;
      }, //login method

      register: function(user) {
        //create firebase user, pass it an object of user info
        auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function(regUser) { //callback promise from firebase
          $rootScope.message = "Hi " + user.firstname + ", thanks for registering";
        }).catch(function(error) { //catch any errors from firebase (ie. email already registered)
          $rootScope.message = error.message;
        }); //auth.createUser()
      } //register method
    }; //return
  }]); //factory

myApp.controller('RegistrationController',
  ['$scope', 'Authentication',
  function($scope, Authentication) {

  $scope.login = function() {
    //call the authenticaion factory login method
    Authentication.login($scope.user);
  }; //login

  $scope.register = function() {
    //call the authenticaion factory register method
    Authentication.register($scope.user);
  }; //register
}]); //contoller
