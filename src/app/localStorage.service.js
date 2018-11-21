import {assign} from 'lodash';

export  default class localStorage {
	constructor ($window){
		assign(this, {$window});
	}


	/**
	 * Implementation : https://stackoverflow.com/questions/18247130/how-do-i-store-data-in-local-storage-using-angularjs
	 *  F12 - console : To set or retrieve values : localStorage.rima = 'no'
	 * @returns {string | null}
	 */
	getColors(){
		return this.$window.localStorage.getItem('colors');
	}

	setColors(values){
		this.$window.localStorage.setItem( 'colors', values);
	}

	getLineWidth(){
		return this.$window.localStorage.getItem('lineWidth');
	}

	setLineWidth(values){
		this.$window.localStorage.setItem('lineWidth', values);
	}
}
