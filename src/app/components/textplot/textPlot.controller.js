import {assign, cloneDeep, forEach, forOwn, isNil, map} from 'lodash';

class textPlotController {
	constructor($scope, normalizedValuesService, colorService){
		assign(this, {$scope, normalizedValuesService, colorService});

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

		this.$scope.$watch('vm.textplotSelectedFeatures', (newValue) =>{
			if(!isNil(newValue)){
				const type = 'features';
				this.setDataToOriginalData(type);
			}
		},true);

		this.$scope.$watch('vm.selectedInteractions', (newValue) =>{
			if(!isNil(newValue)){
				const type = 'interactions';
				this.setDataToOriginalData(type);
			}
		},true);

		this.$scope.$watch('vm.chartVizInfo', (newValue) =>{
			if(!isNil(newValue)){
				this.updateChartVisualization();
			}
		},true);

	}

	$onInit(){
		this.Highcharts = Highcharts;
		this.data = [];
		this.renderChart();
	}

	/**
	 * update the line color of each chart when a color from color picker is selected
	 */
	updateChartVisualization(){
		const lineColor = map(map(this.chartVizInfo, 'XX_LINE_COLOR'), 'lineColor');
		const lineWidth = map(map(this.chartVizInfo, 'XX_LINE_WIDTH'), 'lineWidth');
		this.texplotChart.series.forEach((value,i) => {
			value.options.color = lineColor[i];
			lineWidth[i] = (lineWidth[i] ===  undefined) ? 1 : lineWidth[i];
			value.options.lineWidth = lineWidth[i];

			value.update(value.options);
			value.redraw();
		});
	}


	/**
	 * oldSeries = [{name : String, data : array],
	 * 			   {name : String, data : array]
	 * 			  ]
	 *new series is nothing but oldseries,
	 * and if any value is false, remove them from the newSeries array
	 * @param type 'features' or 'interactions'
	 */
	setDataToOriginalData(type){
		var labels = cloneDeep(this.textplotChartConfigLabels);
		var oldSeries = cloneDeep(this.textplotChartConfigFilters);
		const that = this;
		this.newSeries = [];
		forOwn(this.textplotChartConfigFilters, function(value) {
			that.newSeries.push(value);
		});

		type === 'features' ? this.addOrRemoveParams(labels,oldSeries) : this.addOrRemoveIneractions(labels,oldSeries);

		if(!isNil(this.newSeries)) {
			for (let i = 0; i < this.newSeries.length;i++) {
				var data = this.newSeries[i].data;

				// for each series, a callback function is added, to check if the value is 0, if its zero - a different marker symbol is shown.
				this.newSeries[i].marker = {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				};

				//remove all the values from the array that are set to null
				data = data.filter(function (element) {
					return element !== null;
				});
				this.newSeries[i].data = data;
			}
		}

		if(!isNil(labels)){
			labels = labels.filter(function( element ) {
				return element !== null;
			});
		}
		this.series = this.newSeries;
		this.labels = labels;
		this.renderChart();
		this.getLineColorsAndWidth();
		this.updateChartVisualization();
	}

	/**
	 *
	 * @param labels - array of original labels
	 * @param oldSeries - array of original series
	 */
	addOrRemoveIneractions(labels,oldSeries){
		let series;
		const that = this;
		forOwn(this.selectedInteractions, function(value, key) {
			if(value === false){
				forEach(labels,function (label, j) {
					let count;
					if (!isNil(label)) {
						count = (label.match(/\*/g) || []).length;
						if (count === parseInt(key)) {
							let pos = 0;
							labels[j] = null;
							for(let i=0;i<oldSeries.length;i++)  // looping through each of series data - array
							{
								series = oldSeries[i];  // each of the series
								series.data[j]  = null;
								that.newSeries[pos] = {name : series.name, data: series.data};
								pos++;
							}
						}
					}
				});
			}
		});
	}

