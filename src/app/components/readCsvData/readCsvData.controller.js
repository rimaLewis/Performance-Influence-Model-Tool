import {assign,forEach, isNil,isEmpty,uniq,zip, map} from 'lodash';

class readCsvDataController {
	constructor($scope, normalizedValuesService, d3Service, $mdSidenav, $element, localStorage, $routeParams) {
		assign(this, {$scope, normalizedValuesService, d3Service, $mdSidenav, $element, localStorage, $routeParams});

		assign(this, {
			disableTextarea: false,
		});

		this.$scope.$watch('vm.fileContent', (newValue) => {
			if (!isNil(newValue)) {
				this.disableTextarea = true;
				const csvrawData = newValue;
				this.getChartDataForRadarAndTextplot(csvrawData);
				this.dataForFilters(csvrawData);
				this.dataForInteractions(csvrawData);
			}
		});

		this.$scope.$watch('vm.fileContent', (newValue) => {
			if (!isNil(newValue)) {
				const csvrawData = newValue;
				this.getChartDataForElephantPlot(csvrawData);
			}
		});

		this.$scope.$watch('vm.fileContentAdded', (newValue) => {
			if (!isNil(newValue)) {
				const additionalCsvData = newValue;
				this.dataForFilters(additionalCsvData);
				this.addNewSeriesToRadarAndTextplot(additionalCsvData);
				this.addNewSeriesElephantPlot(additionalCsvData);
			}
		});

	}

