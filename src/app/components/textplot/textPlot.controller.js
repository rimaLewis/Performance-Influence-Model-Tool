import {assign} from 'lodash';

class textPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		const data = this.normalizedValuesService.getNormalizedValues();
		console.log('data', data);
		console.log(this.name);
		console.log(this.fileContent);
	}

}

export default textPlotController;