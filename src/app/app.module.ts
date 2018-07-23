import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BarchartComponent } from './barchart/barchart.component';
import { RadarPlotComponent } from './radar-plot/radar-plot.component';

const appRoutes: Routes = [
  { path: 'radar', component: RadarPlotComponent },
  {
    path: 'bar',
    component: BarchartComponent ,
    data: { title: 'bar Chart' }
  },
  { path: '',
    redirectTo: '/radar',
    pathMatch: 'full'
  },
  { path: '**', component: BarchartComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    RadarPlotComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})





export class AppModule {
}
