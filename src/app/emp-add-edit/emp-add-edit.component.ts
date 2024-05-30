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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-emp-add-edit',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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
    HttpClientModule
  ],
  templateUrl: './emp-add-edit.component.html',
  styleUrl: './emp-add-edit.component.scss'
})
export class EmpAddEditComponent implements OnInit{

  empForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  //use injection token to fetch row data for edit, make it public
    private _coreService: CoreService
  ){
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      education: '',
      company: '',
      experience: '',
      salary: ''
    })
  }

  ngOnInit(): void {
    //open form with data
    this.empForm.patchValue(this.data);
  }


  education: string[] = [
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

  onFormSubmit(){
    // submit basing on if form has data or not
    if(this.empForm.valid){
      if(this.data){
        // update
        this._empService.updateEmployee(this.data.id, this.empForm.value).subscribe(
          {
            next: (response) => {
              response = this._coreService.openSnackBar("employee updated!", "Done");
              this._dialogRef.close(true); //pass true here
            },
            error: (err) =>{
              // alert("error occured");
              err = this._coreService.openSnackBar("employee updated!", "Done")
            }
          }
        );
      }
      else{
        // save
        this._empService.addEmployee(this.empForm.value).subscribe(
          {
            next: (response) => {
              response = this._coreService.openSnackBar("employee added!", "Done");
              this._dialogRef.close(true); //pass true here
            },
            error: (err) =>{
              // alert("error occured");
              err = this._coreService.openSnackBar("an error occured!", "Done")
            }
          }
        );
      }
    }
  }
}
