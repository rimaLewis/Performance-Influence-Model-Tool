import {assign} from 'lodash';



export  default class localStorage {
	constructor ($window){
		assign(this, {$window});
		this.$onInit();
	}

	$onInit(){
		this.colorRadar = 'red';
		this.$window.localStorage.setItem('rima','7356353');
	}

	/**
	 * Implementation : https://stackoverflow.com/questions/18247130/how-do-i-store-data-in-local-storage-using-angularjs
	 *  F12 - console : To set or retrieve values : localStorage.rima = 'no'
	 * @returns {string | null}
	 */
	getcolors(){
		const value = this.$window.localStorage.getItem('rima');
		return value;
	}
}
