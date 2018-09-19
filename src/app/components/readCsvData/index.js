import angular from 'angular';
import { readCsvDataComponent} from './readCsvData.component';
import 'angularjs-color-picker';
import 'angularjs-color-picker/dist/angularjs-color-picker.css';
import './readCsvData.css';

const readCsvData = angular
	.module('readCsvData', ['color.picker'])
	.component('readcsvdata', readCsvDataComponent)
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
	.name;

export default readCsvData;