myApp.controller('FeedController', ['$scope', function($scope) {
  $scope.message = "Feed!!!";
}]);


// get all tweets
// if the tweet belongs to current user, add edit and delete buttons. Use onAuth from the authentication factory service
