import {assign} from 'lodash';


class readCsvDataController {
	constructor($scope, normalizedValuesService,d3Service){
		assign(this, {$scope, normalizedValuesService,d3Service});
	}

	$onInit(){
		this.editChart = false;
		console.log('normalized values',this.normalizedValuesService);
		this.normalizedValuesService.setNormalizedValues(0.54);
		this.d3 = this.d3Service.getD3();
		this.d3.selectAll('p')
			.style('color','red')
			.text('This paragraph is appended to');
	}

	toggleEditpane(){
		this.editChart = !this.editChart;
	}


	showData(){
		alert(this.fileContent);
		console.log('upload data',this.fileContent);
		// convert the file content to normalized values
		// use the normalizedvalues service to set the normalized values
	}



}

export default readCsvDataController;