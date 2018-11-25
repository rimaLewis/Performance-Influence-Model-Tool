import {assign,forEach, isNil,isEmpty,uniq,zip, map} from 'lodash';

class readCsvDataController {
	constructor($scope, normalizedValuesService,d3Service,$mdSidenav,$element , localStorage,$routeParams){
		assign(this, {$scope, normalizedValuesService,d3Service,$mdSidenav,$element , localStorage ,$routeParams});

		assign(this, {
			disableTextarea: false,
		});

		this.$scope.$watch('vm.fileContent', (newValue) =>
		{
			if(!isNil(newValue)){
				this.disableTextarea = true;
				const csvrawData = newValue;
				this.getChartDataForRadarAndTextplot(csvrawData);
				this.dataForFilters(csvrawData);
				this.dataForInteractions(csvrawData);
			}
		});

		this.$scope.$watch('vm.fileContent', (newValue) =>{
			if(!isNil(newValue)) {
				const csvrawData = newValue;
				this.getChartDataForElephantPlot(csvrawData);
			}
		});

		this.$scope.$watch('vm.fileContentAdded', (newValue) =>
		{
			if(!isNil(newValue)){
				const additionalCsvData = newValue;
				this.dataForFilters(additionalCsvData);
				this.addNewSeriesToRadarAndTextplot(additionalCsvData);
				this.addNewSeriesElephantPlot(additionalCsvData);
			}
		});

	}

