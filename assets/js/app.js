var myApp = angular.module('myApp',
  ['ngRoute', 'firebase'])
  .constant('FIREBASE_URL', 'https://angulartwitter.firebaseio.com/');

myApp.run(['$rootScope', '$location',
  function($rootScope, $location) {
    $rootScope.$on('$routeChangeError',
      function(event, next, previous, error) {
        if(error == 'AUTH_REQUIRED') {
          $rootScope.message = 'Sorry, you must log in to access this page.';
          $location.path('/login');
        } //AUTH REQUIRED
      }); //event info
  }]); //run

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
    when('/feed', {
      templateUrl: 'views/feed.html',
      controller: 'TweetController'
    }).
    when('/user/:uId', {
      templateUrl: 'views/userFeed.html',
      controller: 'UserTweetsController'
    }).
    otherwise({
      redirectTo: '/login'
    });
}]);
