import {assign,forEach, isNil,isEmpty,uniq,zip, map} from 'lodash';


class readCsvDataController {
	constructor($scope, normalizedValuesService,d3Service,$mdSidenav,$element){
		assign(this, {$scope, normalizedValuesService,d3Service,$mdSidenav,$element});

		this.$scope.$watch('vm.fileContent', (newValue) =>
		{
			if(!isNil(newValue)){
				const csvrawData = newValue;
				this.getChartDataForRadarAndTextplot(csvrawData);
				this.dataForFilters(csvrawData);
				this.dataForInteractions(csvrawData);
			}
		});

		this.$scope.$watch('vm.fileContent', (newValue) =>{
			if(!isNil(newValue)) {
				const csvrawData = newValue;
				this.getChartDataForElephantPlot(csvrawData);
			}
		});

		this.$scope.$watch('vm.fileContentAdded', (newValue) =>
		{
			if(!isNil(newValue)){
				const additionalCsvData = newValue;
				this.dataForFilters(additionalCsvData);
				this.addNewSeriesToRadarAndTextplot(additionalCsvData);
				this.addNewSeriesElephantPlot(additionalCsvData);
			}
		});

	}

	$onInit(){
		this.configElement= [];
		this.configElementHeaders = ['GROUP','XX_LINE_WIDTH','XX_LINE_COLOR'];

		this.d3 = this.d3Service.getD3();
		this.selectedFeatures = {};
		this.selectedInteractions = {};

		//for radar and textplot
		this.dataToUpdate = [];
		this.indexForEditData = 0;

		// for elephant plot
		this.allCsvData = [];
		this.allGroups = [];
		this.allLabels = [];
	}

	/**
	 * reads csv data to get the labels, get the count on no of * each labels has.
	 * with these values create the interactions dropdown with all values set to true
	 */
	dataForInteractions(fileContent){

		let interactions = [];
		const lines = fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		forEach(this.labels,function (value){
			var count = (value.match(/\*/g) || []).length;
			interactions.push(count);
		});
		this.interactions =  uniq(interactions);
		this.interactions.forEach((d,i ) => {
			this.selectedInteractions[i] = true ;
		});

	}

	/**
	 * reads csv data to get the labels, these labels are displayed in the features dropdown.
	 * all the values are set to true
	 */
	dataForFilters(dataToSplit){

		const lines = dataToSplit.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		this.listOfFeatures = this.labels;
		this.listOfFeatures.forEach((d,i ) => {
			this.selectedFeatures[i] = true ;
		});
		this.dataToUpdate.push(...this.getSeries(dataToSplit));
		console.log(this.configElement);
		this.setTableConfigData();
	}

	/**
	 * reads this.dataToUpdate to create an array of groups,
	 * for each of these groups a new row in table with the corresponding group name is appended to update the chart line colors etc
	 *configElement
	 */
	setTableConfigData(){
		const groups = map(this.dataToUpdate, 'name');
		for(let i=this.configElement.length;i<this.dataToUpdate.length;i++) {
			const value = groups[i];
			const newElement = {
				'GROUP': value,
				'XX_LINE_WIDTH': {
					'type': [
						'NUMBER_INPUT'
					],
				},
				'XX_LINE_COLOR': {
					'type': [
						'INPUT_TYPE'
					],
				}
			};
			this.configElement[i] = newElement;
		}
	}


	/**
	 * updates this.groups array to have all the groups added so far.
	 * updates this.arrayData to have all normalized values added so far.
	 * updates dataToUpdateElephant to have all the series added so far.
	 *
	 */
	addNewSeriesElephantPlot(additionalCsvData){

		let dataToUpdateElephant = [];
		const lines = additionalCsvData.split('\n');
		const labelsNew = lines[0].split(';');
		labelsNew.shift();

		let ElephantPlotWithAdditionalCsvData = this.getSeriesForElephantPlot(additionalCsvData);
		this.groups.push(...this.getGroupsForElephantPlot(additionalCsvData));

		let arrayData =zip(...ElephantPlotWithAdditionalCsvData) ;
		this.allGroups.push(this.groups);

		// append the old data with new data of new csv file
		for(let i=0;i<this.arrayData.length;i++){
			this.arrayData[i].push.apply(this.arrayData[i], arrayData[i]);
		}

		let index =0;
		for(let k=0;k<labelsNew.length;k++){
			dataToUpdateElephant[index] = {name : labelsNew[k], data: this.arrayData[k], pointPlacement: 'on' };
			index++;
		}
		this.elephantConfigNew  = {labels : this.groups, series: dataToUpdateElephant};
		this.normalizedValuesService.setAllSeriesForElephantPlot(this.elephantConfigNew);
	}


