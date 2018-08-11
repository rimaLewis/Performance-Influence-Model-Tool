import {assign} from 'lodash';

class radarChartController {
	constructor($scope, normalizedValuesService,d3Service){
		assign(this, {$scope, normalizedValuesService,d3Service});
	}


	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		this.values = this.normalizedValuesService.getNormalizedValues();
		this.d3 = this.d3Service.getD3();

		var dataset= [{
			'dt': '2000-01-01',
			'AverageTemperature': 3.845,
			'AverageTemperatureUncertainty': 0.127,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-02-01',
			'AverageTemperature': 6.587000000000001,
			'AverageTemperatureUncertainty': 0.154,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-03-01',
			'AverageTemperature': 7.872000000000001,
			'AverageTemperatureUncertainty': 0.247,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-04-01',
			'AverageTemperature': 10.067,
			'AverageTemperatureUncertainty': 0.202,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-05-01',
			'AverageTemperature': 15.450999999999999,
			'AverageTemperatureUncertainty': 0.3,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-06-01',
			'AverageTemperature': 17.666,
			'AverageTemperatureUncertainty': 0.18,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-07-01',
			'AverageTemperature': 16.954,
			'AverageTemperatureUncertainty': 0.233,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-08-01',
			'AverageTemperature': 19.512,
			'AverageTemperatureUncertainty': 0.317,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-09-01',
			'AverageTemperature': 16.548000000000002,
			'AverageTemperatureUncertainty': 0.185,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-10-01',
			'AverageTemperature': 11.675999999999998,
			'AverageTemperatureUncertainty': 0.194,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-11-01',
			'AverageTemperature': 8.027000000000001,
			'AverageTemperatureUncertainty': 0.205,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2000-12-01',
			'AverageTemperature': 6.671,
			'AverageTemperatureUncertainty': 0.318,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-01-01',
			'AverageTemperature': 4.511,
			'AverageTemperatureUncertainty': 0.379,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-02-01',
			'AverageTemperature': 5.447,
			'AverageTemperatureUncertainty': 0.195,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-03-01',
			'AverageTemperature': 8.368,
			'AverageTemperatureUncertainty': 0.35200000000000004,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-04-01',
			'AverageTemperature': 8.958,
			'AverageTemperatureUncertainty': 0.163,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-07-01',
			'AverageTemperature': 19.456,
			'AverageTemperatureUncertainty': 0.189,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-08-01',
			'AverageTemperature': 19.921,
			'AverageTemperatureUncertainty': 0.16,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-10-01',
			'AverageTemperature': 14.532,
			'AverageTemperatureUncertainty': 0.289,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-11-01',
			'AverageTemperature': 6.327000000000001,
			'AverageTemperatureUncertainty': 0.32299999999999995,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2001-12-01',
			'AverageTemperature': 2.725,
			'AverageTemperatureUncertainty': 0.237,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2002-01-01',
			'AverageTemperature': 4.803999999999999,
			'AverageTemperatureUncertainty': 0.256,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2002-02-01',
			'AverageTemperature': 7.775,
			'AverageTemperatureUncertainty': 0.124,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		},
		{
			'dt': '2012-09-01',
			'AverageTemperature': 15.349,
			'AverageTemperatureUncertainty': 0.354,
			'City': 'Paris',
			'Country': 'France',
			'Latitude': '49.03N',
			'Longitude': '2.45E'
		}];

		var series,
			months,
			minVal,
			maxVal,
			w = 400,
			h = 400,
			vizPadding = {
				top: 10,
				right: 0,
				bottom: 15,
				left: 0
			},
			radius,
			radiusLength,
			color;


		series = [[]];
		var nbannee=Math.floor(dataset.length/12);
		var annee=dataset[0].dt[2].concat(dataset[0].dt[3]);

		var color = this.d3.scaleOrdinal()
			.range(['#9eb36f', '#cadd9e', '#f2efbe', '#e3bf6b', '#c87572']);
		months = [1,2,3,4,5,6,7,8,9,10,11,12];

