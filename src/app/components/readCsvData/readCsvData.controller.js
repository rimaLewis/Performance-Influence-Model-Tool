import {assign} from 'lodash';

class readCsvDataController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});
	}

	$onInit(){
		this.editChart = false;
		console.log('normalized values',this.normalizedValuesService);
		this.normalizedValuesService.setNormalizedValues(0.54);
	}

	toggleEditpane(){
		this.editChart = !this.editChart;
	}


	showData(){
		alert(this.fileContent);
		console.log('upload data',this.fileContent);
	}



}

export default readCsvDataController;