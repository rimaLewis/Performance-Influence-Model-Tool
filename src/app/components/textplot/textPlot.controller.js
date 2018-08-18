import {assign} from 'lodash';

class textPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		const data = this.normalizedValuesService.getNormalizedValues();

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
				gridLineColor: '#a2aba0',
				gridLineDashStyle: 'dash',
				categories: ['Sales', 'Marketing', 'Development', 'Customer Support', 'Information Technology', 'Administration', 'new'],
				tickmarkPlacement: 'on',
			}, {
				linkedTo: 0,
				categories: ['Sales', 'Marketing', 'Development', 'Customer Support', 'Information Technology', 'Administration', 'new'],
				tickmarkPlacement: 'on',
				opposite: true
			}],

			yAxis: {
				gridLineColor: '#a2aba0',
				gridLineDashStyle: 'dash',
				lineWidth: 1,
				min: -1,
				plotBands: [{
					color: '#f9a6a6',
					from: 0,
					to: -1
				},{
					color: '#b4f1a2',
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
				data: [-0.1,-0.0, -0.45, -0.0001, -0.4, -0.3,0.7],
				pointPlacement: 'on'
			}, {
				name: 'Actual Spending',
				marker: {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				},
				data: [0.4, 0.4, 0.6, 0.3, 0, 0.92,0.3],
				pointPlacement: 'on'
			}]

		});
	}


}

export default textPlotController;