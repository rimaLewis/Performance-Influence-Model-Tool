import {assign} from 'lodash';

class barchartController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		const data = this.normalizedValuesService.getNormalizedValues();
	}

}

export default barchartController;