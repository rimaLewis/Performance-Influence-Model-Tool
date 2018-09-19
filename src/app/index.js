import '../../node_modules/bootstrap-css-only/css/bootstrap.min.css';
import '../style/style.css';
import '../../node_modules/bootswatch/dist/superhero/bootstrap.min.css';
// import '../../node_modules/angular-material/angular-material.css';

import angular from 'angular';
import 'angular-animate';
import 'angular-toastr';
import 'angularjs-color-picker';

import uiRouter from 'angular-ui-router';
import common from './common/common';
import components from './components/components';
import { AppComponent } from './app.component';
// import {ColorPickerModule } from 'ngx-color-picker';
import normalizedValuesService from './app.service';
import D3Service from './d3.service';
import colorsService from './colors.service';


const root = angular
  .module('angularApp', [
	'ngAnimate',
	'toastr',
	uiRouter,
	common,
	components,
	// ColorPickerModule,
])
  .component('app',AppComponent)
	.service('colorService',colorsService)
	.service('d3Service', D3Service)
	.service('normalizedValuesService',normalizedValuesService)
  .name;


export default root;  