import { Component } from '@angular/core';
import { BarchartComponent } from './barchart/barchart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers  : [ BarchartComponent ]
})

export class AppComponent {
  title = 'app works!';
}


