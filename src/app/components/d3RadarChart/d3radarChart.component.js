import template from './d3radarChart.html';
import d3radarChartController from './d3radarChart.controller';


export const D3RadarChartComponent = {
	template: template,
	controller : d3radarChartController,
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
