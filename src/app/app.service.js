
export  default class normalizedValuesService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.plotData = {};
		this.elephantPlotData = {};
		this.allSeriesEPlot = [];
	}

	setDataForElephantPlot(data) {
		this.elephantPlotData = data;
	}

	getDataForElephantPlot(){
		return this.elephantPlotData;
	}

	setAllSeriesForElephantPlot(data){
		this.allSeriesEPlot.push(data);
	}

	getAllSeriesForElephantPlot(){
		return this.allSeriesEPlot;
	}


	setNormalizedValues(data) {
		this.normalizedValues = data;
	}

	getNormalizedValues(){
		return this.normalizedValues;
	}
}
