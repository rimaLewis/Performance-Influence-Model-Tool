import angular from 'angular';
import { D3RadarChartComponent} from './d3radarChart.component';
import './d3radarChart.css';

const d3radarchart = angular
	.module('d3radarchart', ['color.picker'])
	.component('d3radarChart', D3RadarChartComponent)
	.name;

export default d3radarchart;