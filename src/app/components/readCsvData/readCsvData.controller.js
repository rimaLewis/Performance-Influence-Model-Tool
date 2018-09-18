import {assign,forEach, isNil,isEmpty,uniq,zip} from 'lodash';


class readCsvDataController {
	constructor($scope, normalizedValuesService,d3Service){
		assign(this, {$scope, normalizedValuesService,d3Service});

		this.$scope.$watch('vm.fileContent', (newValue) =>
		{
			if(!isNil(newValue)){
				this.radarAndTextPlotData();
				this.dataForFilters(this.fileContent);
				this.dataForInteractions(this.fileContent);
			}
		});

		this.$scope.$watch('vm.fileContent', (newValue) =>{
			if(!isNil(newValue)) {
				this.elephantPlotData();
			}
		});

		this.$scope.$watch('vm.fileContentAdded', (newValue) =>
		{
			if(!isNil(newValue)){
				this.addNewSeries();
				this.addNewSeriesElephantPlot();
			}
		});



	}


	$onInit(){
		this.d3 = this.d3Service.getD3();
		this.selectedFeatures = {};
		this.selectedInteractions = {};

		//for radar and textplot
		this.dataToUpdate = [];
		this.indexForEditData = 0;

		// for elephant plot
		this.dataToUpdateElephant = [];
		this.allCsvData = [];
		this.allGroups = [];
		this.allLabels = [];
	}

	dataForInteractions(fileContent){

		var interactions = [];
		var lines = fileContent.split('\n');
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

	dataForFilters(dataToSplit){

		var lines = dataToSplit.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		this.listOfFeatures = this.labels;
		this.listOfFeatures.forEach((d,i ) => {
			this.selectedFeatures[i] = true ;
		});

		var groups;

		for(var i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			var groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				//math.abs takes the absolute value only, +a converts string to int
				var maxVal = this.d3.max(groups, function(d,i){
					var a =  Math.abs(d);
					return +a;
				});
				var minVal = this.d3.min(groups, function(d,i){
					var a =  Math.abs(d);
					return +a;
				});

				// linear scale is used to normalize values, domain is the range from max to min values, range is the output range
				var scale = this.d3.scaleLinear();
				scale.domain([minVal, maxVal]);
				scale.range([0, 1]);

				let normalizedArray = [];
				forEach(groups, function(value) {
					var scaled = scale(value);
					var rounded = Math.round(scaled * 1000) / 1000;
					normalizedArray.push(rounded);
				});
				this.dataToUpdate[this.indexForEditData] = {name : 'Group ' + groupName, data: normalizedArray};
				this.indexForEditData++;
			}
		}
	}

	addNewSeries(){

		//check if all the labels are same

		// if same compute the new series data
		this.plotDataNewSeries = {};
		var lines = this.fileContentAdded.split('\n');
		this.labelsNew = lines[0].split(';');
		this.labelsNew.shift();
		this.seriesNew = [];
		var groups;
		var index = 0;
		for(var i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			var groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				//math.abs takes the absolute value only, +a converts string to int
				var maxVal = this.d3.max(groups, function(d,i){
					var a =  Math.abs(d);
					return +a;
				});
				var minVal = this.d3.min(groups, function(d,i){
					var a =  Math.abs(d);
					return +a;
				});

				// linear scale is used to normalize values, domain is the range from max to min values, range is the output range
				var scale = this.d3.scaleLinear();
				scale.domain([minVal, maxVal]);
				scale.range([0, 1]);

				let normalizedArray = [];
				forEach(groups, function(value) {
					var scaled = scale(value);
					var rounded = Math.round(scaled * 1000) / 1000;
					normalizedArray.push(rounded);
				});
				this.seriesNew[index] = {name : 'Group ' + groupName, data: normalizedArray, marker: {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				}, pointPlacement: 'on' };
				index++;
			}
		}
		this.plotDataNewSeries  = {labels : this.labelsNew, series: this.seriesNew};
		this.dataForFilters(this.fileContentAdded);
	}


	addNewSeriesElephantPlot(){

		var lines = this.fileContentAdded.split('\n');

		var labelsNew = lines[0].split(';');
		labelsNew.shift();
		this.dataToUpdateElephant = [];
		var groups;
		var index = 0;
		var index2= 0;
		for(var i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			var groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				this.allCsvData.push(groups);
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
				this.dataToUpdateElephant.push(finalArray);
				const name = 'Group ' + groupName;
				this.groups.push(name);
			}
		}

		var arrayData = [];
		arrayData =zip(...this.dataToUpdateElephant) ;
		this.allGroups.push(this.groups);
		// append the old data with new data of new csv file
		for(var j=0;j<this.arrayData.length;j++){
			this.arrayData[j].push.apply(this.arrayData[j], arrayData[j]);
		}

		for(var k=0;k<labelsNew.length;k++){
			this.dataToUpdateElephant[index2] = {name : labelsNew[k], data: this.arrayData[k], pointPlacement: 'on' };
			index2++;
		}
		this.elephantConfigNew  = {labels : this.groups, series: this.dataToUpdateElephant};
		this.normalizedValuesService.setAllSeriesForElephantPlot(this.elephantConfigNew);
	}

	elephantPlotData(){

		this.elephantConfig = {};
		var lines = this.fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.allLabels = this.labels;
		this.labels.shift();
		this.elephantSeries = [];
		this.groups = [];
		var groups;
		var index = 0;
		for(var i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			var groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				this.allCsvData.push(groups);

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
				this.elephantSeries.push(finalArray);
				const name = 'Group ' + groupName;
				this.groups.push(name);
			}
		}

		this.arrayData = [];
		this.arrayData = zip(...this.elephantSeries);
		var index2 = 0;
		for(var k=0;k<this.labels.length;k++){
			this.elephantSeries[index2] = {name : this.labels[k], data: this.arrayData[k], pointPlacement: 'on' };
			index2++;
		}
		this.elephantConfig  = {labels : this.groups, series: this.elephantSeries};
		this.normalizedValuesService.setAllSeriesForElephantPlot(this.elephantConfig);
		this.normalizedValuesService.setDataForElephantPlot(this.elephantConfig);
	}

	radarAndTextPlotData(){

		this.plotData = {};
		var lines = this.fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		this.series = [];
		var groups;
		var index = 0;
		for(var i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			var groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				//math.abs takes the absolute value only, +a converts string to int
				var maxVal = this.d3.max(groups, function(d,i){
					var a =  Math.abs(d);
					return +a;
				});
				var minVal = this.d3.min(groups, function(d,i){
					var a =  Math.abs(d);
					return +a;
				});

				// linear scale is used to normalize values, domain is the range from max to min values, range is the output range
				var scale = this.d3.scaleLinear();
				scale.domain([minVal, maxVal]);
				scale.range([0, 1]);

				let normalizedArray = [];
				forEach(groups, function(value) {
					var scaled = scale(value);
					var rounded = Math.round(scaled * 1000) / 1000;
					normalizedArray.push(rounded);
				});
				this.series[index] = {name : 'Group ' + groupName, data: normalizedArray, marker: {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				}, pointPlacement: 'on' };
				index++;
			}
		}
		this.plotData  = {labels : this.labels, series: this.series};
		this.normalizedValuesService.setNormalizedValues(this.plotData);
	}

}

export default readCsvDataController;