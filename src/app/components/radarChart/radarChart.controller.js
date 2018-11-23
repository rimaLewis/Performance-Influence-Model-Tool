import {assign, isNil, forEach, forOwn, cloneDeep, map, find, uniq} from 'lodash';



class radarChartController {
	constructor($scope,$window, normalizedValuesService,d3Service ,colorService,localStorage, $log, $timeout, toastr){
		assign(this, {$scope,$window, normalizedValuesService,d3Service, colorService,localStorage, $log, $timeout, toastr});

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
				// this.updateSelectedInteractions();
				const type='features';
				this.update(type);
			}
		},true);

		this.$scope.$watch('vm.selectedInteractions', (newValue) =>{
			if(!isNil(newValue)){
				// this.updateSelectedFeatures();
				const type='interactions';
				this.update(type);

			}
		},true);

		this.$scope.$watch('vm.chartVizInfo', () =>{
			const colors = map(map(this.chartVizInfo, 'XX_LINE_COLOR'), 'lineColor');
			if( colors !== '["#000000", "#0000ff"]'){
				this.updateChartVisualization();
			}
		},true);
	}


	$onInit() {
		this.d3 = this.d3Service.getD3();
		this.data = [];
	}

	/**
	 * update the line color of each chart when a color from color picker is selected
	 */
	updateChartVisualization(){
		this.setLineColors();
		// const lineColor = map(map(this.chartVizInfo, 'XX_LINE_COLOR'), 'lineColor');
		// const lineWidth = map(map(this.chartVizInfo, 'XX_LINE_WIDTH'), 'lineWidth');

		// console.log('colors from localstorage', this.localStorage.getColors());
		const lineColor =  JSON.parse(this.localStorage.getColors());
		const lineWidth =   JSON.parse(this.localStorage.getLineWidth());

		this.radarChart.series.forEach((value,i) => {

			value.options.color = lineColor[i];
			lineWidth[i] = (lineWidth[i] ===  undefined) ? 1 : lineWidth[i];
			value.options.lineWidth = lineWidth[i];

			value.update(value.options);
			value.redraw();

		});
	}



	setLineColors(){
		// console.log('set line colors');
		const lineColor = map(map(this.chartVizInfo, 'XX_LINE_COLOR'), 'lineColor');
		const lineWidth = map(map(this.chartVizInfo, 'XX_LINE_WIDTH'), 'lineWidth');
		this.localStorage.setColors(JSON.stringify(lineColor));
		this.localStorage.setLineWidth(JSON.stringify(lineWidth));
	}

	update(type){
		let labels =  cloneDeep(this.chartConfigLabels);
		let features = cloneDeep(this.selectedFeatures); // (this.selectedFeatures);
		let interactions =  cloneDeep(this.selectedInteractions);// (this.selectedInteractions);

		if(type === 'interactions'){
			forOwn(interactions, function(value, key) {
				if(value === false){
					forEach(labels,function (label, j) {
						let count;
						if (!isNil(label)) {
							count = (label.match(/\*/g) || []).length;
							if (count === parseInt(key)) {
								labels[j] = null;
							}
						}
					});
				}
			});

			if(!isNil(labels)){
				labels.forEach(function(value,key){
					if(labels[key] === null){
						features[key] = false;
					}else{
						features[key] = true;
					}
				});
				this.selectedFeatures = features;
			}
		}else if (type === 'features'){

			let interactionsToBeUpdated;
			let count = null;
			let countArr = [];
			forOwn(features, function(value, key) {
				if(value === false){
					count  =  (labels[key].match(/\*/g) || []).length;
					countArr.push(count);
				}
			});

			uniq(countArr);

			var newCount;
			for(let i=0; i<countArr.length;i++){

				for (var key in features) {
					var item = features[key];

					newCount  =  (labels[key].match(/\*/g) || []).length;
					if(newCount === countArr[i] && item === true) {
						interactions[countArr[i]] = true;
						break;
					}else{
						interactions[countArr[i]] = false;
					}
				}
				this.selectedInteractions = interactions;
			}

		}
		this.setDataToOriginalData(type);

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
		let labels = cloneDeep(this.chartConfigLabels);
		const oldSeries = cloneDeep(this.chartConfigFilters);
		const that = this;
		this.newSeries = [];
		forOwn(this.chartConfigFilters, function(value) {
			that.newSeries.push(value);
		});

		type === 'features' ? this.addOrRemoveParams(labels,oldSeries) : this.addOrRemoveIneractions(labels,oldSeries);

		if(!isNil(this.newSeries)){
			for(let i=0;i<this.newSeries.length;i++){
				let data = this.newSeries[i].data;

				// for each series, a callback function is added, to check if the value is 0, if its zero - a different marker symbol is shown.
				this.newSeries[i].marker = {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				};

				this.newSeries[i].pointPlacement = 'on';

				//remove all the values from the array that are set to null
				data = data.filter(function( element ) {
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
		// this.updateChartVisualization();
		// this.getLineColorsAndWidth();
	}

	/**
	 * Get the colors and line width of each series to fill in the data in table
	 *
	 */
	getLineColorsAndWidth(){

		this.radarChart.series.forEach((value,j) => {
			for(let i=0;i<this.chartVizInfo.length;i++){
				if( i === j){
					this.chartVizInfo[i].XX_LINE_COLOR.lineColor = value.lineColor;
					this.chartVizInfo[i].XX_LINE_WIDTH.lineWidth = value.lineWidth;
				}
			}
		});

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

		forOwn(this.selectedFeatures, function(value, key) {
			if(value === false){
				let pos = 0;
				labels[key] = null;
				for(let  i=0;i<oldSeries.length;i++)  // looping through each of series data - array
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

			/*this.radarChart.series[i].setData(additionalSeries[i].data);*/
			let color = (this.colorService.getRandomColor()).rgb;
			this.radarChart.addSeries({
				name: additionalSeries[i].name,
				data: additionalSeries[i].data,
				color: color,
			});
		}
		this.getLineColorsAndWidth();
	}

	/**
	 * Highcharts config required to render the Radar chart
	 *
	 */
	renderChart(){

		/**
		 * updates the marker symbol to a different one if the value is exactly zero
		 *
		 */
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

		this.radarChart = Highcharts.chart('container', {

			chart: {
				height :600,
				width:1000,
				polar: true,
				showAxes: true,
				type: 'line',
			},

			loading: {
				hideDuration: 500,  // The duration in milliseconds of the fade out effect.
				labelStyle: null,   // CSS styles for the loading label span.
				showDuration: 500,  // The duration in milliseconds of the fade in effect.
				style: null         // CSS styles for the loading screen that covers the plot area.
			},

			title: {
				text: 'Radar Chart',
			},

			pane: {
				size: '80%'
			},

			xAxis: {
				reversed: false,
				startOnTick: true,
				endOnTick: true,
				gridLineColor: '#a2aba0',
				categories : this.labels,
				tickmarkPlacement: 'on',
				labels: {
					useHTML:true,//set to true
					style:{
						width:'150px',
						whiteSpace:'normal'//set to normal
					},
					step: 1,
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
				tickPositions: [-1.2,-1, 0, 1.001],  // -1.2 added to add the smaller inner white circle
				showLastLabel: false,
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
					connectEnds: true
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
				verticalAlign: 'bottom',
				layout: 'horizontal'
			},
			series : this.series,
			/*exporting: {
				showTable: true
			}*/
		});

	}
}

export default radarChartController;


