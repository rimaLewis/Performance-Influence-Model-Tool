
export  default class normalizedValuesService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.normalizedValues = [];
		this.labels  = [];
	}

	setLabels(newLabel){
		this.labels.push(newLabel);
	}

	getLabels(){
		return this.labels;
	}

	setNormalizedValues(newObj) {
		this.normalizedValues.push(newObj);
	}

	getNormalizedValues(){
		return this.normalizedValues;
	}
}
