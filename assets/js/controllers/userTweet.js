myApp.controller('UserTweetsController',
['$scope', '$rootScope', '$routeParams', '$firebaseArray', 'FIREBASE_URL',
function($scope, $rootScope, $routeParams, $firebaseArray, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var userPageId = $routeParams.uId;

  //get the user name
  ref.child('users/' + $routeParams.uId).once('value', function(snapshot) {
    $scope.userName = snapshot.val().firstname;
  });

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

        if(snapshot.key() === userPageId) {
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
        }

      });
    });
    $scope.tweetFeed = tweetFeed;
  });

}]); //FeedController
