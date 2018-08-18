import {assign,forEach} from 'lodash';

class radarChartController {
	constructor($scope, normalizedValuesService,d3Service, $log, $timeout){
		assign(this, {$scope, normalizedValuesService,d3Service, $log, $timeout});
	}



	$onInit() {
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		this.values = this.normalizedValuesService.getNormalizedValues();
		this.d3 = this.d3Service.getD3();


		Highcharts.wrap(Highcharts.Series.prototype, 'drawPoints', function(p) {
			const options = this.options;
			const symbolCallback = options.marker && options.marker.symbolCallback;
			const points = this.points;

			if (symbolCallback && points.length) {
				points.forEach(point => {
					const symbol = symbolCallback.call(point);
					if (symbol) {
						point.update({
							marker: {
								fillColor: '#FFFFFF',
								radius: 5,
								lineWidth: 2,
								lineColor: null // inherit from series
							}
						}, false);
					}
				});
			}

			p.call(this);
		});



		Highcharts.chart('container', {

			chart: {
				polar: true,
				animation: true,
			},

			loading: {
				hideDuration: 500,  // The duration in milliseconds of the fade out effect.
				labelStyle: null,   // CSS styles for the loading label span.
				showDuration: 500,  // The duration in milliseconds of the fade in effect.
				style: null         // CSS styles for the loading screen that covers the plot area.
			},



			title: {
				text: 'Budget vs spending',
				x: -80
			},

			pane: {
				size: '80%'
			},

			xAxis: {
				gridLineColor: '#a2aba0',
				// gridLineDashStyle: 'dash',
				categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
					'Information Technology', 'Administration', 'new'],
				tickmarkPlacement: 'on',
				lineWidth: 0
			},


			yAxis: {
				gridLineColor: '#a2aba0',
				gridLineDashStyle: 'dash',
				gridLineInterpolation: 'circle',
				lineWidth: 1,
				min: -1,
				plotBands: [{
					color: '#ffc0cb',
					from: 0,
					to: -1
				},{
					color: '#b8eab8',
					from: 0,
					to: +1
				}],
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
				marker: {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				},
				data: [-0.1,0.0, -0.45, -0.7, -0.4, -0.3,0.7],
				pointPlacement: 'on',
			}, {
				name: 'Actual Spending',
				marker: {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				},
				data: [0.4, 0.4, 0.6, 0.3, 0.6, 0.02,0.0],
				pointPlacement: 'on'
			}]

		});
	}

}

export default radarChartController;