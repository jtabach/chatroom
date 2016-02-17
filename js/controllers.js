app.controller('mainCtrl', function($scope, List, User) {

	$scope.list = List;

	$scope.user = User;
	// User.$bindTo($scope, 'user');

	$scope.add = function(desc) {
		$scope.list.$add({
			desc: desc,
			complete: false
		});

		$scope.desc="";
	}

});

app.controller('chatCtrl', function($scope, Auth, fbAuth, Profile, Chat) {
	$scope.userInfo = fbAuth.$getAuth();
	$scope.profile = Profile($scope.userInfo.uid);
	console.log($scope.profile);
	$scope.chat = Chat();
	$scope.message = {};
	$scope.addMessage = () => {
		console.log('add');
		if (!$scope.profile.username) 
				return alert('Please update your profile before chatting');
		$scope.message = {
			username: $scope.profile.username,
			time: Date(),
			body: $scope.chat.body
		}
		$scope.chat.$add($scope.message);
		$scope.chat.body ='';
	}

	console.log($scope.chat);
})

app.controller('profileCtrl', function($scope, Auth, fbAuth, Profile) {
	$scope.userInfo = fbAuth.$getAuth();
	$scope.profile = Profile($scope.userInfo.uid);
	$scope.editing = false;

	$scope.editProfile = () => {
		$scope.editing = true;
	}

	$scope.saveProfile = () => {
		$scope.editing = false;
		$scope.profile.$save();
	}
	
	$scope.profile.email = $scope.userInfo.password.email || null;
	if(!$scope.profile.username) $scope.profile.username = 'Guest';
	if(!$scope.profile.name) $scope.profile.name = 'Not Set';

	// $scope.profile.$save();
	// console.log('user info:', $scope.profile);
})

app.controller('navCtrl', function($scope, $state, Auth, fbAuth) {

	fbAuth.$onAuth(function(authData) {
		// console.log('authData:', authData);
		$scope.authData = authData;
	});

	$scope.logout = function() {
		Auth.logout();
		$state.go('home');
	}

});

app.controller('userCtrl', function($scope, $state, Auth) {

	$scope.state = $state.current.name.split('.')[1];

	console.log('user controlelr');
	console.log('$state.current:', $state.current);

	$scope.submit = function() {
		console.log($scope.user);
		console.log($scope.state);

		// 1. check what the state is
		// 	if register, check if two passwords match

		if ($scope.state === 'login') {
			Auth.login($scope.user)
			.then(redirectHome, invalidLogin)
		} else {
			if ($scope.user.password !== $scope.user.password2) {
				resetForm();
				return alert('Passwords do not match');
			} else {
				Auth.register({
					email: $scope.user.email,
					password: $scope.user.password
				})
				.then(redirectHome)
				.catch(existingUser);
			}
		}

		function redirectHome(authData) {
			console.log('authData:', authData);
			$state.go('home');
		}

		function invalidLogin(authData) {
			invalidEntry(authData, 'Invalid email or password')
		}

		function existingUser(authData) {
			invalidEntry(authData, 'Email already exists')
		}

		function invalidEntry(err, message) {
			resetForm();
			alert(message);
			console.log('err:', err)
		}

		function resetForm() {
			$scope.user.email = '';
			$scope.user.password = '';
			$scope.user.password2 = '';
		}
	}

})