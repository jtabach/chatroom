'use strict';

var app = angular.module('fireApp', ['firebase', 'ui.router']);

app.constant('fbUrl', 'https://firstangularfire.firebaseio.com/')

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {url: '/', templateUrl: '/html/home.html'})
		.state('user', {url: '/user', template: '<ui-view/>', abstract: true})
		.state('user.login', {url: '/login', templateUrl: '/html/user.html', controller: 'userCtrl'})
		.state('user.register', {url: '/register', templateUrl: '/html/user.html', controller: 'userCtrl'})

		.state('user.profile', {url: '/profile', templateUrl: '/html/profile.html', controller: 'profileCtrl',
			onEnter: function($state, fbAuth) {
				if (!fbAuth.$getAuth()) {
					$state.go('home'); 
				}
			}})
	
	$urlRouterProvider.otherwise('/');
})

app.filter('titlecase', function() {
	return function(value) {
		if(typeof value !== 'string') return value;
		return value[0].toUpperCase() + value.slice(1).toLowerCase();
	};
})

// Chat app

// User login/register/logout
// Edit profile
// Chat and see chats

// (onAuth and getAuth give user info and inside is the uid)

// tie the uid to a ref for user

// ref.child('profiles').child(uid)

// ref
// 	|
// 	|--> Chat
// 	|--> Profiles

// Chat will be a firebaseArray
// Profile will be a firebaseObject

// (Optional) -- getTotal firebase method

// Extending $firebaseObject (search in farebase api)