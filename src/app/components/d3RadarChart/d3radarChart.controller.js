import {assign} from 'lodash';

class d3radarChartController {
	constructor(normalizedValuesService,d3Service,colorService){
		assign(this, { normalizedValuesService,d3Service,colorService});

	}


	$onInit() {
		const d3 = this.d3Service.getD3();
		this.data = [];

		const w = 500, h = 500;

		const colorscale = d3.schemeCategory10;

		//Legend titles
		const LegendOptions = ['Smartphone','Tablet'];

		//Data
		const d = [
			[
				{axis:'Email',value:0.59},
				{axis:'Social Networks',value:0.56},
				{axis:'Internet Banking',value:0.42},
				{axis:'News Sportsites',value:0.34},
				{axis:'Search Engine',value:0.48},
				{axis:'View Shopping sites',value:0.14},
				{axis:'Paying Online',value:0.11},
				{axis:'Buy Online',value:0.05},
			],[
				{axis:'Email',value:0.48},
				{axis:'Social Networks',value:0.41},
				{axis:'Internet Banking',value:0.27},
				{axis:'News Sportsites',value:0.28},
				{axis:'Search Engine',value:0.46},
				{axis:'View Shopping sites',value:0.29},
				{axis:'Paying Online',value:0.11},
				{axis:'Buy Online',value:0.14},
			]
		];

		//Options for the Radar chart, other than default
		const mycfg = {
			w: w,
			h: h,
			maxValue: 0.6,
			levels: 3,
			ExtraWidthX: 300
		};

		//Call function to draw the Radar chart
		//Will expect that data is in %'s
		this.RadarChart('#chart', d, mycfg);
	}

	
		//For a bit of extra information check the blog about it:
		//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

