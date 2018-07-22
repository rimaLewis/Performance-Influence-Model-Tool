import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';


export type Datum = {name: string, value: number};
@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit, OnChanges  {
  barchart;
  file;
  filename;
  filesize;
  filetype;
  filedata;
  radius = 10;
  @Input() height = 300;
  @Input() width = 600;
  @Input() data: Datum[] = [];
  @Input() range = 100;

  xScale: d3.ScaleBand<string> = null;
  yScale: d3.ScaleLinear<number, number> = null;
  transform = '';
  chartWidth = this.width;
  chartHeight = this.height;
  barHeights: number[] = [];
  barWidth = 0;
  xCoordinates: number[] = [];
   constructor() {
   // this.barchart = [{text: 'chart1' }, {text: 'chart2 '}, {text: 'chart3 '}];
  }

  ngOnInit() {
    d3.select('p').style('color', 'red');
   }
  // Input changed, recalculate using D3
  ngOnChanges() {
    this.chartHeight = this.height;
    this.chartWidth = this.width;
    this.xScale = d3.scaleBand()
      .domain(this.data.map((item: Datum) => item.name)).range([0, this.chartWidth])
      .paddingInner(0.5);
    this.yScale = d3.scaleLinear()
      .domain([0, this.range])
      .range([this.chartHeight, 0]);

    this.barWidth = this.xScale.bandwidth();
    this.barHeights = this.data.map((item: Datum) => this.barHeight(item.value));
    this.xCoordinates = this.data.map((item: Datum) => this.xScale(item.name));

    // use transform to flip the chart upside down, so the bars start from bottom
    this.transform = `scale(1, -1) translate(0, ${- this.chartHeight})`;
  }

  clampHeight(value: number) {
    if (value < 0) {
      return 0;
    }
    if (this.chartHeight <= 0) {
      return 0;
    }
    if (value > this.chartHeight) {
      return this.chartHeight;
    }
    return value;
  }

  barHeight(value) {
    return this.clampHeight(this.chartHeight - this.yScale(value));
  }
  clicked(event: any) {
     d3.select(event.target).
       append('circle')
       .attr('cx', event.x)
       .attr('cy', event.y)
       .attr('r', this.radius)
       .attr('fill', 'red');
  }
  fileChanged(e) {
    this.file = e.target.files[0];
  }
  public changeListener(files: FileList) {
    console.log(files);
    if (files && files.length > 0) {
      const file: File = files.item(0);
      this.filename = file.name;
      this.filesize = file.size;
      this.filetype = file.type;
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csv: string = reader.result;
        this.filedata = csv;
      };
    }
  }


}
