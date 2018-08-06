import template from './readCsvData.html';
import readCsvDataController from './readCsvData.controller';


export const readCsvDataComponent = {
	template: template,
	controller : readCsvDataController,
	controllerAs : 'vm',
	bindings :{
		name : '@',
	}
};
