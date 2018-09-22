import '../../node_modules/bootstrap-css-only/css/bootstrap.min.css';
import '../style/style.css';
import '../../node_modules/bootswatch/dist/lux/bootstrap.min.css';

import '../../node_modules/angular/angular';
import '../../node_modules/angular-aria/angular-aria';
import '../../node_modules/angular-animate/angular-animate';
import '../../node_modules/angular-messages/angular-messages';
import '../../node_modules/angular-material/angular-material';
import '../../node_modules/angular-material/angular-material.min.css';
import '../../node_modules/angular-sanitize/angular-sanitize';


import angular from 'angular';
import 'angular-animate';
import 'angular-toastr';
import 'angularjs-color-picker';

import uiRouter from 'angular-ui-router';
import common from './common/common';
import components from './components/components';
import { AppComponent } from './app.component';
import  angularMaterial from 'angular-material';
import normalizedValuesService from './app.service';
import D3Service from './d3.service';
import colorsService from './colors.service';
// import Highcharts from './highcharts';


const root = angular
  .module('angularApp', [
	'ngAnimate',
	'toastr',
	'ngMaterial',
	uiRouter,
	angularMaterial,
	common,
	components,
])
  .component('app',AppComponent)
	.service('colorService',colorsService)
	.service('d3Service', D3Service)
	.service('Highcharts',Highcharts)
	.service('normalizedValuesService',normalizedValuesService)
  .name;


export default root;  