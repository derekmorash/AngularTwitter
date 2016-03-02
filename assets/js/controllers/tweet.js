myApp.controller('TweetController',
  ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
  function($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);


    auth.$onAuth(function(authUser) {
      if(authUser) {
        //create a reference to where the tweets will be stored
        var tweetsRef = new Firebase(FIREBASE_URL + 'tweets/');
        var tweetInfo = $firebaseArray(tweetsRef);

        $scope.tweets = tweetInfo;
        console.log($scope.tweets);

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

        $scope.deleteTweet = function(key) {
          tweetInfo.$remove(key);
        };
      } //if there is an authenticated user
    }); //onAuth
  }]) //FeedController

.directive('tweet', function() {
  return {
    // restrict: 'E',
    templateUrl: 'views/tweet.html'
  };
});


// get all tweets
// if the tweet belongs to current user, add edit and delete buttons. Use onAuth from the authentication factory service


//DELETE button
