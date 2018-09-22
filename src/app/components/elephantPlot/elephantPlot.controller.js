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

	/**
	 * sets the data required for renderPlot
	 * renderPlot renders the elephant plot
	 */
	showGraphs(){
		this.data = this.normalizedValuesService.getDataForElephantPlot();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderPlot();
	}

	/**
	 * when an interaction or feature change is applied, the series data for elephantPlot is set to show all the features and interactions
	 * any interaction or feature which is false is then removed appropriatley to show the updated Elephant Plot
	 * returns the series with all data (as on load of a csv file)
	 */
	getUpdatedEPSeries(){

		let newSeriesEP = [];
		const allData = cloneDeep(this.allCsvData);
		for(let i=0; i< allData.length;i++){
			const additionVal = this.d3.sum(allData[i], function(value){
				return Math.abs(value);
			});

			let finalArray = [];
			forEach(allData[i], function(value) {
				const newVal = Math.abs(value) / additionVal;
				const rounded = Math.round(newVal * 1000) / 1000;
				finalArray.push(rounded);
			});
			newSeriesEP.push(finalArray);
		}
		return newSeriesEP;
	}

	/**
	 * when an interaction is removed, the labels is checked to match the interaction applied
	 * that label and its value is removed to reflect the changes
	 *
	 */
	addOrRemoveInteractions(){
		const allData = cloneDeep(this.allCsvData);
		const labels = this.allLabels;
		let newSeriesEP = this.getUpdatedEPSeries();

		const that = this;

		forOwn(this.selectedInteractions, function(value, key) {
			if(value === false){
				forEach(labels,function (label, i) {
					if (!isNil(label)) {
						let count = (label.match(/\*/g) || []).length;
						if (count === parseInt(key)) {
							newSeriesEP = [];
							for(let a=0; a< allData.length;a++){
								const eachGroupData =  (allData[a]);
								eachGroupData[i] = '0';

								const finalArray = that.reCalculateEPData(eachGroupData);
								newSeriesEP.push(finalArray);
							}
						}
					}
				});
			}
		});

		this.series = this.getZippedData(newSeriesEP);
		this.labels = this.allGroups;
		this.renderPlot();
	}

	/**
	 * interaction or feature change, the EP is recalculated to show the remaining values importance
	 * return the array of values that are recomputed.
	 *
	 */
	reCalculateEPData(eachGroupData){
		const additionVal = this.d3.sum(eachGroupData, function(value){
			return Math.abs(value);
		});

		let finalArray = [];
		forEach(eachGroupData, function(value) {
			var newVal = Math.abs(value) / additionVal;
			var rounded = Math.round(newVal * 1000) / 1000;
			finalArray.push(rounded);
		});
		return finalArray;
	}

	/**
	 * zips two arrays to form one array. ex arr1 = [1,2] arr2 = [3,4] zippedArray = [[1,3] , [2,4]]
	 * return the array of zipped values
	 * zipped values are required for elephant plot to render
	 */
	getZippedData(newSeriesEP){
		let updatedSeriesEP = [];
		let arrayDataNew = zip(...newSeriesEP);
		let index = 0;
		if(arrayDataNew.length !==0 ){
			for(var k=0;k<this.allLabels.length;k++){
				updatedSeriesEP[index] = {name : this.allLabels[k], data: arrayDataNew[k], pointPlacement: 'on' };
				index++;
			}
		}
		return updatedSeriesEP;
	}

	/**
	 * when a feature is applied or removed, the data is updated and recalculated to plot updated EP
	 * the feature if applied is false, and the value at that index is made to 0, and recalculated its importance
	 */
	addOrRemoveParams(){
		var allData = cloneDeep(this.allCsvData);
		var newElephantSeries = this.getUpdatedEPSeries();
		const that = this;

		forOwn(this.selectedFeatures, function(value, key) {
			if(value === false){
				newElephantSeries = [];
				for(let a=0; a< allData.length;a++){
					const eachGroupData =  (allData[a]);
					eachGroupData[key] = '0';
					const finalArray = that.reCalculateEPData(eachGroupData);
					newElephantSeries.push(finalArray);
				}
			}
		});

		this.series =this.getZippedData(newElephantSeries);
		this.labels = this.allGroups;
		this.renderPlot();
	}

	/**
	 * if an additional csv file is uploaded, the variables that renderPlot function requires are updated
	 * and the renderPlot() is called to show the new added csv file
	 */
	addNewSeries(){
		this.series = this.additionalSeries.series;
		this.labels = this.additionalSeries.labels;
		this.renderPlot();
	}

	/**
	 * Highcharts config required to render the Elephant Plot
	 * hijackHighcharts(): this function sorts the values, and displays the bar with the highest value first.
	 */
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
					let each = Highcharts.each;
					let	is_bar = this.options.chart.type == 'bar';
					let	far_left;
					let current_left;
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

}

export default elephantPlotController;