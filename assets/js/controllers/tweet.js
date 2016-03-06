myApp.controller('TweetController',
['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
function($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseAuth(ref);


  auth.$onAuth(function(authUser) {
    if(authUser) {
      //create a reference to where the tweets will be stored
      var userRef = new Firebase(FIREBASE_URL + 'users/');
      var userInfo = $firebaseArray(userRef);

      var tweetsRef = new Firebase(FIREBASE_URL + 'tweets/');
      var tweetsInfo = $firebaseArray(tweetsRef);



      //fetch list of all tweets
      tweetsRef.on('value', function(snapshot) {
        //init an array to hold the tweets
        var tweetFeed = [];
        //loop through the list of tweets
        snapshot.forEach(function(childSnapshot) {
          //store the userID for each tweet
          var nextTweet = childSnapshot.val();

          //get the user based on the userID
          userRef.child(nextTweet.userID).once('value', function(snapshot) {
            //join the tweet and the user
            var singleTweet = {
              user: snapshot.val().firstname,
              tweet: nextTweet.tweet,
              date: nextTweet.date
            };
            //add the data to the array we initialized
            tweetFeed.push(singleTweet);
          });
        });
        console.log(tweetFeed);
        $scope.tweetFeed = tweetFeed;
      });

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
    controller: function() {

    } //controller
  }; //return
}); //directive


// get all tweets
// if the tweet belongs to current user, add edit and delete buttons. Use onAuth from the authentication factory service
