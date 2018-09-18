import {assign, forEach, isNil, zip, cloneDeep, forOwn, isEmpty} from 'lodash';

class elephantPlotController {
	constructor($scope, normalizedValuesService,d3Service){
		assign(this, {$scope, normalizedValuesService,d3Service});

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

		this.$scope.$watch('vm.selectedFeatures', (newValue) =>{
			if(!isNil(newValue)){
				this.addOrRemoveParams();
			}
		},true);

		this.$scope.$watch('vm.selectedInteractions', (newValue) =>{
			if(!isNil(newValue)){
				this.addOrRemoveInteractions();
			}
		},true);


	}

	$onInit(){
		this.d3 = this.d3Service.getD3();
	}

	showGraphs(){
		this.data = this.normalizedValuesService.getDataForElephantPlot();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderPlot();
	}

	addOrRemoveInteractions(){

		var allData = cloneDeep(this.allCsvData);
		var newSeriesEP = [];
		var labels = this.allLabels;
		this.updatedSeriesEP = [];
		var d3 = this.d3;

		for(var i=0; i< allData.length;i++){
			var additionVal = this.d3.sum(allData[i], function(value){
				return Math.abs(value);
			});

			var finalArray = [];
			forEach(allData[i], function(value) {
				var newVal = Math.abs(value) / additionVal;
				var rounded = Math.round(newVal * 1000) / 1000;
				finalArray.push(rounded);
			});
			newSeriesEP.push(finalArray);
		}

		forOwn(this.selectedInteractions, function(value, key) {
			if(value === false){
				var keyPos = key;
				forEach(labels,function (label, j) {
					var count;
					if (!isNil(label)) {
						count = (label.match(/\*/g) || []).length;
						if (count === parseInt(keyPos)) {
							newSeriesEP = [];
							for(var a=0; a< allData.length;a++){
								const eachGroupData =  (allData[a]);
								eachGroupData[j] = '0';
								var additionVal = d3.sum(eachGroupData, function(value){
									return Math.abs(value);
								});

								var finalArray = [];
								forEach(eachGroupData, function(value) {
									var newVal = Math.abs(value) / additionVal;
									var rounded = Math.round(newVal * 1000) / 1000;
									finalArray.push(rounded);
								});
								newSeriesEP.push(finalArray);
							}
						}
					}
				});
			}
		});

		this.arrayDataNew = [];
		this.arrayDataNew = zip(...newSeriesEP);
		var index3 = 0;
		if(this.arrayDataNew.length !==0 ){
			for(var k=0;k<this.allLabels.length;k++){
				this.updatedSeriesEP[index3] = {name : this.allLabels[k], data: this.arrayDataNew[k], pointPlacement: 'on' };
				index3++;
			}
		}

		this.series = this.updatedSeriesEP;
		this.labels = this.allGroups;
		this.renderPlot();
	}

	addOrRemoveParams(){
		var allData = cloneDeep(this.allCsvData);
		var newElephantSeries = [];
		this.updatedSeries = [];
		var d3 = this.d3;

		for(var i=0; i< allData.length;i++){
			var additionVal = this.d3.sum(allData[i], function(value){
				return Math.abs(value);
			});

			var finalArray = [];
			forEach(allData[i], function(value) {
				var newVal = Math.abs(value) / additionVal;
				var rounded = Math.round(newVal * 1000) / 1000;
				finalArray.push(rounded);
			});
			newElephantSeries.push(finalArray);
		}

		forOwn(this.selectedFeatures, function(value, key) {
			if(value === false){
				newElephantSeries = [];
				for(var a=0; a< allData.length;a++){
					const eachGroupData =  (allData[a]);
					eachGroupData[key] = '0';
					var additionVal = d3.sum(eachGroupData, function(value){
						return Math.abs(value);
					});

					var finalArray = [];
					forEach(eachGroupData, function(value) {
						var newVal = Math.abs(value) / additionVal;
						var rounded = Math.round(newVal * 1000) / 1000;
						finalArray.push(rounded);
					});
					newElephantSeries.push(finalArray);
				}
			}
		});

		this.arrayData = [];
		this.arrayData = zip(...newElephantSeries);
		var index3 = 0;
		if(this.arrayData.length !==0 ){
			for(var k=0;k<this.allLabels.length;k++){
				this.updatedSeries[index3] = {name : this.allLabels[k], data: this.arrayData[k], pointPlacement: 'on' };
				index3++;
			}
		}

		this.series = this.updatedSeries;
		this.labels = this.allGroups;
		this.renderPlot();
	}

	addNewSeries(){
		this.series = this.additionalSeries.series;
		this.labels = this.additionalSeries.labels;
		this.renderPlot();
	}



	renderPlot(){
		const that = this;
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
						categories: that.labels,
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

					},

					plotOptions: {
						series: {
							stacking: 'normal',

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
					series: that.series,
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

						},
						show: function(){
						}
					}
				}
			},

			series: (this.series),
		});

	}


}

export default elephantPlotController;