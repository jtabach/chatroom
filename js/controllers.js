app.controller('mainCtrl', function($scope, List, User) {

	$scope.list = List;

	// $scope.user = User;
	User.$bindTo($scope, 'user');

	$scope.add = function(desc) {
		$scope.list.$add({
			desc: desc,
			complete: false
		});

		$scope.desc="";
	}

});

//Auth.login({username: , password: })
//Auth.register({username: , password: })

app.controller('profileCtrl', function() {
	console.log('profile');
})

app.controller('navCtrl', function($scope, $state, Auth, fbAuth) {

	fbAuth.$onAuth(function(authData) {
		console.log('authData:', authData);
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
			.then(function(authData) {
				$state.go('home');
			})
			.catch(function() {
				resetForm();
				alert('Invalid email or password');
			});
		} else {
			if ($scope.user.password !== $scope.user.password2) {
				resetForm();
				return alert('Passwords do not match');
			} else {
				Auth.register({
					email: $scope.user.email,
					password: $scope.user.password
				})
				.then(function(authData) {
					console.log('authData:', authData);
					$state.go('home');
				})
				.catch(function(err) {
					resetForm();
					alert('Email already exists');
					console.log('err:', err);
				});
			}
		}

		function redirectHome() {

		}

		function resetForm() {
			$scope.user.email = '';
			$scope.user.password = '';
			$scope.user.password2 = '';
		}
	}

})