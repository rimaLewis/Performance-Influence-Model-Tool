
export  default class normalizedValuesService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.plotData = {};
	}


	setNormalizedValues(data) {
		this.normalizedValues = data;
	}

	getNormalizedValues(){
		return this.normalizedValues;
	}
}
