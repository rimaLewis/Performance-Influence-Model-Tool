import angular from 'angular';
import { ElephantPlotComponent} from './elephantPlot.component';
import './elephantPlot.css';

const elephantPlot = angular
	.module('elephantPlot', [])
	.component('elephantPlot', ElephantPlotComponent)
	.name;

export default elephantPlot;