	RadarChart(id, d, options){
		const w = 500, h = 500;
		const d3 = this.d3Service.getD3();
		const colorscale = d3.schemeCategory10;

		//Legend titles
		const LegendOptions = ['Smartphone','Tablet'];

		const cfg = {
			radius: 5,
			w: 600,
			h: 600,
			factor: 1,
			factorLegend: .85,
			levels: 3,
			maxValue: 0,
			radians: 2 * Math.PI,
			opacityArea: 0.5,
			ToRight: 5,
			TranslateX: 80,
			TranslateY: 30,
			ExtraWidthX: 100,
			ExtraWidthY: 100,
			color: d3.schemeCategory10,
		};

		if('undefined' !== typeof options){
			for(const i in options){
				if('undefined' !== typeof options[i]){
					cfg[i] = options[i];
				}
			}
		}
		cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){ return d3.max(i.map(function(o){return o.value;}));}));
		const allAxis = (d[0].map(function(i, j){return i.axis;}));
		const total = allAxis.length;
		const radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
		const Format = d3.format('%');
		d3.select(id).select('svg').remove();

		const g = d3.select(id)
					.append('svg')
					.attr('width', cfg.w+cfg.ExtraWidthX)
					.attr('height', cfg.h+cfg.ExtraWidthY)
					.append('g')
					.attr('transform', 'translate(' + cfg.TranslateX + ',' + cfg.TranslateY + ')');
				

		let tooltip;

		//Circular segments
		for(let j=0; j<cfg.levels-1; j++){
			const levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
			g.selectAll('.levels')
						.data(allAxis)
						.enter()
						.append('svg:line')
						.attr('x1', function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
						.attr('y1', function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
						.attr('x2', function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
						.attr('y2', function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
						.attr('class', 'line')
						.style('stroke', 'grey')
						.style('stroke-opacity', '0.75')
						.style('stroke-width', '0.3px')
						.style('fill', 'red')
						.attr('transform', 'translate(' + (cfg.w/2-levelFactor) + ', ' + (cfg.h/2-levelFactor) + ')');
		}

		//Text indicating at what % each level is
		for(let j=0; j<cfg.levels; j++){
			const levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
			g.selectAll('.levels')
						.data([1]) //dummy data
						.enter()
						.append('svg:text')
						.attr('x', function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
						.attr('y', function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
						.attr('class', 'legend')
						.style('font-family', 'sans-serif')
						.style('font-size', '10px')
						.attr('transform', 'translate(' + (cfg.w/2-levelFactor + cfg.ToRight) + ', ' + (cfg.h/2-levelFactor) + ')')
						.attr('fill', '#737373')
						.text(Format((j+1)*cfg.maxValue/cfg.levels));
		}

		let series = 0;

		const axis = g.selectAll('.axis')
					.data(allAxis)
					.enter()
					.append('g')
					.attr('class', 'axis');

		axis.append('line')
					.attr('x1', cfg.w/2)
					.attr('y1', cfg.h/2)
					.attr('x2', function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
					.attr('y2', function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
					.attr('class', 'line')
					.style('stroke', 'grey')
					.style('stroke-width', '1px');

		axis.append('text')
					.attr('class', 'legend')
					.text(function(d){return d;})
					.style('font-family', 'sans-serif')
					.style('font-size', '11px')
					.attr('text-anchor', 'middle')
					.attr('dy', '1.5em')
					.attr('transform', function(d, i){return 'translate(0, -10)';})
					.attr('x', function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
					.attr('y', function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


		d.forEach(function(y, x){
			const dataValues = [];
			g.selectAll('.nodes')
						.data(y, function(j, i){
							dataValues.push([
								cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
								cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
							]);
						});
			dataValues.push(dataValues[0]);
			g.selectAll('.area')
						.data([dataValues])
						.enter()
						.append('polygon')
						.attr('class', 'radar-chart-serie'+series)
						.style('stroke-width', '2px')
						.style('stroke',  cfg.color[series])
						.attr('points',function(d) {
							let str='';
							for(let pti=0;pti<d.length;pti++){
								str=str+d[pti][0]+','+d[pti][1]+' ';
							}
							return str;
						})
						.style('fill', function(j, i) {return cfg.color[series];} )
						.style('fill-opacity', cfg.opacityArea)
						.on('mouseover', function (d){

							const z = 'polygon.'+ d3.select(this).attr('class');
							g.selectAll('polygon')
								.transition(200)
								.style('fill-opacity', 0.1);
							g.selectAll(z)
								.transition(200)
								.style('fill-opacity', .7);
						})
						.on('mouseout', function(){
							g.selectAll('polygon')
								.transition(200)
								.style('fill-opacity', cfg.opacityArea);
						});
			series++;
		});
		series=0;


		d.forEach(function(y, x){
			const dataValues = [];
			g.selectAll('.nodes')
						.data(y).enter()
						.append('svg:circle')
						.attr('class', 'radar-chart-serie'+series)
						.attr('r', cfg.radius)
						.attr('alt', function(j){return Math.max(j.value, 0);})
						.attr('cx', function(j, i){
							dataValues.push([
								cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
								cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
							]);
							return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
						})
						.attr('cy', function(j, i){
							return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
						})
						.attr('data-id', function(j){return j.axis;})
						.style('fill', function(d, i){ return cfg.color[series]; }).style('fill-opacity', .9)
						.on('mouseover', function (d){

							const newX =  parseFloat(d3.select(this).attr('cx')) - 10;
							const newY =  parseFloat(d3.select(this).attr('cy')) - 5;

							tooltip
								.attr('x', newX)
								.attr('y', newY)
								.text(Format(d.value))
								.transition(200)
								.style('opacity', 1);

							const z = 'polygon.'+d3.select(this).attr('class');
							g.selectAll('polygon')
								.transition(200)
								.style('fill-opacity', 0.1);
							g.selectAll(z)
								.transition(200)
								.style('fill-opacity', .7);
						})
						.on('mouseout', function(){
							tooltip
								.transition(200)
								.style('opacity', 0);
							g.selectAll('polygon')
								.transition(200)
								.style('fill-opacity', cfg.opacityArea);
						})
						.append('svg:title')
						.text(function(j){return Math.max(j.value, 0);});

			series++;
		});

		//Tooltip
		tooltip = g.append('text')
					.style('opacity', 0)
					.style('font-family', 'sans-serif')
					.style('font-size', '13px');


		////////////////////////////////////////////
		/////////// Initiate legend ////////////////
		////////////////////////////////////////////

		const svg = d3.select('#body')
			.selectAll('svg')
			.append('svg')
			.attr('width', w+300)
			.attr('height', h);

		//Create the title for the legend
		const text = svg.append('text')
			.attr('class', 'title')
			.attr('transform', 'translate(90,0)')
			.attr('x', w - 70)
			.attr('y', 10)
			.attr('font-size', '12px')
			.attr('fill', '#404040')
			.text('What % of owners use a specific service in a week');

		//Initiate Legend
		const legend = svg.append('g')
			.attr('class', 'legend')
			.attr('height', 100)
			.attr('width', 200)
			.attr('transform', 'translate(90,20)')
		;

		//Create colour squares
		legend.selectAll('rect')
			.data(LegendOptions)
			.enter()
			.append('rect')
			.attr('x', w - 65)
			.attr('y', function(d, i){ return i * 20;})
			.attr('width', 10)
			.attr('height', 10)
			.style('fill', function(d, i){ return colorscale[i];})
		;

		//Create text next to squares
		legend.selectAll('text')
			.data(LegendOptions)
			.enter()
			.append('text')
			.attr('x', w - 52)
			.attr('y', function(d, i){ return i * 20 + 9;})
			.attr('font-size', '11px')
			.attr('fill', '#737373')
			.text(function(d) { return d; })
		;
	}

}

export default d3radarChartController;


