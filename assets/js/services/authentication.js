myApp.factory('Authentication', ['$rootScope', '$firebaseAuth', 'FIREBASE_URL',
  function($rootScope, $firebaseAuth, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    return {
      login: function(user) {
        $rootScope.message = "Logged in!!" + $scope.user.email;
      }, //login method

      register: function(user) {
        //create firebase user, pass it an object of user info
        auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function(regUser) { //callback promise from firebase
          $rootScope.message = "Hi " + user.firstname + ", thanks for registering";
        }).catch(function(error) { //catch any errors from firebase (ie. email already registered)
          $rootScope.message = error.message;
        }); //auth.createUser()
      } //register method
    }; //return
  }]); //factory
