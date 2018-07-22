/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RadarPlotComponent } from './radar-plot.component';

describe('RadarPlotComponent', () => {
  let component: RadarPlotComponent;
  let fixture: ComponentFixture<RadarPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadarPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadarPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
