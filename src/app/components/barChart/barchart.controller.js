import {assign} from 'lodash';

class barchartController {
	constructor($scope, productService){
		assign(this, {$scope, productService});
	}

	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		const data = this.productService.getProd();
		console.log('data', data);

		console.log(this.name);
		console.log(this.fileContent);
	}

}

export default barchartController;