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
      controller: 'TweetController',
      resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        }
      } //resolve
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
       * Authentication is required
       */
      requireAuth: function() {
        return auth.$requireAuth();
      }, //requireAuth

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

myApp.controller('TweetController',
['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
function($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseAuth(ref);


  auth.$onAuth(function(authUser) {
    if(authUser) {
      //create a reference to where the tweets will be stored
      var tweetsRef = new Firebase(FIREBASE_URL + 'tweets/');
      var usersRef = new Firebase(FIREBASE_URL + 'users/');
      var tweetInfo = $firebaseArray(tweetsRef);
      var usersInfo = $firebaseArray(usersRef);

      console.log(tweetInfo);

      $scope.tweets = [];

      tweetsRef.on("value", function(snapshot) {
        snapshot.forEach(function(child) {
          console.log(child.val());
          $scope.tweets.push(child.val());
        });
      });

      // $scope.tweets = tweetInfo;
      $scope.users = usersInfo;

      //when the addTweet form is submitted
      $scope.addTweet = function() {
        //gather the tweet info
        tweetInfo.$add({
          userID: $rootScope.currentUser.$id,
          tweet: $scope.tweet,
          date: Firebase.ServerValue.TIMESTAMP
        }).then(function() { //promise from firebase when the tweet is added
          $scope.tweet = '';
        }); //promise
      }; //addTweet

      //delteing tweets
      $scope.deleteTweet = function(key) {
        //only delete a tweet if the tweet belongs to the logged in user
        if($rootScope.currentUser.$id === tweetInfo[key].userID) {
          tweetInfo.$remove(key);
        }
      };
    } //if there is an authenticated user
  }); //onAuth
}]) //FeedController

.directive('tweet', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/tweet.html',
    controller: function() {

    } //controller
  }; //return
}); //directive


// get all tweets
// if the tweet belongs to current user, add edit and delete buttons. Use onAuth from the authentication factory service
