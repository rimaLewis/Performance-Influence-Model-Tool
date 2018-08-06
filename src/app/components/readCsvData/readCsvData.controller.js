

class readCsvDataController {
	constructor(){}

	$onInit(){
		this.dynamicExpression = 'from the parent controller';
		this.in = 'from the parent controller';
		console.log(this.name);
		this.editChart = false;
		console.log('inside the home controller');
		this.outervariable = 'from the child controller';
	}

	toggleEditpane(){
		console.log('edit pane called');
		this.editChart = !this.editChart;
	}

	showData(){
		alert(this.fileContent);
	}

}

export default readCsvDataController;