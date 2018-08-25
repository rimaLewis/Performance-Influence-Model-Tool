import {assign, isNil} from 'lodash';

class elephantPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});

		this.$scope.$watch('vm.chartConfig', (newValue) =>{
			if(!isNil(newValue)){
				this.showGraphs();
			}
		});
	}



	$onInit() {
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
	}

	showGraphs(){
		this.data = this.normalizedValuesService.getDataForElephantPlot();
		this.series = this.data.series;
		this.labels = this.data.labels;
		this.renderChart();
	}

	renderChart() {
		Highcharts.chart('container3', {
			chart: {
				type: 'bar',
				width:1000,
			},
			title: {
				text: 'Elephant Plot'
			},
			xAxis: {
				tickmarkPlacement:'on',
				categories: this.labels,
			},
			yAxis: {
				tickmarkPlacement:'on',
				min: 0,
				max: 1,
				startOnTick: true,
				title: {
					text: 'Total Performance'
				}
			},
			legend: {
				reversed: true
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},

			series: this.series
		});

	}


}

export default elephantPlotController;