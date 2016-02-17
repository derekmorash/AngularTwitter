var myApp = angular.module('myApp', ['ngRoute']);

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

myApp.controller('RegistrationController', ['$scope', function($scope) {

  $scope.login = function() {
    $scope.message = "Logged in!!" + $scope.user.email;
  }

  $scope.register = function() {
    $scope.message = "Registered!!" + $scope.user.firstname;
  }
}]);
