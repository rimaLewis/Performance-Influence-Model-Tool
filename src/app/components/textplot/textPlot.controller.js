import {assign} from 'lodash';

class textPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		const data = this.normalizedValuesService.getNormalizedValues();

		Highcharts.chart('container2',{

			chart: {
				polar: false,
				type: 'line',
				inverted: true
			},

			pane: {
				size: '80%'
			},

			xAxis: [{
				categories: ['Sales', 'Marketing', 'Development', 'Customer Support', 'Information Technology', 'Administration', 'new'],
				tickmarkPlacement: 'on',
			}, {
				linkedTo: 0,
				categories: ['Sales', 'Marketing', 'Development', 'Customer Support', 'Information Technology', 'Administration', 'new'],
				tickmarkPlacement: 'on',
				opposite: true
			}],

			yAxis: {
				gridLineInterpolation: 'circle',
				lineWidth: 1,
				min: -1
			},

			tooltip: {
				shared: true,
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
				data: [0.4, 0.4, 0.6, 0.3, 0, 0.23,0.8],
				pointPlacement: 'on'
			}]

		});
	}


}

export default textPlotController;