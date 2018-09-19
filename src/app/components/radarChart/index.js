import angular from 'angular';
import { RadarChartComponent} from './radarChart.component';
import './radarChart.css';

const radarchart = angular
	.module('radarchart', ['color.picker'])
	.component('radarChart', RadarChartComponent)
	.name;

export default radarchart;