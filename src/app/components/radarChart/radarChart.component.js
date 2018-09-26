import template from './radarChart.html';
import radarChartController from './radarChart.controller';


export const RadarChartComponent = {
	template: template,
	controller : radarChartController,
	controllerAs : 'vm',
	bindings :{
		name : '@',
		chartConfig : '<',
		additionalSeries :'<?',
		selectedFeatures :'=',
		selectedInteractions : '=',
		chartConfigFilters : '<',
		chartConfigLabels : '<',
		chartVizInfo :'<'
	}
};
