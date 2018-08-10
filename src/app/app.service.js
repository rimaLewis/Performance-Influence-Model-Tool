
export  default class normalizedValuesService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.normalizedValues = [0.2,0.11,0.23,0.26,0.87];
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
