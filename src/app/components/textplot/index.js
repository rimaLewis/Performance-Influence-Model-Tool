import angular from 'angular';
import { TextPlotComponent} from './textPlot.component';
import './textPlot.css';

const textplot = angular
	.module('textplot', [])
	.component('textPlot', TextPlotComponent)
	.name;

export default textplot;