	$onInit(){


		const JsonObj =
			{
				0 : 'Group;A;B;C;A*B;D;E;A*C;A*D*B;F;E*D*F\nA;3;6;0;-3;-7;-6;4;9;3;4\nB;1;5;-6;7;-6;0;9;-2;4;-7',
				1 : 'Group;A;B;C;D;E;F;G;H;I;J\nA;24.33;1.13;15.13;-0.047;0;0;-0.18;-17.12;5.11;-2.81',
				2 : 'Group;A;B;C;D;E;F;G;H;I;J\nA;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33',
				3 : 'Group;A;B;C;D;D*A;E;E*C;F;F*D;C*A*D\nA;67.45;05.34;-3.43;34.45;78.45;-34.45;23;45.34;-78.45',
				4 : 'Group;A;B;C;D;C*D;D*A;E;E*C;F;F*B\nA;45.5;78.45;-89.45;-92;10;-07;9.56;-08.54;78.56;.67',
				5 : 'Group;A;B;C;B*C;D;C*D;E;E*B;C*A*B;E*A\nA;67.45;05.34;-3.43;34.45;78.45;-34.45;23;45.34;-78.45;19.56',
				6 : 'Group;A;B;C;D;E;F;G;I;J;K\nA;45;-45;-56;23.23;7;-28.57;-60.56;-85.1;49.2;51.4',
				7 : 'Group;A;B;B*A;C;C*A;D;D*A;C*D;E;E*B*C;E*A*D\nA;-78.7;2.4;-89.34;45.23;67.45;-93.54;63.34;89.23;67.23;',
				8 : 'Group;A;B;C;D;E;F;G;H;I;J\nA;4;67.56;-56.56;-27.78;89.45;4.23;78.34;-61;28.56;34.34\nB;84.34;67.67;-68.23;78.56;89.54;89.45;-25.9;-18;60;67',
				9 : 'Group;A;B;C;A*B;C*B;D;D*A;E;E*A*D;E*C*B;F\nA;56;-09.56;-23;8;-29;-14;34.8;81.67;10;-78.5\nB;4;-82;-68.23;-9;20;92;19;0;78.3;-89.78',
				10 : 'Group;A;B;A*B;C;D;C*D;E;E*B*A;F;F*D\nA;67.45;05.34;-3.43;34.45;78.45;-34.45;23;45.34;-78.45\nB;56;-97;-19;67;29;-94;47;-04;49',
				11 : 'Group;A;B;A*B;C;C*A;E;A*E*B;F;F*D;G\nA;93.54;-63.34;89.23;-67.23;-78.7;-2.4;-89.34;45.23;67.45\nB;20;-67.56;-30.78;49.67;-56.34;49.89;-78.56;39.89;50.56',
				12 : 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\nA;79.8338811051514;-55.0644280308279;-29.9830741501976;196.318533691212;-49.3673619918136;-38.4037002380766;145.167518445143;4.44769753751478;224.591014868327;8.4581473875704;7.24856026096808;30.7537446985415;-5.18875205055668; 1.68090393498785;-3.73892023487385;-8.16039886966587;-9.11429929918398;-4.16795880116297;-28.919436692069;-13.3761810546476;17.4497669828609;-50.3286178466828;37.4179518642293;-1.71715702141449;-25.1226315958356;-53.9788952709672;97.5164921233704;\n B;61.3845681842981;-36.8836136517649;-10.7800399970726;195.698266409178;-32.3190628247197;0;-21.0146860994521;146.413930372454;4.44769753752683;228.932885843837;5.72864500275381;8.494972188367;27.1257046694267;-5.77883201954394;-0.865642306746007;-4.32900020386118;-8.24116959035582;-6.64852377803541;-4.16795880122927;-26.4266128374583;0;0;0;0;0;0;0;\nC;61.8084563635763;-36.8529903400404;-4.17338678752301;182.548489558529;-34.4461618772877;-23.098665499942;146.413930372453;3.7530377373322;228.48817886856;6.03326413091207;8.49497218833112;13.9123982504181;-5.88601361043327;-1.70616938957032;4.43618179474917;29.6158728628314;0;0;0;0;0;0;0;0;0;0;0;0',
				13 : 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\nA;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\nB;85.3;23.45;94.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\nC;26.33;56;2.13;-1.047;54;4.79;3.43;45;-27.00;43\nD;34.33;7.45;33;-1.047;35;4.79;45.43;452;-27.00;53.33\nE;26.33;7.45;2.13;-1.047;65.56;4.79;54.43;87.12;-34.00;54.33\n\nF;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;06.12;20.00;-39.33\nG;26.33;7.45;2.13;6.3;48.6;53.4;9.6;67.5;5.6;-7.33\nH;26.33;7.45;2.13;-2.047;28.56;5.79;4.43;-18.12;-28.00;-8.33\nI;28.33;9.45;4.13;-1.047;27.56;6.79;5.43;-19.12;-29.00;-7.33',

			};

		//read key value from route params
		let id = this.$routeParams.id;
		this.fileContent =  JsonObj[id];

		this.configElement= [];
		this.configElementHeaders = ['GROUP','XX_LINE_WIDTH','XX_LINE_COLOR'];
		this.d3 = this.d3Service.getD3();
		this.selectedFeatures = {};
		this.selectedInteractions = {};

		//for radar and textplot
		this.dataToUpdate = [];
		this.indexForEditData = 0;

		// for elephant plot
		this.allCsvData = [];
		this.allGroups = [];
		this.allLabels = [];
	}



	/**
	 * reads csv data to get the labels, get the count on no of * each labels has.
	 * with these values create the interactions dropdown with all values set to true
	 */
	dataForInteractions(fileContent){

		let interactions = [];
		const lines = fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		forEach(this.labels,function (value){
			var count = ((value.match(/\*/g) || []).length) + 1;
			interactions.push(count);
		});
		this.interactions =  uniq(interactions);
		this.interactions.forEach((d,i ) => {
			this.selectedInteractions[i] = true ;
		});

	}

	/**
	 * reads csv data to get the labels, these labels are displayed in the features dropdown.
	 * all the values are set to true
	 */
	dataForFilters(dataToSplit){

		const lines = dataToSplit.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		this.listOfFeatures = this.labels;
		this.listOfFeatures.forEach((d,i ) => {
			this.selectedFeatures[i] = true ;
		});
		this.dataToUpdate.push(...this.getSeries(dataToSplit));
		this.setTableConfigData();
	}

