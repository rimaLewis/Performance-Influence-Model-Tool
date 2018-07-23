import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit  {

  filename;
  filesize;
  filetype;
  filedata;

   constructor() {
  }

  ngOnInit() {
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

        // start with the bar chart rendering
        const data = [100, 125, 323, 23, 34, 54];
        const height = 500;
        const width = 500;
        const barWidth = 35;
        const barOffset = 5;

        const myChart = d3.select('#chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('background', '#f4f4f4')
          .selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .style('fill', 'lightgreen')
          .attr('width', barWidth)
          .attr('height', function(d){
            return d;
          })
          .attr('x', function(d, i){
           return i * (barWidth + barOffset);
          })
          .attr('y', function(d){
            return height - d;
          });
      };
    }
  }


}
