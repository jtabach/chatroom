app.factory('fbRef', function($window) {
	return new $window.Firebase('https://firstangularfire.firebaseio.com/');
});

app.factory('List', function(fbRef, $firebaseArray) {
	var listRef = fbRef.child('list');
	return $firebaseArray(listRef);
});

app.factory('fbAuth', function(fbRef, $firebaseAuth) {
	return $firebaseAuth(fbRef);
});

app.factory('User', function(fbRef, $firebaseObject) {
	var userRef = fbRef.child('user');
	return $firebaseObject(userRef);
});

app.factory('Profile', function(fbRef, $firebaseObject) {
	return function(uid) {
		var ref = fbRef.child('profiles').child(uid);
		return $firebaseObject(ref);
	}
});	

app.service('Auth', function(fbAuth) {

	this.register = function(userObj) {
		return fbAuth.$createUser(userObj)
		.then(function(userData) {
			console.log("User " + userData.uid + " created successfully");
			return fbAuth.$authWithPassword(userObj);
		});
	};

	this.login = function(userObj) {
		return fbAuth.$authWithPassword(userObj);
	};

	this.logout = function() {
		return fbAuth.$unauth();
	}


}) 