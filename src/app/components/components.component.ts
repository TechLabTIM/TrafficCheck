import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { LbsService } from '../../services/lbs.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MapComponent } from "./map/map.component";

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css'],
  providers: [LbsService],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Tooltip, InputTextModule, NgxSpinnerModule, MapComponent]
})
export class ComponentsComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  myForm: FormGroup;
  results: string = '';
  loading: boolean = false;
  showMap:
  boolean = false;
  

  mapResults: any[] = [];

  constructor(private lelListDataService: LbsService,
    private spinner: NgxSpinnerService, 
    private fb: FormBuilder) {
    this.myForm = this.fb.group({
      msisdn: [''],
      tps: [''],
      profileNumber: [''],
      codeRegion: ['']
    });
    
  }

  ngOnInit(): void {
    
  }

  executeRequest(): void {
    this.loading = true;
    const msisdnInput = this.myForm.value.msisdn.split(',').map((item: string) => item.trim());
    const iterations = parseInt(this.myForm.value.tps, 10);
    const profileNumber = parseInt(this.myForm.value.profileNumber, 10);
    const codeRegion = this.myForm.value.codeRegion;

    this.lelListDataService.makeSimpleRequest(msisdnInput, iterations, profileNumber, codeRegion).subscribe({
      next: (response: any) => {
        this.results = JSON.stringify(response, null, 2);
        this.mapResults = this.prepareMapData(response.results); // Ensure this line is updating correctly
        this.loading = false;
        if (this.mapComponent) {
          this.mapComponent.initializeMap(); // Make sure the map is initialized after data is loaded
        }
      },
      error: (error: any) => {
        this.results = `Error: ${error.message}`;
        this.loading = false;
      }
    });
}

  prepareMapData(data: any[]): any[] {
    return data.map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
      label: item.radius + ' meters',
      title: 'Location for ' + item.msisdn
    }));
  }

  clearForm(): void {
    this.myForm.reset();
    this.results = '';
    this.showMap = false;  // Also hide the map when form is cleared
  }
}

interface MapResult {
  latitude: number;
  longitude: number;
  label?: string;
  title?: string;
}

interface ApiResponse {
  results: any[];
  averageTimesPerMsisdn: {[key: string]: number};
}
