import angular from 'angular';
import { BarchartComponent} from './barchart.component';
import './barchart.css';

const barchart = angular
	.module('barchart', [])
	.component('barchartComponent', BarchartComponent)
	.name;

export default barchart;