	/**
	 * reads this.dataToUpdate to create an array of groups,
	 * for each of these groups a new row in table with the corresponding group name is appended to update the chart line colors etc
	 *configElement
	 */
	setTableConfigData(){
		// console.log('setTableConfigData changed');
		const groups = map(this.dataToUpdate, 'name');
		for(let i=this.configElement.length;i<this.dataToUpdate.length;i++) {
			const value = groups[i];
			const newElement = {
				'GROUP': value,
				'XX_LINE_WIDTH': {
					'type': [
						'NUMBER_INPUT'
					],
				},
				'XX_LINE_COLOR': {
					'type': [
						'INPUT_TYPE'
					],
				}
			};
			this.configElement[i] = newElement;
		}
	}


	/**
	 * updates this.groups array to have all the groups added so far.
	 * updates this.arrayData to have all normalized values added so far.
	 * updates dataToUpdateElephant to have all the series added so far.
	 *
	 */
	addNewSeriesElephantPlot(additionalCsvData){

		let dataToUpdateElephant = [];
		const lines = additionalCsvData.split('\n');
		const labelsNew = lines[0].split(';');
		labelsNew.shift();

		let ElephantPlotWithAdditionalCsvData = this.getSeriesForElephantPlot(additionalCsvData);
		this.groups.push(...this.getGroupsForElephantPlot(additionalCsvData));

		let arrayData =zip(...ElephantPlotWithAdditionalCsvData) ;
		this.allGroups.push(this.groups);

		// append the old data with new data of new csv file
		for(let i=0;i<this.arrayData.length;i++){
			this.arrayData[i].push.apply(this.arrayData[i], arrayData[i]);
		}

		let index =0;
		for(let k=0;k<labelsNew.length;k++){
			dataToUpdateElephant[index] = {name : labelsNew[k], data: this.arrayData[k], pointPlacement: 'on' };
			index++;
		}
		this.elephantConfigNew  = {labels : this.groups, series: dataToUpdateElephant};
		this.normalizedValuesService.setAllSeriesForElephantPlot(this.elephantConfigNew);
	}


	/**
	 * reads the csv data and creates the series data with the normalized arrays values that are calculated
	 * returns  array of series, ex: series = [0.3,0.34]
	 */
	getSeriesForElephantPlot(csvrawData){
		let lines = csvrawData.split('\n');
		let elephantSeries = [];
		let groups;
		for(let i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			groups.shift();
			if(!isEmpty(groups))
			{
				//math.abs takes the absolute value only, +a converts string to int
				var additionVal = this.d3.sum(groups, function(value){
					return Math.abs(value);
				});

				var finalArray = [];
				forEach(groups, function(value) {
					var newVal = Math.abs(value) / additionVal;
					var rounded = Math.round(newVal * 1000) / 1000;
					finalArray.push(rounded);
				});
				elephantSeries.push(finalArray);
			}
		}
		return elephantSeries;
	}

	/**
	 *
	 * reads the csv data and writes all the groups to a new groupsArr
	 * returns array of groups. ex : ['Group A', 'Group B']
	 */
	getGroupsForElephantPlot(csvrawData) {

		let lines = csvrawData.split('\n');
		let groupsArr = [];
		let groups;
		for (let i = 1; i < lines.length; i++) {
			groups = lines[i].split(';');
			let groupName = groups[0];
			groups.shift();
			if (!isEmpty(groups)) {
				this.allCsvData.push(groups);
				const name = 'Group ' + groupName;
				groupsArr.push(name);
			}
		}
		return groupsArr;
	}


