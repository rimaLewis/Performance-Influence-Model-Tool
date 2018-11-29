import angular from 'angular';
import { readCsvDataComponent} from './readCsvData.component';
import 'angularjs-color-picker';
import 'angular-messages';
import 'angularjs-color-picker/dist/angularjs-color-picker.css';
import readCsvDataController from './readCsvData.controller';
import ngRoute from 'angular-route';

import './readCsvData.css';

const readCsvData = angular
	.module('readCsvData', ['color.picker','ngMaterial','ngMessages','ngRoute'])
	.component('readcsvdata', readCsvDataComponent)
	.controller('readCsvDataController',readCsvDataController)
	.directive('fileReader', function() {
		return {
			scope: {
				fileReader:'='
			},
			link: function(scope, element) {
				$(element).on('change', function(changeEvent) {
					var files = changeEvent.target.files;
					if (files.length) {
						var r = new FileReader();
						r.onload = function(e) {
							var contents = e.target.result;
							scope.$apply(function () {
								scope.fileReader = contents;
								scope.testing = contents;
							});
						};

						r.readAsText(files[0]);
					}
				});
			}
		};
	})
	.config(function ($routeProvider, $locationProvider) {
		// configure the routing rules here
		$routeProvider.when('/:id/:selectedIndex', {
			controller: 'readCsvDataController'
		});

		// enable HTML5mode to disable hashbang urls
		$locationProvider.html5Mode(true);
	})
	.name;

export default readCsvData;