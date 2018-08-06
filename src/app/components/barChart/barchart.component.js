import template from './barchart.html';
import barchartController from './barchart.controller';


export const BarchartComponent = {
	template: template,
	controller : barchartController,
	controllerAs : 'vm',
	bindings :{
		name : '@',
	}
};

