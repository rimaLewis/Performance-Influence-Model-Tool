import '../../node_modules/bootstrap-css-only/css/bootstrap.min.css';
import '../style/style.css';
import '../../node_modules/bootswatch/dist/superhero/bootstrap.min.css';
import normalizedValuesService from './app.service';
import D3Service from './d3.service';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import common from './common/common';
import components from './components/components';
import { AppComponent } from './app.component';
// import { D3Service } from 'd3-ng2-service';


const root = angular  
  .module('angularApp', [
	uiRouter, 
	common,
	components,
])
  .component('app',AppComponent )
	.service('d3Service', D3Service)
	.service('normalizedValuesService',normalizedValuesService)
  .name;


export default root;  