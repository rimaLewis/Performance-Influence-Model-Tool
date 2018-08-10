
export  default class normalizedValuesService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.normalizedValues = [];
	}


	setNormalizedValues(newObj) {
		console.log('add prod called =====');
		this.normalizedValues.push(newObj);
		console.log('add prod called =====', this.normalizedValues);
	}

	getNormalizedValues(){
		console.log('get prod called',this.normalizedValues);
		return this.normalizedValues;
	}
}
