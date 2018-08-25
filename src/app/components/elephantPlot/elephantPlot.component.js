import template from './elephantPlot.html';
import elephantPlotController from './elephantPlot.controller';


export const ElephantPlotComponent = {
	template: template,
	controller : elephantPlotController,
	controllerAs : 'vm',
	bindings :{
		name : '@',
		chartConfig: '<',
	}
};
