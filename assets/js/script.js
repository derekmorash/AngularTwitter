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

myApp.factory('Authentication', ['$rootScope', '$location', '$firebaseAuth', 'FIREBASE_URL',
  function($rootScope, $location, $firebaseAuth, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    return {
      /*
       *  Login Method
       *  Takes user input of email and password
       */
      login: function(user) {
        //pass the users login info to firebase
        auth.$authWithPassword({
          email:    user.email,
          password: user.password
        }).then(function(regUser) { //firebase callback promis
          $location.path('/success');
        }).catch(function(error) { //cath any errors (incorrect password)
          $rootScope.message = error.message;
        });// auth
      }, //login method

      /*
       *  Register Method
       *  Takes user input info
       */
      register: function(user) {
        //create firebase user, pass it an object of user info
        auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function(regUser) { //callback promise from firebase

          //when the user is register, store their info as an object
          var regRef = new Firebase(FIREBASE_URL + 'users')
            .child(regUser.uid).set({
              date:      Firebase.ServerValue.TIMESTAMP,
              regUser:   regUser.uid,
              firstname: user.firstname,
              lastname:  user.lastname,
              email:     user.email
            }); //user info

          $rootScope.message = "Hi " + user.firstname + ", thanks for registering";
        }).catch(function(error) { //catch any errors from firebase (email already registered)
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