	/**
	 * set the chart data in a format required by highcharts
	 * elephantConfig = { labels : arrays , series : object }
	 * ex : labels = ['Group A', 'Group B']
	 * ex : series = { name : 'root' , data : [0.232, 0.23]}
	 */
	getChartDataForElephantPlot(csvrawData){

		let elephantConfig;

		const lines = csvrawData.split('\n');
		const labels = lines[0].split(';');
		this.allLabels = labels;
		labels.shift();
		let elephantSeries = this.getSeriesForElephantPlot(csvrawData);
		this.groups = this.getGroupsForElephantPlot(csvrawData);

		this.arrayData;
		this.arrayData = zip(...elephantSeries);
		let index = 0;
		for(let k=0;k<labels.length;k++){
			elephantSeries[index] = {name : labels[k], data: this.arrayData[k], pointPlacement: 'on' };
			index++;
		}
		elephantConfig  = {labels : this.groups, series: elephantSeries};
		this.normalizedValuesService.setAllSeriesForElephantPlot(elephantConfig);
		this.normalizedValuesService.setDataForElephantPlot(elephantConfig);
	}


	/**
	 * return array of labels
	 * @param csv raw data
	 */
	getLabels(csvrawData){
		const lines = csvrawData.split('\n');
		const labels = lines[0].split(';');
		labels.shift();
		return labels;
	}

	/**
	 * return array of series. each serie is an object of the format
	 * series =  {name : 'Group A', data: normalizedArray }
	 * normalizedArray is array of normalized values for that group
	 * @param csv raw data
	 */
	getSeries(csvrawData){
		const eachRow = csvrawData.split('\n');
		let series = [];
		let groups;
		let index = 0;
		for(let i=1;i<eachRow.length;i++){
			groups = eachRow[i].split(';');
			let groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
			{
				//math.abs takes the absolute value only, +a converts string to int
				/*const maxVal = this.d3.max(groups, function(d){
					const a =  Math.abs(d);
					return +a;
				});

				const minVal = this.d3.min(groups, function(d){
					// const a =  Math.abs(d);
					return +d;
				});*/

				const value = this.d3.max(groups, function(d){
					const a =  Math.abs(d);
					return +a;
				});


				const maxVal = value;
				const minVal = -(value);

				// let minVal =  this.d3.min(groups);
				// console.log(groups, minVal,maxVal);
				//console.log('groups',groups,'maxVal',maxVal, 'minVal',minVal);

				// linear scale is used to normalize values, domain is the range from max to min values, range is the output range
				var scale = this.d3.scaleLinear();
				scale.domain([minVal, maxVal]);
				scale.range( [-1, 1]);

				let normalizedArray = [];
				forEach(groups, function(value) {
					const scaled = scale(value);
					const rounded = Math.round(scaled * 10000) / 10000;
					// console.log('value, scaled ,rounded',value, scaled ,rounded);
					normalizedArray.push(rounded);
				});
				series[index] = {name : 'Group ' + groupName, data: normalizedArray };
				index++;
			}
		}
		return series;
	}


	/**
	 * set the data that radar chart and text plot
	 * chartData is an object of the format below
	 * chartDataForRadarAndTextplot = { labels : array of labels, series : array of each series}
	 * @param csv raw data
	 */
	getChartDataForRadarAndTextplot(csvrawData){
		this.chartDataForRadarAndTextplot = {};
		this.labels = this.getLabels(csvrawData);
		this.series = this.getSeries(csvrawData);
		this.chartDataForRadarAndTextplot  = {labels : this.labels, series: this.series};
		this.normalizedValuesService.setNormalizedValues(this.chartDataForRadarAndTextplot);
	}

	/**
	 * set the data that radar chart and text plot
	 * chartData is an object of the format below
	 * additionalSeriesForRadarAndTextplot = { labels : array of labels, series : array of each series}
	 * @param csv raw data
	 */
	addNewSeriesToRadarAndTextplot(additionalCsvData){
		this.additionalSeriesForRadarAndTextplot = {};
		this.labelsNew = this.getLabels(additionalCsvData);
		this.seriesNew = this.getSeries(additionalCsvData);
		this.additionalSeriesForRadarAndTextplot  = {labels : this.labelsNew, series: this.seriesNew};
	}
}

export default readCsvDataController;