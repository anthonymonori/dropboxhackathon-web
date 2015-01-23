'use strict';

angular.module('dropboxreports', [
	'ngRoute',
	'myApp.controllers',
	'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
	$routeProvider.
		otherwise({
			redirectTo: '/'
		});

	  $locationProvider.html5Mode(true);
});
