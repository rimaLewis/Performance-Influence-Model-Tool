import {assign} from 'lodash';

class radarChartController {
	constructor($scope, normalizedValuesService,d3Service, $log, $timeout){
		assign(this, {$scope, normalizedValuesService,d3Service, $log, $timeout});
	}

	$onInit() {
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		this.values = this.normalizedValuesService.getNormalizedValues();
		this.d3 = this.d3Service.getD3();


		Highcharts.chart('container', {

			chart: {
				polar: true
			},

			title: {
				text: 'Budget vs spending',
				x: -80
			},

			pane: {
				size: '80%'
			},

			xAxis: {
				categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
					'Information Technology', 'Administration', 'new'],
				tickmarkPlacement: 'on',
				lineWidth: 0
			},


			yAxis: {
				gridLineInterpolation: 'circle',
				lineWidth: 1,
				min: -1
			},

			tooltip: {
				shared: false,
				pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
			},

			legend: {
				align: 'right',
				verticalAlign: 'top',
				y: 70,
				layout: 'vertical'
			},

			series: [{
				name: 'Allocated Budget',
				data: [-0.1,-0.56, -0.45, -0.7, -0.4, -0.3,0.7],
				pointPlacement: 'on'
			}, {
				name: 'Actual Spending',
				data: [0.4, 0.4, 0.6, 0.3, 0.6, 0.23,0.8],
				pointPlacement: 'on'
			}]

		});
	}

}

export default radarChartController;