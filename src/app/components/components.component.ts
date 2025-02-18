import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { LbsService } from '../../services/lbs.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css'],
  providers: [LbsService, NgxSpinnerService],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Tooltip, InputTextModule, NgxSpinnerModule]
})
export class ComponentsComponent implements OnInit {
  myForm: FormGroup;
  results: string = '';
  hasData: boolean = false;

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
    this.spinner.show();
    const msisdnInput = this.myForm.value.msisdn.split(',').map((item: string) => item.trim());
    const iterations = parseInt(this.myForm.value.tps, 10);
    const profileNumber = parseInt(this.myForm.value.profileNumber, 10);
    const codeRegion = this.myForm.value.codeRegion;

    this.lelListDataService.makeSimpleRequest(msisdnInput, iterations, profileNumber, codeRegion).subscribe({
      next: (response: any) => {
        this.results = JSON.stringify(response, null, 2);
        this.hasData = true;
        this.spinner.hide();
      },
      error: (error: { message: any; }) => {
        this.results = `Error: ${error.message}`;
        this.hasData = false;
        this.spinner.hide();
      }
    });
  }

  clearForm(): void {
    this.myForm.reset();
    this.results = '';
  }
}