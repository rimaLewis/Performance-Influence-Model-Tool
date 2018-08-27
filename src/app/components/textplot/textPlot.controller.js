import {assign, cloneDeep, forOwn, isNil} from 'lodash';

class textPlotController {
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

		this.$scope.$watch('vm.textplotSelectedFeatures', (newValue) =>{
			if(!isNil(newValue)){
				this.editSeries();
			}
		},true);


	}

	editSeries(){
		console.log('edit series called');
		var labels = cloneDeep(this.textplotChartConfigLabels);
		var oldSeries = cloneDeep(this.textplotChartConfigFilters);
		console.log('chartConfigFilters  ',this.textplotChartConfigFilters);
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
				console.log(value +false, 'position', key);

				console.log('labels before splicing', labels);
				labels[key] = null;
				console.log('labels after splicing', labels);
				for(var i=0;i<oldSeries.length;i++)  // looping through each of series data - array
				{
					series = oldSeries[i];  // each of the series
					console.log('series before splicing', series.data);
					series.data[key]  = null;
					console.log('series after splicing', series.data);
					newSeries[pos] = {name : series.name, data: series.data};
					pos++;
				}
			}
		});

		console.log('final, labels',newSeries, labels);

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
		console.log(' %%%%% ',newSeries);
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
			this.texplotChart.addSeries({
				name: additionalSeries[i].name,
				data: additionalSeries[i].data,
			});
		}
	}


	renderChart(){

		/*this.Highcharts.setOptions({
			colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
		});*/

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