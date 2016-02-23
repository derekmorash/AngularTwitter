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
    when('/feed', {
      templateUrl: 'views/feed.html',
      controller: 'FeedController'
    }).
    otherwise({
      redirectTo: '/login'
    });
}]);

myApp.factory('Authentication',
  ['$rootScope', '$location', '$firebaseAuth', '$firebaseObject', 'FIREBASE_URL',
  function($rootScope, $location, $firebaseAuth, $firebaseObject, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    /*
     *  Check to see if a user is logged in
     */
    auth.$onAuth(function(authUser) {
      //if the user exists
      if(authUser) {
        //take the id of the user who logged in
        var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid);
        //get the object of their user info
        var userObj = $firebaseObject(userRef);

        $rootScope.currentUser = userObj;
      } else {
        $rootScope.currentUser = '';
      }
    }); //onAuth

    var myObject = {
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
          $location.path('/feed');
        }).catch(function(error) { //cath any errors (incorrect password)
          $rootScope.message = error.message;
        });// auth
      }, //login method

      /*
       *  Logout Method
       */
      logout: function() {
        return auth.$unauth();
      }, //logout method

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

          myObject.login(user);
        }).catch(function(error) { //catch any errors from firebase (email already registered)
          $rootScope.message = error.message;
        }); //auth.createUser()
      } //register method
    }; //myObject

    return myObject;
  }]); //factory

myApp.controller('FeedController', ['$scope', function($scope) {
  $scope.message = "Feed!!!";
}]);


// get all tweets
// if the tweet belongs to current user, add edit and delete buttons. Use onAuth from the authentication factory service

myApp.controller('RegistrationController',
  ['$scope', 'Authentication',
  function($scope, Authentication) {

  $scope.login = function() {
    //call the authenticaion factory login method
    Authentication.login($scope.user);
  }; //login

  $scope.logout = function() {
    //call the authenticaion factory logout method
    Authentication.logout();
  }; //logout

  $scope.register = function() {
    //call the authenticaion factory register method
    Authentication.register($scope.user);
  }; //register
}]); //contoller
