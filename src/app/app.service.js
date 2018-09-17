
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
		console.log('after setting the data in service', this.allSeriesEPlot);
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
