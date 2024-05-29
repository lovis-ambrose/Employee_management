// employee.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  api: string = "http://localhost:3000/employees";

  constructor(private _http: HttpClient) {}

  addEmployee(data: any): Observable<any> {
    return this.getEmployees().pipe(
      map(employees => {
        const maxId = employees.reduce((max: number, employee: any) => Math.max(max, employee.id), 0);
        data.id = maxId + 1;
        return data;
      }),
      switchMap(newEmployee => this._http.post(this.api, newEmployee))
    );
  }

  getEmployees(): Observable<any> {
    return this._http.get(this.api);
  }

  deleteEmployee(id: number): Observable<any> {
    return this._http.delete(`this.api/${id}`);
  }
}
