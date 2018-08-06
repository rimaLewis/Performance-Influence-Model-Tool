import template from './home.html';
import homeController from './home.controller';
import './home.css';

export const HomeComponent = {
	template: template,
	controller: homeController,
	controllerAs : 'vm',
};
