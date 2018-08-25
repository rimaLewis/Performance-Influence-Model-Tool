
export  default class normalizedValuesService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.plotData = {};
		this.elephantPlotData = {};
	}

	setDataForElephantPlot(data) {
		this.elephantPlotData = data;
	}

	getDataForElephantPlot(){
		return this.elephantPlotData;
	}


	setNormalizedValues(data) {
		this.normalizedValues = data;
	}

	getNormalizedValues(){
		return this.normalizedValues;
	}
}
