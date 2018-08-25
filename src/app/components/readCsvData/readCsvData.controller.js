import {assign,forEach, map, isNil,isEmpty} from 'lodash';


class readCsvDataController {
	constructor($scope, normalizedValuesService,d3Service){
		assign(this, {$scope, normalizedValuesService,d3Service});

		this.$scope.$watch('vm.fileContent', (newValue) =>
		{
			if(!isNil(newValue)){
				this.radarAndTextPlotData();
			}
		});

		this.$scope.$watch('vm.fileContent', (newValue) =>{
			if(!isNil(newValue)) {
				this.elephantPlotData();
			}
		});
	}

	
	$onInit(){
		this.editChart = false;
		this.normalizedValuesService = this.normalizedValuesService;
		this.d3 = this.d3Service.getD3();

	}

	elephantPlotData(){

		this.elephantConfig = {};
		var lines = this.fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		let series = [];
		var groups;
		var index = 0;
		for(var i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			var groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				console.log(groups);
			}
		}

	}
	radarAndTextPlotData(){
		this.plotData = {};
		var lines = this.fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		let series = [];
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
		this.plotData  = {labels : this.labels, series: series};
		this.normalizedValuesService.setNormalizedValues(this.plotData);
		console.log(this.plotData);

	}





}

export default readCsvDataController;