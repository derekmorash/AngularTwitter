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
