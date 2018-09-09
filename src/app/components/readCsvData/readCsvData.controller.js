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
		console.log('this.labels -----------',this.labels);
		forEach(this.labels,function (value){
			var count = (value.match(/\*/g) || []).length;
			interactions.push(count);
		});
		this.interactions =  uniq(interactions);
		console.log(this.interactions);
		this.interactions.forEach((d,i ) => {
			this.selectedInteractions[i] = true ;
		});

	}

	dataForFilters(dataToSplit){

		var lines = dataToSplit.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		this.listOfFeatures = this.labels;
		console.log(this.selectedFeatures);
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
		// if not throw an error

	}

	elephantPlotData(){

		this.elephantConfig = {};
		var lines = this.fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();

		this.elephantSeries = [];
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
				this.elephantSeries[index] = {name : 'Group ' + groupName, data: finalArray, pointPlacement: 'on' };
				index++;
			}
		}

		var arrayData = [];
		var groups = [];
		for (var i = 0, l = this.elephantSeries.length; i < l; i++) {
			groups.push(this.elephantSeries[i].name);
			var obj1 = this.elephantSeries[i];
			var obj2 = this.elephantSeries[i+1];
			if(!isNil(obj1) && !isNil(obj2)){
				arrayData = zip(obj1.data,obj2.data);
			}
		}

		var index2 = 0;
		for(var k=0;k<this.labels.length;k++){
			this.elephantSeries[index2] = {name : this.labels[k], data: arrayData[k], pointPlacement: 'on' };
			index2++;
		}

		this.elephantConfig  = {labels : groups, series: this.elephantSeries};
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