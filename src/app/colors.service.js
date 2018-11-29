
export  default class colorsService {
	constructor (){
		this.$onInit();
	}

	$onInit(){
		this.Colors = {};
		this.Colors.names = {
			black: '#000000',
			blue: '#0000ff',
			brown: '#a52a2a',
			darkblue: '#00008b',
			darkgreen: '#006400',
			darkmagenta: '#8b008b',
			darkolivegreen: '#556b2f',
			darkorange: '#ff8c00',
			darkorchid: '#9932cc',
			darkred: '#8b0000',
			darkviolet: '#9400d3',
			fuchsia: '#ff00ff',
			gold: '#ffd700',
			green: '#008000',
			indigo: '#4b0082',
			magenta: '#ff00ff',
			maroon: '#800000',
			navy: '#000080',
			olive: '#808000',
			orange: '#ffa500',
			purple: '#800080',
			red: '#ff0000',
			yellow: '#ffff00'
		};
	}


	getRandomColor(){
		var result;
		var count = 0;
		for (var prop in this.Colors.names)
			if (Math.random() < 1/++count)
				result = prop;
		return { name: result, rgb: this.Colors.names[result]};
	}
}
