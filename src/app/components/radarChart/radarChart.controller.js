import {assign, isNil, forEach} from 'lodash';

class radarChartController {
	constructor($scope,$window, normalizedValuesService,d3Service, $log, $timeout, toastr){
		assign(this, {$scope,$window, normalizedValuesService,d3Service, $log, $timeout, toastr});

		this.$scope.$watch('vm.chartConfig', (newValue) =>{
			if(!isNil(newValue)){
				this.showGraphs();
			}
		});
	}

	$onInit() {
		this.d3 = this.d3Service.getD3();
		this.data = [];
		this.renderChart();
	}

	showGraphs(){
		this.data = this.normalizedValuesService.getNormalizedValues();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderChart();
	}

	updatePlotLineColor(){
		var series = this.chart.series[0];
		series.color = this.PlotLineColor;
		series.graph.attr({
			stroke: this.PlotLineColor
		});
		this.chart.legend.colorizeItem(series, series.visible);
		$.each(series.data, function(i, point) {
			point.graphic.attr({
				fill: this.PlotLineColor
			});
		});
		series.redraw();
		this.toastr.success('Chart Updated', 'Radar Chart');
	}

	updatePlotLineColor2(){
		var series = this.chart.series[1];
		series.color = this.PlotLineColor2;
		series.graph.attr({
			stroke: this.PlotLineColor2,
		});
		this.chart.legend.colorizeItem(series, series.visible);
		$.each(series.data, function(i, point) {
			point.graphic.attr({
				fill: this.PlotLineColor2
			});
		});
		series.redraw();
		this.toastr.success('Chart Updated', 'Radar Chart');
	}

	updateLineWidth(){
		this.chart.update({
			plotOptions: {
				series: {
					lineWidth: this.PlotLineWidth,
				}
			},
		});
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

		this.chart = Highcharts.chart('container', {

			chart: {
				events: {
					redraw: function () {

						var label = this.renderer.label('The chart was just redrawn', 100, 120)
							.attr({
								fill: Highcharts.getOptions().colors[0],
								padding: 10,
								r: 5,
								zIndex: 8
							})
							.css({
								color: '#FFFFFF'
							})
							.add();

						setTimeout(function () {
							label.fadeOut();
						}, 1000);
					}
				},
				height:600,
				width:1000,
				polar: true,
				showAxes: true,
				// panning: true,
				zoomType: 'xy',
				type: 'line',
				panning: 'xy',
				panKey: 'shift'
			},

			mapNavigation: {
				enabled: true
			},

			loading: {
				hideDuration: 500,  // The duration in milliseconds of the fade out effect.
				labelStyle: null,   // CSS styles for the loading label span.
				showDuration: 500,  // The duration in milliseconds of the fade in effect.
				style: null         // CSS styles for the loading screen that covers the plot area.
			},

			title: {
				text: 'Radar Chart',
				x: -80
			},

			pane: {
				size: '80%'
			},

			/*	scrollbar: {
					enabled: true
				},*/

			xAxis: {
				reversed: false,
				startOnTick: true,
				endOnTick: true,
				gridLineColor: '#a2aba0',
				// gridLineDashStyle: 'dash',
				// categories: ['Sales', 'Marketing', 'Development', 'Customer Support', 'Information Technology', 'Administration', 'new'],
				categories : this.labels,
				tickmarkPlacement: 'on',
				labels: {
					useHTML:true,//set to true
					style:{
						width:'150px',
						whiteSpace:'normal'//set to normal
					},
					step: 1,
					/*formatter: function () {//use formatter
						return '<div align="center" style="word-wrap: break-word;word-break: break-all;width:150px">' + this.value + '</div>';
					}*/
				},
				lineWidth: 0,
				align: 'center',
				x: 70,
				useHTML: true,
				style: {
					'white-space': 'normal',
					left: '0px',
					top: '0px',
					position: 'absolute'
				},
			},


			yAxis: {
				maxPadding: 0,
				reversed: false,
				startOnTick: true,
				endOnTick: true,
				gridLineColor: '#a2aba0',
				gridLineDashStyle: 'dash',
				gridLineInterpolation: 'circle',
				lineWidth: 1,
				// min: -1,
				tickPositions: [-1.2,-1, 0, 1],  // -1.2 added to add the smaller inner white circle
				showLastLabel: true,
				labels:
				{
					enabled: false
				},
				plotBands: [{
					color: '#ffc0cb',
					from: 0,
					to: -1
				},{
					color: '#b8eab8',
					from: 0,
					to: 1
				}],
			},

			plotOptions: {
				series: {
					lineWidth: 1,
				},
			},

			tooltip: {
				shared: false,
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
				// padding:30,
				verticalAlign: 'bottom',
				// y: 70,
				layout: 'vertical'
			},
			series : this.series,

		});
	}
}

export default radarChartController;


