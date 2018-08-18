import {assign} from 'lodash';

class elephantPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		const data = this.normalizedValuesService.getNormalizedValues();


		Highcharts.chart('container3', {
			chart: {
				type: 'bar',
			},
			title: {
				text: 'Stacked bar chart'
			},
			xAxis: {
				categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Total fruit consumption'
				}
			},
			legend: {
				reversed: true
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series: [{
				name: 'John',
				data: [0.1, 0.2, -0.4, 0.7, -0.2]
			}, {
				name: 'Jane',
				data: [0.2, 0.22, -0.43, -0.32, 0.71]
			}, {
				name: 'Joe',
				data: [0.73, -0.34, 0.74, -0.62, -0.95]
			}]
		});

	}

}

export default elephantPlotController;