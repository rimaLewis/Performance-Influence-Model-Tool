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
				this.editSeries();
			}
		},true);

		this.$scope.$watch('vm.selectedInteractions', (newValue) =>{
			if(!isNil(newValue)){
				this.addOrRemoveIneractions();
			}
		},true);

		this.$scope.$watch('vm.chartVizInfo', (newValue) =>{
			if(!isNil(newValue)){
				this.updateChartVisualization();
			}
		},true);

	}

	updateChartVisualization(){
		const lineColor = map(map(this.chartVizInfo, 'XX_LINE_COLOR'), 'lineColor');
		const lineWidth = map(map(this.chartVizInfo, 'XX_LINE_WIDTH'), 'lineWidth');
		this.texplotChart.series.forEach((value,i) => {
			value.color = lineColor[i];
			value.graph.attr({
				stroke: lineColor[i]
			});
			// value.lineWidth = lineWidth[i],
			/*	value.update({
					lineWidth: lineWidth[i],
				});*/
			this.texplotChart.legend.colorizeItem(value, value.visible);
			/*$.each(value.data, function(i, point) {
				point.graphic.attr({
					fill: lineColor[i]
				});
			});*/
			value.redraw();
		});
	}


	addOrRemoveIneractions(){
		var labels = cloneDeep(this.textplotChartConfigLabels);
		var oldSeries = cloneDeep(this.textplotChartConfigFilters);

		var newSeries = [];
		var series = [];

		// new series is nothing but oldseries,
		// and if any value is false, remove them from the newSeries array

		forOwn(this.textplotChartConfigFilters, function(value) {
			newSeries.push(value);
		});

		forOwn(this.selectedInteractions, function(value, key) {
			var keyPos = key;
			// selectedInteractions = {0:true, 1 :false};
			if(value === false){
				forEach(labels,function (label, j) {
					var count;
					if (!isNil(label)) {
						count = (label.match(/\*/g) || []).length;
						if (count === parseInt(keyPos)) {
							var pos = 0;
							labels[j] = null;
							for(var i=0;i<oldSeries.length;i++)  // looping through each of series data - array
							{
								series = oldSeries[i];  // each of the series
								series.data[j]  = null;
								newSeries[pos] = {name : series.name, data: series.data};
								pos++;
							}

						}
					}
				});

			}
		});

		for(var j=0;j<newSeries.length;j++){
			var data = newSeries[j].data;

			data = data.filter(function( element ) {
				return element !== null;
			});

			newSeries[j].data = data;
		}
		if(!isNil(labels)){

			labels = labels.filter(function( element ) {
				return element !== null;
			});
		}
		this.series = newSeries;
		this.labels = labels;
		this.renderChart();



	}


	editSeries(){
		var labels = cloneDeep(this.textplotChartConfigLabels);
		var oldSeries = cloneDeep(this.textplotChartConfigFilters);
		/*
		* oldSeries = [{name : String, data : array],
		* 			   {name : String, data : array]
		* 			  ]
		*
		* */
		var newSeries = [];
		var series = [];

		// new series is nothing but oldseries,
		// and if any value is false, remove them from the newSeries array

		forOwn(this.textplotChartConfigFilters, function(value, key) {
			newSeries.push(value);
		});
		forOwn(this.textplotSelectedFeatures, function(value, key) {
			if(value === false){
				var pos = 0;
				labels[key] = null;
				for(var i=0;i<oldSeries.length;i++)  // looping through each of series data - array
				{
					series = oldSeries[i];  // each of the series
					series.data[key]  = null;
					newSeries[pos] = {name : series.name, data: series.data};
					pos++;
				}
			}
		});
		for(var j=0;j<newSeries.length;j++){
			var data = newSeries[j].data;

			data = data.filter(function( element ) {
				return element !== null;
			});

			newSeries[j].data = data;
		}

		if(!isNil(labels)){

			labels = labels.filter(function( element ) {
				return element !== null;
			});
		}
		this.series = newSeries;
		this.labels = labels;
		this.renderChart();

	}

	$onInit(){
		this.Highcharts = Highcharts;
		this.data = [];
		this.renderChart();

	}

	showGraphs(){
		this.data = this.normalizedValuesService.getNormalizedValues();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderChart();
	}

	addNewSeries(){
		var additionalSeries = this.additionalSeries.series;
		for(var i=0; i<additionalSeries.length;i++){
			var color = (this.colorService.getRandomColor()).rgb;
			this.texplotChart.addSeries({
				name: additionalSeries[i].name,
				data: additionalSeries[i].data,
				color,
			});
		}
	}


	renderChart(){



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

		this.texplotChart = this.Highcharts.chart('container2',{

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
				startOnTick: true,
				endOnTick: true,
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
				layout: 'vertical'
			},

			series: this.series,

		});
	}

}

export default textPlotController;