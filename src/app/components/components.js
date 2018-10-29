import angular from 'angular';

import barchart from './barChart';
import home from './home';
import readcsvdata from './readCsvData';
import radarchart from './radarChart';
import textplot from './textplot';
import elephantplot from './elephantPlot';
import d3RadarChart from './d3RadarChart';

const components = angular
  .module('app.components', [home, barchart,readcsvdata, radarchart, textplot,elephantplot,d3RadarChart])
  .name;

export default components; 