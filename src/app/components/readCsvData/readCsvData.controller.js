import {assign,forEach, isNil,isEmpty,uniq,zip,concat} from 'lodash';


class readCsvDataController {
	constructor($scope, normalizedValuesService,d3Service){
		assign(this, {$scope, normalizedValuesService,d3Service});

		this.$scope.$watch('vm.fileContent', (newValue) => {
			if(!isNil(newValue)){
				this.radarAndTextPlotData();
				this.dataForFilters(this.fileContent);
				this.dataForInteractions(this.fileContent);
				this.elephantPlotData();
			}
		});

		this.$scope.$watch('vm.fileContentAdded', (newValue) => {
			if(!isNil(newValue)){
				this.addNewSeries();
				this.addNewSeriesElephant();
			}
		});
	}


	$onInit(){
		this.editChart = false;
		this.normalizedValuesService = this.normalizedValuesService;
		this.d3 = this.d3Service.getD3();
		this.selectedFeatures = {};
		this.selectedInteractions = {};
		this.dataToUpdate = [];
		this.indexForEditData = 0;
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
		var fileContent = this.fileContentAdded;
		this.labelsNew = this.csvToLabels(fileContent);
		this.seriesNew = this.csvToChartData(fileContent);
		this.plotDataNewSeries  = {labels : this.labelsNew, series: this.seriesNew};
		this.dataForFilters(this.fileContentAdded);

	}

	addNewSeriesElephant(){
		var newFileContent = this.fileContentAdded;
		var oldFileContent = this.fileContent;

		this.labelsOld = this.csvToLabels(oldFileContent);
		this.seriesOld = this.csvToElephantData(oldFileContent);

		this.labelsNew = this.csvToLabels(newFileContent);
		this.seriesNew = this.csvToElephantData(newFileContent);

		var finalArray = concat(this.seriesOld,this.seriesNew);
		this.addNewElephantSeries = [];

		var arrayData = [];
		var groups = [];
		for (var i = 0, l = finalArray.length; i < l; i++) {
			groups.push(finalArray[i].name);
			var obj1 = finalArray[i];
			var obj2 = finalArray[i+1];
			var obj3 = finalArray[i+2];
			var obj4 = finalArray[i+3];
			if(!isNil(obj1) && !isNil(obj2) && !isNil(obj3)&& !isNil(obj4)){

				arrayData = zip(obj1.data,obj2.data,obj3.data,obj4.data);
			}
		}
		var index = 0;
		for(var k=0;k<this.labelsNew.length;k++){
			this.addNewElephantSeries[index] = {name : this.labelsNew[k], data: arrayData[k], pointPlacement: 'on' };
			index++;
		}

		this.plotNewSeriesElephant  = {labels : groups, series: this.addNewElephantSeries};

	}

	csvToLabels(data){
		this.plotData = {};
		var lines = data.split('\n');
		var labels = lines[0].split(';');
		labels.shift();
		return labels;
	}

	csvToChartData(data){

		this.plotData = {};
		var lines = data.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		var series = [];
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
				series[index] = {name : 'Group ' + groupName, data: normalizedArray, marker: {
					symbolCallback: function() {
						if( this.y === 0)
							return 'circle';
					}
				}, pointPlacement: 'on' };
				index++;
			}
		}
		return series;

	}

	csvToElephantData(data){
		this.elephantConfig = {};
		var lines = data.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();

		var elephantSeries = [];
		var groups;
		var index = 0;
		for(var i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			var groupName = groups[0];
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
				elephantSeries[index] = {name : 'Group ' + groupName, data: finalArray, pointPlacement: 'on' };
				index++;
			}
		}
		return elephantSeries;

	}

	elephantPlotData(){
		var fileContent = this.fileContent;
		this.labels = this.csvToLabels(fileContent);
		this.series = this.csvToElephantData(fileContent);
		this.elephantSeries = [];

		var arrayData = [];
		var groups = [];
		for (var i = 0, l = this.series.length; i < l; i++) {
			groups.push(this.series[i].name);
			var obj1 = this.series[i];
			var obj2 = this.series[i+1];
			if(!isNil(obj1) && !isNil(obj2)){
				arrayData = zip(obj1.data,obj2.data);
			}
		}

		var index = 0;
		for(var k=0;k<this.labels.length;k++){
			this.elephantSeries[index] = {name : this.labels[k], data: arrayData[k], pointPlacement: 'on' };
			index++;
		}

		this.elephantConfig  = {labels : groups, series: this.elephantSeries};
		this.normalizedValuesService.setDataForElephantPlot(this.elephantConfig);
	}

	radarAndTextPlotData(){
		var fileContent = this.fileContent;
		this.labels = this.csvToLabels(fileContent);
		this.series = this.csvToChartData(fileContent);
		this.plotData  = {labels : this.labels, series: this.series};
		this.normalizedValuesService.setNormalizedValues(this.plotData);
	}

}

export default readCsvDataController;