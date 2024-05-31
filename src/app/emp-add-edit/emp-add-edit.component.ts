import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-emp-add-edit',
  standalone: true,
  providers: [provideNativeDateAdapter(), ConfirmationService, MessageService],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConfirmDialogModule,
    ToastModule,
    RippleModule,
    CommonModule,
    MatAutocompleteModule,

  ],
  templateUrl: './emp-add-edit.component.html',
  styleUrl: './emp-add-edit.component.scss'
})
export class EmpAddEditComponent implements OnInit{

  empForm: FormGroup;
  filteredEducationOptions!: Observable<string[]>;
  
  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  //use injection token to fetch row data for edit, make it public
    private _confirmService: ConfirmationService,
    private _msgService: MessageService
  ){
    this.empForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      company: ['', Validators.required],
      experience: ['', Validators.required],
      salary: ['', Validators.required]
    });    
  }

  ngOnInit(): void {
    //open form with data
    this.empForm.patchValue(this.data);
    // Setup the filtered options for education field
    this.filteredEducationOptions = this.empForm.controls['education'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterEducation(value))
    );
  }


  educationOptions: string[] = [
    'PLE',
    'UCE',
    'UACE',
    'Diploma',
    'Undergraduate',
    'Graduate',
    'Post Graduate',
    'Masters',
    'PhD'
  ];

  private _filterEducation(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.educationOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  onFormSubmit(){
    // submit basing on if form has data or not
    if(this.empForm.valid){
      if(this.data){
        // open confirm dialog
        this._confirmService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon:"none",
          rejectIcon:"none",
          rejectButtonStyleClass:"p-button-text",
          accept: () => {
            // update
            this._empService.updateEmployee(this.data.id, this.empForm.value).subscribe(
              {
                next: (response) => {
                  this._msgService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record Updated' });
                  setTimeout(() => {
                    this._dialogRef.close(true); //pass true here
                  }, 2000);
                },
                error: (err) =>{
                  err = this._msgService.add({ severity: 'error', summary: 'Error', detail: 'Error Occurred', life: 3000 });
                }
              }
            );
          },
          reject: () => {
            this._msgService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
          }
      });
      }
      else{
        // save
        this._empService.addEmployee(this.empForm.value).subscribe(
          {
            next: (response) => {
              response = this._msgService.add({ severity: 'success', summary: 'Success', detail: 'Employee added!!' });
              setTimeout(() => {
                this._dialogRef.close(true); //pass true here
              }, 2000);
            },
            error: (err) =>{
              err = this._msgService.add({ severity: 'error', summary: 'Error', detail: 'Error Occurred', life: 3000 });
            }
          }
        );
      }
    }
  }
}
