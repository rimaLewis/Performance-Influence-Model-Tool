import {assign,forEach} from 'lodash';


class readCsvDataController {
	constructor($scope, normalizedValuesService,d3Service){
		assign(this, {$scope, normalizedValuesService,d3Service});
	}

	$onInit(){
		this.editChart = false;
		this.normalizedValuesService = this.normalizedValuesService;
		this.d3 = this.d3Service.getD3();
	}

	toggleEditpane(){
		this.editChart = !this.editChart;
	}


	showData(){
		alert(this.fileContent);
		const data = this.csv2json(this.fileContent);
		console.log('data', data);
		// convert the file content to normalized values
		// use the normalizedvalues service to set the normalized values

		// create the required arrays , for now we assume that the arrays are delimited by semicolon
		var data2 = this.fileContent.split('\n').map(function(row){return row.split(';');});
		var newArray = data2[1];

		var labelsArray = data2[0];
		labelsArray.shift();

		for(var i=0; i<labelsArray.length;i++){
			this.normalizedValuesService.setLabels(labelsArray[i]);
		}

		// remove the first item, since it is the group Label
		newArray.shift();

		//math.abs takes the absolute value only, +a converts string to int
		var maxVal = this.d3.max(newArray, function(d,i){
			var a =  Math.abs(d);
			return +a;
		});
		var minVal = this.d3.min(newArray, function(d,i){
			var a =  Math.abs(d);
			return +a;
		});

		// linear scale is used to normalize values, domain is the range from max to min values, range is the output range
		var scale = this.d3.scaleLinear();
		scale.domain([minVal, maxVal]);
		scale.range([0, 1]);

		// use the scale function to scale each value
		let normalizedArray = [];

		forEach(newArray, function(value) {
			var scaled = scale(value);
			var rounded = Math.round(scaled * 1000) / 1000;
			normalizedArray.push(rounded);
		});

		// push the normalized values to the an array, using the service so that the other components can use this array
		for(var i=0; i<newArray.length;i++){
			this.normalizedValuesService.setNormalizedValues(normalizedArray[i]);
		}

		this.normalizedValues = normalizedArray;
	}





}

export default readCsvDataController;