	/**
	 *
	 * @param labels - array of original labels
	 * @param oldSeries - array of original series
	 */
	addOrRemoveParams(labels,oldSeries){
		let series;
		const that = this;
		forOwn(this.textplotSelectedFeatures, function(value, key) {
			if(value === false){
				var pos = 0;
				labels[key] = null;
				for(var i=0;i<oldSeries.length;i++)  // looping through each of series data - array
				{
					series = oldSeries[i];  // each of the series
					series.data[key]  = null;
					that.newSeries[pos] = {name : series.name, data: series.data};
					pos++;
				}
			}
		});
	}

	/**
	 * set the data required by highcharts when a csv file is uploaded.
	 */
	showGraphs(){
		this.data = this.normalizedValuesService.getNormalizedValues();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderChart();
	}

	/**
	 * set the data required by highcharts when an additional csv file is uploaded.
	 */
	addNewSeries(){
		const additionalSeries = this.additionalSeries.series;
		for(let i=0; i<additionalSeries.length;i++){
			const color = (this.colorService.getRandomColor()).rgb;
			this.texplotChart.addSeries({
				name: additionalSeries[i].name,
				data: additionalSeries[i].data,
				color,
			});
		}
		this.getLineColorsAndWidth();
	}


	/**
	 * Get the colors and line width of each series to fill in the data in table
	 *
	 */
	getLineColorsAndWidth(){
		this.texplotChart.series.forEach((value,j) => {
			for(let i=0;i<this.chartVizInfo.length;i++){
				if( i === j){
					this.chartVizInfo[i].XX_LINE_COLOR.lineColor = value.color;
					this.chartVizInfo[i].XX_LINE_WIDTH.lineWidth = value.options.lineWidth;
				}
			}
		});
	}

	/**
	 * Highcharts config required to render the Radar chart
	 *
	 */
	renderChart(){

		Highcharts.setOptions({
			colors: [ '#000000', '#FF4500', '#0051FF', '#6D1A83', '#FFC100', '#8b008b', '#556b2f', '#ff8c00', '#9932cc', '#8b0000', '#9400d3','#ff00ff', '#ffd700', '#008000', '#4b0082', '#00ff00', '#ff00ff', '#800000', '#000080', '#808000', '#ffa500', '#800080', '#ff0000', '#ffff00','#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
		});
		/**
		 * updates the marker symbol to a different one if the value is exactly zero
		 *
		 */
		this.Highcharts.wrap(this.Highcharts.Series.prototype, 'drawPoints', function(p) {
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
								radius: 4,
								lineWidth: 2,
								lineColor: null // inherit from series
							}
						}, false);
					}
				});
			}

			p.call(this);
		});

		this.texplotChart = this.Highcharts.chart('container2',{

			chart: {
				/*polar: false,
				type: 'line',*/
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
			},

			pane: {
				size: '80%'
			},

			/*subtitle: {
				text: document.ontouchstart === undefined ?
					'Click and drag in the plot area to zoom in' :
					'Drag your finger over the plot to zoom in'
			},*/

			xAxis: [{
				startOnTick: true,
				endOnTick: true,
				gridLineColor: '#a2aba0',
				gridLineDashStyle: 'dash',
				categories: this.labels,
				tickmarkPlacement: 'on',
				labels: {
					useHTML:true,//set to true
					style:{
						width:'200px',
						whiteSpace:'normal'//set to normal
					},
					step: 1,
					formatter: function () {//use formatter
						return '<div align="center" style="word-wrap: break-word;word-break: break-all;width:200px">' + this.value + '</div>';
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
						width:'200px',
						whiteSpace:'normal'//set to normal
					},
					step: 1,
					formatter: function () {//use formatter
						return '<div align="center" style="word-wrap: break-word;word-break: break-all;width:200px">' + this.value + '</div>';
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
				},
				animation: false
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
				layout: 'horizontal'
			},

			series: this.series,

		});
	}

}

export default textPlotController;