	/**
	 * reads the csv data and creates the series data with the normalized arrays values that are calculated
	 * returns  array of series, ex: series = [0.3,0.34]
	 */
	getSeriesForElephantPlot(csvrawData){
		let lines = csvrawData.split('\n');
		let elephantSeries = [];
		let groups;
		for(let i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			groups.shift();
			if(!isEmpty(groups))
			{
				//math.abs takes the absolute value only, +a converts string to int
				var additionVal = this.d3.sum(groups, function(value){
					return Math.abs(value);
				});

				var finalArray = [];
				forEach(groups, function(value) {
					var newVal = Math.abs(value) / additionVal;
					var rounded = Math.round(newVal * 1000) / 1000;
					finalArray.push(rounded);
				});
				elephantSeries.push(finalArray);
			}
		}
		return elephantSeries;
	}

	/**
	 *
	 * reads the csv data and writes all the groups to a new groupsArr
	 * returns array of groups. ex : ['Group A', 'Group B']
	 */
	getGroupsForElephantPlot(csvrawData) {

		let lines = csvrawData.split('\n');
		let groupsArr = [];
		let groups;
		for (let i = 1; i < lines.length; i++) {
			groups = lines[i].split(';');
			let groupName = groups[0];
			groups.shift();
			if (!isEmpty(groups)) {
				this.allCsvData.push(groups);
				const name = 'Group ' + groupName;
				groupsArr.push(name);
			}
		}
		return groupsArr;
	}


	/**
	 * set the chart data in a format required by highcharts
	 * elephantConfig = { labels : arrays , series : object }
	 * ex : labels = ['Group A', 'Group B']
	 * ex : series = { name : 'root' , data : [0.232, 0.23]}
	 */
	getChartDataForElephantPlot(csvrawData){

		let elephantConfig;

		const lines = csvrawData.split('\n');
		const labels = lines[0].split(';');
		this.allLabels = labels;
		labels.shift();
		let elephantSeries = this.getSeriesForElephantPlot(csvrawData);
		this.groups = this.getGroupsForElephantPlot(csvrawData);

		this.arrayData;
		this.arrayData = zip(...elephantSeries);
		let index = 0;
		for(let k=0;k<labels.length;k++){
			elephantSeries[index] = {name : labels[k], data: this.arrayData[k], pointPlacement: 'on' };
			index++;
		}
		elephantConfig  = {labels : this.groups, series: elephantSeries};
		this.normalizedValuesService.setAllSeriesForElephantPlot(elephantConfig);
		this.normalizedValuesService.setDataForElephantPlot(elephantConfig);
	}


	/**
	 * return array of labels
	 * @param csv raw data
	 */
	getLabels(csvrawData){
		const lines = csvrawData.split('\n');
		const labels = lines[0].split(';');
		labels.shift();
		return labels;
	}

	/**
	 * return array of series. each serie is an object of the format
	 * series =  {name : 'Group A', data: normalizedArray }
	 * normalizedArray is array of normalized values for that group
	 * @param csv raw data
	 */
	getSeries(csvrawData){
		const eachRow = csvrawData.split('\n');
		let series = [];
		let groups;
		let index = 0;
		for(let i=1;i<eachRow.length;i++){
			groups = eachRow[i].split(';');
			let groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				//math.abs takes the absolute value only, +a converts string to int
				const maxVal = this.d3.max(groups, function(d){
					const a =  Math.abs(d);
					return +a;
				});

				const minVal = this.d3.min(groups, function(d){
					const a =  Math.abs(d);
					return +a;
				});

				// linear scale is used to normalize values, domain is the range from max to min values, range is the output range
				const scale = this.d3.scaleLinear();
				scale.domain([minVal, maxVal]);
				scale.range([0, 1]);

				let normalizedArray = [];
				forEach(groups, function(value) {
					const scaled = scale(value);
					const rounded = Math.round(scaled * 1000) / 1000;
					normalizedArray.push(rounded);
				});
				series[index] = {name : 'Group ' + groupName, data: normalizedArray };
				index++;
			}
		}
		return series;
	}


	/**
	 * set the data that radar chart and text plot
	 * chartData is an object of the format below
	 * chartDataForRadarAndTextplot = { labels : array of labels, series : array of each series}
	 * @param csv raw data
	 */
	getChartDataForRadarAndTextplot(csvrawData){
		this.chartDataForRadarAndTextplot = {};
		this.labels = this.getLabels(csvrawData);
		this.series = this.getSeries(csvrawData);
		this.chartDataForRadarAndTextplot  = {labels : this.labels, series: this.series};
		this.normalizedValuesService.setNormalizedValues(this.chartDataForRadarAndTextplot);
	}

	/**
	 * set the data that radar chart and text plot
	 * chartData is an object of the format below
	 * additionalSeriesForRadarAndTextplot = { labels : array of labels, series : array of each series}
	 * @param csv raw data
	 */
	addNewSeriesToRadarAndTextplot(additionalCsvData){
		this.additionalSeriesForRadarAndTextplot = {};
		this.labelsNew = this.getLabels(additionalCsvData);
		this.seriesNew = this.getSeries(additionalCsvData);
		this.additionalSeriesForRadarAndTextplot  = {labels : this.labelsNew, series: this.seriesNew};
	}
}

export default readCsvDataController;