		for (i=0; i<dataset.length; i+=1) {
			var anneeactuelle=dataset[i].dt[2].concat(dataset[i].dt[3]);
			if (anneeactuelle!=annee){
				series.push([]);
				annee=dataset[i].dt[2].concat(dataset[i].dt[3]);
			}
			series[series.length-1].push(dataset[i].AverageTemperature);
		}

		minVal=-5;
		maxVal=5;

		//to complete the radial lines
		for (i = 0; i < series.length; i += 1) {
			series[i].push(series[i][0]);
		}

		var viz = this.d3.select('#viz')
			.append('svg')
			.attr('width', w)
			.attr('height', h)
			.attr('class', 'vizSvg');

		var vizBody = viz.append('g')
			.attr('id', 'contenant');


		var heightCircleConstraint,
			widthCircleConstraint,
			circleConstraint,
			centerXPos,
			centerYPos;

		//need a circle so find constraining dimension
		heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
		widthCircleConstraint = w - vizPadding.left - vizPadding.right;
		circleConstraint = this.d3.min([
			heightCircleConstraint, widthCircleConstraint]);

		radius = this.d3.scaleLinear().domain([minVal, maxVal])
			.range([0, (circleConstraint / 2)]);
		radiusLength = radius(maxVal);

		//attach everything to the group that is centered around middle
		centerXPos = widthCircleConstraint / 2 + vizPadding.left;
		centerYPos = heightCircleConstraint / 2 + vizPadding.top;

		vizBody.attr('transform',
			'translate(' + centerXPos + ', ' + centerYPos + ')');


		var radialTicks = radius.ticks(3),
			i,
			circleAxes,
			lineAxes;

		vizBody.selectAll('.circle-ticks').remove();
		vizBody.selectAll('.line-ticks').remove();

		circleAxes = vizBody.selectAll('.circle-ticks')
			.data(radialTicks)
			.enter().append('g')
			.attr('class', 'circle-ticks');

		circleAxes.append('circle')
			.attr('r', function (d, i) {
				return radius(d);
			})
			.attr('class', 'circle')
			.style('stroke', '#CCC')
			.style('fill','none')
			.style('stroke-width', function(d, i) {
				if (i > 0) {
					return '1px';
				} else {
					return '0px';
				}
			})
			.style('stroke-dasharray',function(d, i) {
				if (i >= 0) {
					return '5,5';
				}
			});

		circleAxes.append('text')
			.attr('text-anchor', 'middle')
			.attr('dy', function (d) {
				return -1 * radius(d);
			})
			.text(String);

		lineAxes = vizBody.selectAll('.line-ticks')
			.data(months)
			.enter().append('g')
			.attr('transform', function (d, i) {
				return 'rotate(' + ((i / months.length * 360) - 90) +
					')translate(' + radius(maxVal) + ')';
			})
			.attr('class', 'line-ticks');


		lineAxes.append('line')
			.attr('x2', -1 * radius(maxVal))
			.style('stroke', '#CCC')
			.style('fill', 'none');

		lineAxes.append('svg:text')
			.text(String)
			.attr('text-anchor', 'middle')
			.attr('transform', function (d, i) {
				return (i / months.length * 360) < 180 ? null : 'rotate(180)';
			});

		var radialLineGenerator=this.d3.radialLine();

		radialLineGenerator
			.radius(function (d,i) {
				return radius(d-series[0][i]);})
			.angle(function (d, i) {
				if (i === 12) {
					i = 0;
				} //close the line
				return (i / 12) * 2 * Math.PI;
			});


		color=this.d3.scaleLinear()
			.domain([0,series.length])
			.range(['blue','red']);

		var op= this.d3.scaleLinear().domain([0,series.length]).range([0,1]);

		var groups = vizBody.selectAll('.series')
			.data(series)
			.enter()
			.append('g')
			.attr('class', 'series')
			.style('fill', function (d, i) {
				return color(i);
			})
			.style('stroke', function (d, i) {
				return color(i);
			})
			.style('opacity',function(d, i) {
				return op(i);
			})
			.append('path')
			.attr('class', 'line')
			.style('stroke-width', 1)
			.style('fill', 'none')
			.attr('d', radialLineGenerator);

		//groups.exit().remove();
	}
}

export default radarChartController;