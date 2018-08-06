
import angular from 'angular';

import barchart from './barChart';
import home from './home';
import readcsvdata from './readCsvData';

// import about from './about';
// import users from './users';

const components = angular
  .module('app.components', [home, barchart,readcsvdata])
  .name;

export default components; 