	$onInit() {

		this.selectedTab = this.$routeParams.selectedIndex;
		const performanceInfluenceModels = {

			0: 'Group;A;B;C;A*B\nA;3;6;0;-3\nB;1;5;-6;7',

			// Most relevant option -1P - Simple
			1: 'Group;A;B;C;D;E;F;G;H;I;J\nA;34.4;26.56;7.56;25;78;56;17;6;34;5',
			2: 'Group;A;B;C;D;E;F;G;H;I;J\nA;5;0.67;-7;4;25;13;-6;0.5;3',
			3: 'Group;A;B;C;D;E;F;G;H;I;J\nA;34.43;56;43;-65;-47;32;76;23;90;49',

			// Most relevant option -1P - Complex
			4: 'Group;A;B;A*B;C;D;C*D;E;F;E*F*A;G\nA;34.4;56.56;7.56;65;78;-56;67;76;34;76',
			5: 'Group;A;B;C;D;E;A*B;C*D;A*B*C;I;J\nA;55;-70;67;0;-6;76;2;34;-6;10',
			6: 'Group;A;B;C;D;A*B;C*D;A*B*C;E;A*E;E*C\nA;23;78;-67;-88;76;12;89;23;45;20',

			// Highest performance increase or decrease - 1P - Simple
			7: 'Group;A;B;C;D;E;F;G;H;I;J\nA;2;3;5;7;4;-5;-10;7;-5;10',
			8: 'Group;A;B;C;D;E;F;G;H;I;J\nA;5;-6;4;0;-7;13;-6;-76;34;-12',
			9: 'Group;A;B;C;D;E;F;G;H;I;J\nA;5;6;-4;8;7;-23;6;66;4;12',

			// Highest performance increase or decrease - 1P - Complex
			10: 'Group;A;B;C;C*D;E;F;E*F;G;H;I\nA;3;5;-6;88;5;-7;6;-43;89;-23',
			11: 'Group;A;B;C;C*D;E;F;E*F;G;H;I\nA;43;-4;5;-23;5;94;-7;95;-34;-20',

			// Option where performance-influence model differs the most - 2P - Simple
			13: 'Group;A;B;C;D;E;F;G;H;I;J\nA;23;-4;-5;7;12;-60;-56;23;89;10\nB;200;3;4;5;6;7;8;9;-190;10',
			14: 'Group;A;B;C;D;E;F;G;H;I;J\nA;23;-4;-5;23;89;10;7;12;-60;-56\nB;200;3;4;5;-150;7;8;9;-190;10',
			15: 'Group;A;B;C;D;E;F;G;H;I;J\nA;9;59;89;23;-4;-190;-150;7;8;10\nB;10;200;-56;-5;3;4;5;7;12;-60',


			// Option where performance-influence model differs the most - 2P - Complex
			16: 'Group;A;B;C;C*D;E;F;E*F;G;H;I;K\nA;-190;10;200;7;12;-60;-56;23;-4;-5\nB;3;4;5;-150;7;8;9;59;89;10',
			17: 'Group;A;B;C;C*D;E;F;E*F;G;H;I;K\nA;-150;7;8;9;59;89;-190;10;23;-4\nB;3;4;5;10;200;7;12;-60;-56;-5',
			18: 'Group;A;B;C;C*D;E;F;E*F;G;H;I;KJ\nA;7;12;-60;-56;23;-4;-5;59;89;10\nB;3;4;5;-150;7;8;9;-190;10;200',

			// Option where performance-influence model are most similar - 2P - Simple
			19: 'Group;A;B;C;D;E;F;G;H;I;J;K\nA;-150;7;89;8;10;9;23;-4;-190;59;23\nB;4;45;56;65;-60;13;200;-56;-5;3;23',
			20: 'Group;A;B;C;D;E;F;G;H;I;J;K\nA;51;-6;-89;5;-17;6;-43;12;-23;31\nB;32;54;-7;-90;-18;8;-45;12;-400;23',
			21: 'Group;A;B;C;D;E;F;G;H;I;J;K\nA;51;-6;12;5;-17;6;-43;-23;31;-89\nB;32;-45;12;-400;-90;-18;8;23;54;-7',

			// Option where performance-influence model are most similar - 2P - Complex
			22: 'Group;A;B;C;C*D;E;F;E*F;G;H;I;K\nA;6;-43;12;-23;31;51;-6;-89;5;-17\nB;8;-45;12;-400;23;32;54;-7;-90;-18',
			23: 'Group;A;B;C;C*D;E;F;E*F;G;H;I;K\nA;6;-43;-6;89;5;-17;12;23;31;51;12\nB;0;23;32;54;-7;-90;-18;8;-45;12;-40',
			24: 'Group;A;B;C;C*D;E;F;E*F;G;H;I;K\nA;6;31;-51;43;6;89;5;17;12;23;43\nB;0;23;-32;54;12;40;-7;-90;-18;56;32',

			//Groups that share a large set of influences - Many models - Simple
			25: 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\n' +
			'A;3.43;-17.12;-27.00;-7.33;26.33;7.45;2.13;-1.047;27.56;4.79\n' +
			'B;-17.12;-27.00;-7.33;27.56;4.79;3.43;85.3;23.45;94.13;-1.047\n' +
			'C;26.33;56;4.79;3.43;45;-27.00;43;2.13;-1.047;54\n' +
			'D;34.33;7.45;35;4.79;45.43;452;-27.00;53.33;33;-1.047\n' +
			'E;54.12;45.00;45.33;27.56;4.79;3.43;85.3;23.45;94.13;-1.047\n',
			26: 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\n' +
			'A;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33;26.33\n' +
			'B;-17.12;-27.00;94.13;-1.047;-7.33;27.56;4.79;3.43;85.3;23.45\n' +
			'C;26.33;43;2.13;-1.047;4.79;45.43;452;-27.00;53.33;33\n' +
			'D;26.33;43;34;333;-56;9;452;-27.00;53.33;33\n' +
			'E;87.12;-34.00;54.33;26.33;7.45;2.13;-1.047;65.56;4.79;54.43\n',
			27: 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\n' +
			'A;3.43;-17.12;-27.00;-7.33;26.33;7.45;2.13;-1.047;27.56;4.79\n' +
			'B;-17.12;-27.00;4.79;3.43;85.3;23.45;94.13;-1.047;-7.33;27.56\n' +
			'C;45.43;452;-27.00;53.33;33;26.33;43;2.13;-1.047;4.7\n' +
			'D;-56;9;452;-27.00;53.33;26.33;43;34;333;33\n' +
			'E;7.45;2.13;-1.047;65.56;4.79;26.33;43;34;333;33\n',

			//Groups that share a large set of influences - Many models - Complex
			28: 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\n' +
			'A;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;06.12;20.00;-39.33\n' +
			'B;26.33;7.45;2.13;6.3;48.6;53.4;9.6;67.5;5.6;-7.33\n' +
			'C;4.43;-18.12;-28.00;-8.33;26.33;7.45;2.13;-2.047;28.56;5.79\n' +
			'D;28.33;9.45;4.13;-1.047;27.56;6.79;5.43;-19.12;-29.00;-7.33\n' +
			'E;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.3\n' +
			'F;85.3;3.43;-17.12;-27.00;-7.33;23.45;94.13;-1.047;27.56;4.79\n' +
			'G;26.33;56;2.13;-1.047;54;4.79;3.43;45;-27.00;43\n' +
			'H;34.33;7.45;33;-1.047;35;4.79;45.43;452;-27.00;53.33\n' +
			'I;28.33;9.45;4.13;-1.047;27.56;6.79;5.43;-1.047;27.56;4.79\n',
			29: 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\n' +
			'A;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\n' +
			'B;85.3;23.45;94.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\n' +
			'C;26.33;56;2.13;-1.047;54;4.79;3.43;45;-27.00;43\n' +
			'D;34.33;7.45;33;-1.047;35;4.79;45.43;452;-27.00;53.33\n' +
			'E;26.33;7.45;2.13;-1.047;65.56;4.79;54.43;87.12;-34.00;54.33\n' +
			'F;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;06.12;20.00;-39.33\n' +
			'G;26.33;7.45;2.13;6.3;48.6;53.4;9.6;67.5;5.6;-7.33\n' +
			'H;26.33;7.45;2.13;-2.047;28.56;5.79;4.43;-18.12;-28.00;-8.33\n' +
			'I;28.33;9.45;4.13;-1.047;27.56;6.79;5.43;-19.12;-29.00;-7.33',
			30: 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\n' +
			'A;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\n' +
			'B;85.3;23.45;94.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\n' +
			'C;26.33;56;-27.00;43;2.13;-1.047;54;4.79;3.43;45\n' +
			'D;34.33;7.45;33;-1.047;35;4.79;45.43;452;-27.00;53.33\n' +
			'E;26.33;7.45;2.13;-1.047;65.56;4.79;54.43;87.12;-34.00;54.33\n' +
			'F;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;06.12;20.00;-39.33\n' +
			'G;53.4;9.6;67.5;5.6;-7.33;26.33;7.45;2.13;6.3;48.6\n' +
			'H;26.33;7.45;-2.047;28.56;5.79;4.43;2.13;-18.12;-28.00;-8.33\n' +
			'I;27.56;6.79;5.43;-19.12;-29.00;28.33;9.45;4.13;-1.047;-7.33',

			//pair of models that share a large set of influences - Simple
			31: 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\n' +
			'A;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;7.24;30.75;-5.18;1.68;-3.73;-8.16;-9.11;-4.16;-28.91;-13.37;17.44;-50.32;37.41;-1.71;-25.12;-53.97;97.51;65\n' +
			'C;61.80;-36.85;-4.17;182.54;-34.44;-23.09;146.41;3.75;228.48;6.03;8.49;13.91;-5.88;-1.70;4.43;29.61;1;2;3;4;5;6;7;8;9;10;11;12\n' +
			'B;61.38;-36.88;-10.78;195.69;-32.31;0;-21.01;146.41;4.44;228.93;5.72;8.49;27.12;-5.77;-0.86;-4.32;-8.24;-6.64;-4.16;-26.42;1;2;3;4;5;6;7;8',
			32: 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\n' +
			'A;3.75;228.48;6.03;8.49;13.91;-5.88;-1.70;4.43;29.61;1;2;3;4;5;6;7;8;9;10;11;12;61.80;-36.85;-4.17;182.54;-34.44;-23.09;146.41;\n' +
			'C;7.24;30.75;-5.18;1.68;-3.73;-8.16;-9.11;-4.16;-28.91;-13.37;17.44;-50.32;37.41;-1.71;-25.12;-53.97;97.51;65;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;\n' +
			'B;27.12;-5.77;-0.86;-4.32;-8.24;-6.64;-4.16;-26.42;1;2;3;4;5;6;7;8;61.38;-36.88;-10.78;195.69;-32.31;0;-21.01;146.41;4.44;228.93;5.72;8.49;',
			33 : 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\n' +
			'A;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;7.24;30.75;-5.18;1.68;-3.73;-8.16;-9.11;-4.16;-28.91;-13.37;17.44;-50.32;37.41;-1.71;-25.12;-53.97;97.51;65\n' +
			'C;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;7.24;13.91;-5.88;-1.70;4.43;29.61;1;2;3;4;5;6;7;8;9;10;11;12\n' +
			'B;67.38;65.88;09.78;5.69;92.31;9;-21.01;5.41;54.44;67.93;7.72;8.49;27.12;54.77;-4.86;24.32;75.24;92.64;4.16;6.42;4;24;27;03;29;74;28;94',

			//pair of models that share a large set of influences - Complex
			34 : 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\n' +
			'A;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;7.24;30.75;-5.18;1.68;-3.73;-8.16;-9.11;-4.16;-28.91;-13.37;17.44;-50.32;37.41;-1.71;-25.12;-53.97;97.51;65\n' +
			'C;61.80;-36.85;-4.17;182.54;-34.44;-23.09;146.41;3.75;228.48;6.03;8.49;13.91;-5.88;-1.70;4.43;29.61;0;0;0;0;0;0;0;0;0;0;0;0\n' +
			'B;61.38;-36.88;-10.78;195.69;-32.31;0;-21.01;146.41;4.44;228.93;5.72;8.49;27.12;-5.77;-0.86;-4.32;-8.24;-6.64;-4.16;-26.42;0;0;0;0;0;0;0;0',
			35 : 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\n' +
			'A;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;7.24;30.75;-5.18;1.68;-3.73;-8.16;-9.11;-4.16;-28.91;-13.37;17.44;-50.32;37.41;-1.71;-25.12;-53.97;97.51;65\n' +
			'C;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;7.24;30.75;-5.18;1.68;-3.73;-8.16;6.5;8.5;-45.91;-73.37;39.44;-19.32;03.41;-2.71;-02.12;-29.97;25.51;47\n' +
			'B;61.38;-36.88;-10.78;195.69;-32.31;0;-21.01;146.41;4.44;228.93;5.72;8.49;27.12;-5.77;-0.86;-4.32;-8.24;-6.64;-4.16;-26.42;0;0;0;0;0;0;0;0',
			36 : 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\n' +
			'A;79.83;-55.06;-29.98;196.31;-49.36;-38.40;145.16;4.44;224.59;8.45;7.24;30.75;-5.18;1.68;-3.73;-8.16;-9.11;-4.16;-28.91;-13.37;17.44;-50.32;37.41;-1.71;-25.12;-53.97;97.51;65\n' +
			'C;61.38;-36.88;-10.78;195.69;-32.31;0;-21.01;146.41;4.44;4.93;-45.72;-23.49;95.12;-3.77;-9.86;53.32;4.24;64.64;3.16;56.42;0;0;0;0;0;0;0;0\n' +
			'B;61.38;-36.88;-10.78;195.69;-32.31;0;-21.01;146.41;4.44;228.93;5.72;8.49;27.12;-5.77;-0.86;-4.32;-8.24;-6.64;-4.16;-26.42;0;0;0;0;0;0;0;0',



		};
/*
		const JsonObj =
			{
				// Most relevant option -1P
				0: 'Group;A;B;C;A*B;D;E;A*C;A*D*B;F;E*D*F\nA;3;6;0;-3;-7;-6;4;9;3;4\nB;1;5;-6;7;-6;0;9;-2;4;-7',
				1: 'Group;A;B;C;D;E;F;G;H;I;J\nA;34.4;26.56;7.56;25;78;56;17;6;34;5',
				2: 'Group;A;B;C;D;E;F;G;H;I;J\\nA;5;0.67;-7;4;25;13;-6;0.5;3',

				2: 'Group;A;B;C;D;E;F;G;H;I;J\nA;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33',
				3: 'Group;A;B;C;D;D*A;E;E*C;F;F*D;C*A*D\nA;67.45;05.34;-3.43;34.45;78.45;-34.45;23;45.34;-78.45',
				4: 'Group;A;B;C;D;C*D;D*A;E;E*C;F;F*B\nA;45.5;78.45;-89.45;-92;10;-07;9.56;-08.54;78.56;.67',
				5: 'Group;A;B;C;B*C;D;C*D;E;E*B;C*A*B;E*A\nA;67.45;05.34;-3.43;34.45;78.45;-34.45;23;45.34;-78.45;19.56',
				6: 'Group;A;B;C;D;E;F;G;I;J;K\nA;45;-45;-56;23.23;7;-28.57;-60.56;-85.1;49.2;51.4',
				7: 'Group;A;B;B*A;C;C*A;D;D*A;C*D;E;E*B*C;E*A*D\nA;-78.7;2.4;-89.34;45.23;67.45;-93.54;63.34;89.23;67.23;',
				8: 'Group;A;B;C;D;E;F;G;H;I;J\nA;4;67.56;-56.56;-27.78;89.45;4.23;78.34;-61;28.56;34.34\nB;84.34;67.67;-68.23;78.56;89.54;89.45;-25.9;-18;60;67',
				9: 'Group;A;B;C;A*B;C*B;D;D*A;E;E*A*D;E*C*B;F\nA;56;-09.56;-23;8;-29;-14;34.8;81.67;10;-78.5\nB;4;-82;-68.23;-9;20;92;19;0;78.3;-89.78',
				10: 'Group;A;B;A*B;C;D;C*D;E;E*B*A;F;F*D\nA;67.45;05.34;-3.43;34.45;78.45;-34.45;23;45.34;-78.45\nB;56;-97;-19;67;29;-94;47;-04;49',
				11: 'Group;A;B;A*B;C;C*A;E;A*E*B;F;F*D;G\nA;93.54;-63.34;89.23;-67.23;-78.7;-2.4;-89.34;45.23;67.45\nB;20;-67.56;-30.78;49.67;-56.34;49.89;-78.56;39.89;50.56',
				12: 'Group;A;B;C;D*E;F;G*E;H;I*E*J;J;F*E;I*K;L*M;N;B*O;F*O;N*F;G*H;I*E*K;J*K;J*K*E;P;P*E;K;P*E*N;K*Q;K*Q*E;R;S\nA;79.8338811051514;-55.0644280308279;-29.9830741501976;196.318533691212;-49.3673619918136;-38.4037002380766;145.167518445143;4.44769753751478;224.591014868327;8.4581473875704;7.24856026096808;30.7537446985415;-5.18875205055668; 1.68090393498785;-3.73892023487385;-8.16039886966587;-9.11429929918398;-4.16795880116297;-28.919436692069;-13.3761810546476;17.4497669828609;-50.3286178466828;37.4179518642293;-1.71715702141449;-25.1226315958356;-53.9788952709672;97.5164921233704;\n B;61.3845681842981;-36.8836136517649;-10.7800399970726;195.698266409178;-32.3190628247197;0;-21.0146860994521;146.413930372454;4.44769753752683;228.932885843837;5.72864500275381;8.494972188367;27.1257046694267;-5.77883201954394;-0.865642306746007;-4.32900020386118;-8.24116959035582;-6.64852377803541;-4.16795880122927;-26.4266128374583;0;0;0;0;0;0;0;\nC;61.8084563635763;-36.8529903400404;-4.17338678752301;182.548489558529;-34.4461618772877;-23.098665499942;146.413930372453;3.7530377373322;228.48817886856;6.03326413091207;8.49497218833112;13.9123982504181;-5.88601361043327;-1.70616938957032;4.43618179474917;29.6158728628314;0;0;0;0;0;0;0;0;0;0;0;0',
				13: 'Group;A;B;A*B;C;D;C*D;E;E*A*B;D*A*B;F\nA;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\nB;85.3;23.45;94.13;-1.047;27.56;4.79;3.43;-17.12;-27.00;-7.33\nC;26.33;56;2.13;-1.047;54;4.79;3.43;45;-27.00;43\nD;34.33;7.45;33;-1.047;35;4.79;45.43;452;-27.00;53.33\nE;26.33;7.45;2.13;-1.047;65.56;4.79;54.43;87.12;-34.00;54.33\n\nF;26.33;7.45;2.13;-1.047;27.56;4.79;3.43;06.12;20.00;-39.33\nG;26.33;7.45;2.13;6.3;48.6;53.4;9.6;67.5;5.6;-7.33\nH;26.33;7.45;2.13;-2.047;28.56;5.79;4.43;-18.12;-28.00;-8.33\nI;28.33;9.45;4.13;-1.047;27.56;6.79;5.43;-19.12;-29.00;-7.33',

			};*/

//read key value from route params
		let id = this.$routeParams.id;
		this.fileContent = performanceInfluenceModels[id];

		this.configElement = [];
		this.configElementHeaders = ['GROUP', 'XX_LINE_WIDTH', 'XX_LINE_COLOR'];
		this.d3 = this.d3Service.getD3();
		this.selectedFeatures = {};
		this.selectedInteractions = {};

//for radar and textplot
		this.dataToUpdate = [];
		this.indexForEditData = 0;

// for elephant plot
		this.allCsvData = [];
		this.allGroups = [];
		this.allLabels = [];
	}


/**
 * reads csv data to get the labels, get the count on no of * each labels has.
 * with these values create the interactions dropdown with all values set to true
 */
	dataForInteractions(fileContent){

		let interactions = [];
		const lines = fileContent.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		forEach(this.labels,function (value){
			var count = ((value.match(/\*/g) || []).length) + 1;
			interactions.push(count);
		});
		this.interactions =  uniq(interactions);
		this.interactions.forEach((d,i ) => {
			this.selectedInteractions[i] = true ;
		});

	}

/**
 * reads csv data to get the labels, these labels are displayed in the features dropdown.
 * all the values are set to true
 */
	dataForFilters(dataToSplit){

		const lines = dataToSplit.split('\n');
		this.labels = lines[0].split(';');
		this.labels.shift();
		this.listOfFeatures = this.labels;
		this.listOfFeatures.forEach((d,i ) => {
			this.selectedFeatures[i] = true ;
		});
		this.dataToUpdate.push(...this.getSeries(dataToSplit));
		this.setTableConfigData();
	}

/**
 * reads this.dataToUpdate to create an array of groups,
 * for each of these groups a new row in table with the corresponding group name is appended to update the chart line colors etc
 *configElement
 */
	setTableConfigData(){
	// console.log('setTableConfigData changed');
		const groups = map(this.dataToUpdate, 'name');
		for(let i=this.configElement.length;i<this.dataToUpdate.length;i++) {
			const value = groups[i];
			const newElement = {
				'GROUP': value,
				'XX_LINE_WIDTH': {
					'type': [
						'NUMBER_INPUT'
					],
				},
				'XX_LINE_COLOR': {
					'type': [
						'INPUT_TYPE'
					],
				}
			};
			this.configElement[i] = newElement;
		}
	}


/**
 * updates this.groups array to have all the groups added so far.
 * updates this.arrayData to have all normalized values added so far.
 * updates dataToUpdateElephant to have all the series added so far.
 *
 */
	addNewSeriesElephantPlot(additionalCsvData){

		let dataToUpdateElephant = [];
		const lines = additionalCsvData.split('\n');
		const labelsNew = lines[0].split(';');
		labelsNew.shift();

		let ElephantPlotWithAdditionalCsvData = this.getSeriesForElephantPlot(additionalCsvData);
		this.groups.push(...this.getGroupsForElephantPlot(additionalCsvData));

		let arrayData =zip(...ElephantPlotWithAdditionalCsvData) ;
		this.allGroups.push(this.groups);

	// append the old data with new data of new csv file
		for(let i=0;i<this.arrayData.length;i++){
			this.arrayData[i].push.apply(this.arrayData[i], arrayData[i]);
		}

		let index =0;
		for(let k=0;k<labelsNew.length;k++){
			dataToUpdateElephant[index] = {name : labelsNew[k], data: this.arrayData[k], pointPlacement: 'on' };
			index++;
		}
		this.elephantConfigNew  = {labels : this.groups, series: dataToUpdateElephant};
		this.normalizedValuesService.setAllSeriesForElephantPlot(this.elephantConfigNew);
	}


/**
 * reads the csv data and creates the series data with the normalized arrays values that are calculated
 * returns  array of series, ex: series = [0.3,0.34]
 */
	getSeriesForElephantPlot(csvrawData){
		let lines = csvrawData.split('\n');
		let elephantSeries = [];
		let groups;
		for(let i=1;i<lines.length;i++){
			groups = lines[i].split(';');
			groups.shift();
			if(!isEmpty(groups))
		{
			//math.abs takes the absolute value only, +a converts string to int
				var additionVal = this.d3.sum(groups, function(value){
					return Math.abs(value);
				});

				var finalArray = [];
				forEach(groups, function(value) {
					var newVal = Math.abs(value) / additionVal;
					var rounded = Math.round(newVal * 1000) / 1000;
					finalArray.push(rounded);
				});
				elephantSeries.push(finalArray);
			}
		}
		return elephantSeries;
	}

/**
 *
 * reads the csv data and writes all the groups to a new groupsArr
 * returns array of groups. ex : ['Group A', 'Group B']
 */
	getGroupsForElephantPlot(csvrawData) {

		let lines = csvrawData.split('\n');
		let groupsArr = [];
		let groups;
		for (let i = 1; i < lines.length; i++) {
			groups = lines[i].split(';');
			let groupName = groups[0];
			groups.shift();
			if (!isEmpty(groups)) {
				this.allCsvData.push(groups);
				const name = 'Group ' + groupName;
				groupsArr.push(name);
			}
		}
		return groupsArr;
	}


/**
 * set the chart data in a format required by highcharts
 * elephantConfig = { labels : arrays , series : object }
 * ex : labels = ['Group A', 'Group B']
 * ex : series = { name : 'root' , data : [0.232, 0.23]}
 */
	getChartDataForElephantPlot(csvrawData){

		let elephantConfig;

		const lines = csvrawData.split('\n');
		const labels = lines[0].split(';');
		this.allLabels = labels;
		labels.shift();
		let elephantSeries = this.getSeriesForElephantPlot(csvrawData);
		this.groups = this.getGroupsForElephantPlot(csvrawData);

		this.arrayData;
		this.arrayData = zip(...elephantSeries);
		let index = 0;
		for(let k=0;k<labels.length;k++){
			elephantSeries[index] = {name : labels[k], data: this.arrayData[k], pointPlacement: 'on' };
			index++;
		}
		elephantConfig  = {labels : this.groups, series: elephantSeries};
		this.normalizedValuesService.setAllSeriesForElephantPlot(elephantConfig);
		this.normalizedValuesService.setDataForElephantPlot(elephantConfig);
	}


/**
 * return array of labels
 * @param csv raw data
 */
	getLabels(csvrawData){
		const lines = csvrawData.split('\n');
		const labels = lines[0].split(';');
		labels.shift();
		return labels;
	}

/**
 * return array of series. each serie is an object of the format
 * series =  {name : 'Group A', data: normalizedArray }
 * normalizedArray is array of normalized values for that group
 * @param csv raw data
 */
	getSeries(csvrawData){
		const eachRow = csvrawData.split('\n');
		let series = [];
		let groups;
		let index = 0;
		for(let i=1;i<eachRow.length;i++){
			groups = eachRow[i].split(';');
			let groupName = groups[0];
			groups.shift();
			if(!isEmpty(groups))
		{
			//math.abs takes the absolute value only, +a converts string to int
			/*const maxVal = this.d3.max(groups, function(d){
				const a =  Math.abs(d);
				return +a;
			});

			const minVal = this.d3.min(groups, function(d){
				// const a =  Math.abs(d);
				return +d;
			});*/

				const value = this.d3.max(groups, function(d){
					const a =  Math.abs(d);
					return +a;
				});


				const maxVal = value;
				const minVal = -(value);

			// let minVal =  this.d3.min(groups);
			// console.log(groups, minVal,maxVal);
			//console.log('groups',groups,'maxVal',maxVal, 'minVal',minVal);

			// linear scale is used to normalize values, domain is the range from max to min values, range is the output range
				var scale = this.d3.scaleLinear();
				scale.domain([minVal, maxVal]);
				scale.range( [-1, 1]);

				let normalizedArray = [];
				forEach(groups, function(value) {
					const scaled = scale(value);
					const rounded = Math.round(scaled * 10000) / 10000;
				// console.log('value, scaled ,rounded',value, scaled ,rounded);
					normalizedArray.push(rounded);
				});
				series[index] = {name : 'Group ' + groupName, data: normalizedArray };
				index++;
			}
		}
		return series;
	}


/**
 * set the data that radar chart and text plot
 * chartData is an object of the format below
 * chartDataForRadarAndTextplot = { labels : array of labels, series : array of each series}
 * @param csv raw data
 */
	getChartDataForRadarAndTextplot(csvrawData){
		this.chartDataForRadarAndTextplot = {};
		this.labels = this.getLabels(csvrawData);
		this.series = this.getSeries(csvrawData);
		this.chartDataForRadarAndTextplot  = {labels : this.labels, series: this.series};
		this.normalizedValuesService.setNormalizedValues(this.chartDataForRadarAndTextplot);
	}

/**
 * set the data that radar chart and text plot
 * chartData is an object of the format below
 * additionalSeriesForRadarAndTextplot = { labels : array of labels, series : array of each series}
 * @param csv raw data
 */
	addNewSeriesToRadarAndTextplot(additionalCsvData){
		this.additionalSeriesForRadarAndTextplot = {};
		this.labelsNew = this.getLabels(additionalCsvData);
		this.seriesNew = this.getSeries(additionalCsvData);
		this.additionalSeriesForRadarAndTextplot  = {labels : this.labelsNew, series: this.seriesNew};
	}
}

export default readCsvDataController;