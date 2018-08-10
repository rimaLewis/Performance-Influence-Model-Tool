import {assign} from 'lodash';

class radarChartController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		this.values = this.normalizedValuesService.getNormalizedValues();

	}
}

export default radarChartController;