
export  default class productService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.productList = [1,2,3,4,5];
	}


	setProd(newObj) {
		console.log('add prod called =====');
		this.productList.push(newObj);
		console.log('add prod called =====', this.productList);
	}

	getProd(){
		console.log('get prod called',this.productList);
		return this.productList;
	}
}
