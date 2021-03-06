myApp.controller('TweetController',
['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
function($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseAuth(ref);

  //fetch list of all tweets
  ref.child('tweets').on('value', function(snapshot) {
    //init an array to hold the tweets
    var tweetFeed = [];
    //loop through the list of tweets
    snapshot.forEach(function(childSnapshot) {
      //store the userID for each tweet
      var nextTweet = childSnapshot;
      //get the user based on the userID
      ref.child('users/' + nextTweet.val().userID).once('value', function(snapshot) {
        //join the tweet and the user
        var singleTweet = {
          userID: snapshot.key(),
          user: snapshot.val().firstname,
          tweet: nextTweet.val().tweet,
          tweetKey: nextTweet.key(),
          date: nextTweet.val().date
        };
        //add the data to the array we initialized
        tweetFeed.push(singleTweet);
      });
    });
    console.log(tweetFeed);
    $scope.tweetFeed = tweetFeed;
  });


  auth.$onAuth(function(authUser) {
    if(authUser) {
      //create a reference to where the tweets will be stored
      var userRef = new Firebase(FIREBASE_URL + 'users/');
      var userInfo = $firebaseArray(userRef);

      var tweetsRef = new Firebase(FIREBASE_URL + 'tweets/');
      var tweetsInfo = $firebaseArray(tweetsRef);






      //when the addTweet form is submitted
      $scope.addTweet = function() {

        //gather the tweet info
        tweetsInfo.$add({
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
  }; //return
}); //directive
