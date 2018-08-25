import {assign} from 'lodash';

class textPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});

		this.$scope.$watch('vm.chartConfig', (newValue, oldValue) =>
			this.showGraphs()
		);
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		const data = this.normalizedValuesService.getNormalizedValues();
		this.data = [];
		this.renderChart();

	}

	showGraphs(){
		this.data = this.normalizedValuesService.getNormalizedValues();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderChart();
	}


	renderChart(){
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
				inverted: true,
				// panning: true,
				width:600,
				height:900,
				zoomType: 'xy',
				panning: 'xy',
				panKey: 'shift',

			},


			mapNavigation: {
				enabled: true
			},

			title: {
				text: 'Text Plot',
				x: -80
			},

			pane: {
				size: '80%'
			},

			subtitle: {
				text: document.ontouchstart === undefined ?
					'Click and drag in the plot area to zoom in' :
					'Drag your finger over the plot to zoom in'
			},

			xAxis: [{
				startOnTick: false,
				endOnTick: false,
				gridLineColor: '#a2aba0',
				gridLineDashStyle: 'dash',
				categories: this.labels,
				tickmarkPlacement: 'on',
				labels: {
					useHTML:true,//set to true
					style:{
						width:'165px',
						whiteSpace:'normal'//set to normal
					},
					step: 1,
					formatter: function () {//use formatter
						return '<div align="center" style="word-wrap: break-word;word-break: break-all;width:165px">' + this.value + '</div>';
					}
				},
			}, {
				linkedTo: 0,
				categories: this.labels,
				tickmarkPlacement: 'on',
				opposite: true,
				labels: {
					useHTML:true,//set to true
					style:{
						width:'165px',
						whiteSpace:'normal'//set to normal
					},
					step: 1,
					formatter: function () {//use formatter
						return '<div align="center" style="word-wrap: break-word;word-break: break-all;width:165px">' + this.value + '</div>';
					}
				},
			}],

			yAxis: {
				reversed: false,
				startOnTick: false,
				endOnTick: false,
				gridLineColor: '#a2aba0',
				gridLineDashStyle: 'dash',
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

			plotOptions: {
				series: {
					lineWidth: 1,
					style: {
						width: '100px'
					}
				},
			},


			tooltip: {
				shared: true,
				pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
			},

			legend: {
				title: {
					text: 'LEGEND<br/><span style="font-size: 9px; color: #666; font-weight: normal; text-align:center;"></span>',
				},
				backgroundColor: 'white',
				borderColor: 'grey',
				borderWidth: 1,
				align: 'center',
				verticalAlign: 'bottom',
				// y: 70,
				layout: 'vertical'
			},

			series: this.series,

		});
	}

}

export default textPlotController;