myApp.controller('RegistrationController', ['$scope', function($scope) {

  $scope.login = function() {
    $scope.message = "Logged in!!" + $scope.user.email;
  }

  $scope.register = function() {
    $scope.message = "Registered!!" + $scope.user.firstname;
  }
}]);
