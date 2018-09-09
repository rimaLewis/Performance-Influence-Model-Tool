import {assign, isNil} from 'lodash';

class elephantPlotController {
	constructor($scope, normalizedValuesService){
		assign(this, {$scope, normalizedValuesService});

		this.$scope.$watch('vm.chartConfig', (newValue) =>{
			if(!isNil(newValue)){
				this.showGraphs();
			}
		});

		this.$scope.$watch('vm.additionalSeries', (newValue) =>{
			if(!isNil(newValue)){
				this.addNewSeries();
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


	addNewSeries(){
		this.series = this.additionalSeries.series;
		this.labels = this.additionalSeries.labels;
		this.renderChart();
	}

	renderChart() {

		this.elephantPlot = Highcharts.chart('container3', {
			chart: {
				type: 'bar',
				width:1000,
				height:600,
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
				title: {
					text: 'LEGEND<br/><span style="font-size: 9px; color: #666; font-weight: normal; text-align:center;"></span>',
				},
				backgroundColor: 'white',
				borderColor: 'grey',
				borderWidth: 1,
				align: 'center',
				verticalAlign: 'bottom',
				// y: 70,
				layout: 'vertical'
			},

			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},

			series: (this.series),
		});

	}


}

export default elephantPlotController;