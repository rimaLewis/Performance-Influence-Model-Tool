import {assign, isNil} from 'lodash';

class elephantPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});

		this.$scope.$watch('vm.chartConfig', (newValue) =>{
			if(!isNil(newValue)){
				this.showGraphs();
			}
		});

		this.$scope.$watch('vm.additionalSeries', (newValue) =>{
			if(!isNil(newValue)){
				this.addNewSeries();
			}
		});
	}


	showGraphs(){
		this.data = this.normalizedValuesService.getDataForElephantPlot();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderPlot();
	}

	addNewSeries(){
		this.series = this.additionalSeries.series;
		this.labels = this.additionalSeries.labels;
		console.log(' this.additionalSeries', this.additionalSeries);
		this.renderPlot();
	}

	renderPlot(){
		const data = this.series;
		const labels = this.labels;
		var me = {
			init: function(){
				me.hijackHighcharts();
				me.render('container3');
			},
			render: function( container ){
				$('#' + container ).highcharts({
					chart: {
						type: 'bar',
						width:1000,
						height:600,
						reflow:false,
					},
					title: {
						text: 'Elephant Plot'
					},
					xAxis: {
						categories: labels,
					},

					yAxis: {
						tickmarkPlacement:'on',
						min: 0,
						max: 1,
						startOnTick: false,
						title: {
							text: 'Total Performance'
						},
						reversedStacks: false,
						stackLabels: {
							enabled: true,
						}
					},

					/*plotOptions: {
						bar: {
							stacking: 'normal'
						}
					},*/
					plotOptions: {
						series: {
							stacking: 'normal',
							events :{
								hide: function(){
									console.log('this series is hidden',this.processedYData, this.name);
									me.init();

								},
								show: function(){
									console.log('this series is shown',this.processedYData,this.name);
									me.init();
								}
							}
						}
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
						layout: 'vertical'
					},

					tooltip: {
						followPointer: true, // keeps the tooltip with the current block
					},
					series: data,
				});
			},
			/**
			 * The purpose of this function is to sort the bar graph stacks to make the biggest categories appear first.
			 * To accomplish this, I'm hijacking the renderSeries function within Highcharts.Chart.  The original version of
			 * that in HighCharts just goes through each( this.series, function( serie ){ serie.translate(); serie.render(); }).
			 * What I'm doing is detecting if I'm rendering a bar graph and if so, then I am basically shuffling the y
			 * position ( which is actually the horizontal position because the 'bar' graph is an inverted version of
			 * 'column' ) of each point's shapeArgs object ( generated in serie.translate() ) such that the largest ones
			 * come first.  One thing to keep in mind, the 0 point of the y axis is actually at the far right of the chart,
			 * so I have to figure out what the far left point of the chart is and then put the blocks in from there.
			 */
			hijackHighcharts: function(){
				Highcharts.Chart.prototype.renderSeries = function(){
					var each = Highcharts.each,
						is_bar = this.options.chart.type == 'bar',
						far_left,
						current_left;
					var bars = {};

					each(this.series, function (serie) {
						serie.translate();
						if ( is_bar ) {
							each( serie.points, function( point, index ) {
								var barKey = serie.stackKey + ': ' + point.category;
								if ( typeof far_left == 'undefined' ) {
									far_left = point.shapeArgs.y + point.shapeArgs.height;
								}
								if ( typeof bars[barKey] == 'undefined' ) {
									bars[barKey] = [];
								}
								bars[barKey].push(point);
							});
						}
					});
					if ( is_bar ) {
						$.each( bars, function( barKey, points ) {
							current_left = far_left;
							// Sort descending by height ( which represents the size of the block )
							points.sort(function(a,b){
								return ( a.shapeArgs.height < b.shapeArgs.height ) ? 1 : ( a.shapeArgs.height > b.shapeArgs.height ) ? -1 : 0;
							});
							each( points, function( point, index ){
								point.shapeArgs.y = current_left - point.shapeArgs.height;
								current_left = point.shapeArgs.y + 0;
							});
						});
					}
					each(this.series, function (serie) {
						serie.render();
					});
				};
			}
		};
		me.init();

	}

	renderChart() {

		this.elephantPlot = Highcharts.chart('container3', {
			chart: {
				type: 'bar',
				width:1000,
				height:600,
			},
			title: {
				text: 'Elephant Plot'
			},
			xAxis: {
				// tickmarkPlacement:'on',
				categories: this.labels,
			},
			yAxis: {
				tickmarkPlacement:'on',
				min: 0,
				max: 1,
				startOnTick: false,
				title: {
					text: 'Total Performance'
				}
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

			plotOptions: {
				series: {
					stacking: 'normal',
					events :{
						hide: function(){
							console.log('this series is hidden',this.processedYData, this.name);

						},
						show: function(){
							console.log('this series is shown',this.processedYData,this.name);
						}
					}
				}
			},

			series: (this.series),
		});

	}


}

export default elephantPlotController;