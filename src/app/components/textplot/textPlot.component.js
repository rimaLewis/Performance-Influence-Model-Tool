import template from './textPlot.html';
import textPlotController from './textPlot.controller';


export const TextPlotComponent = {
	template: template,
	controller : textPlotController,
	controllerAs : 'vm',
	bindings :{
		name : '@',
		chartConfig: '<',
		additionalSeries :'<?',
		features : '<?',
	}
};
