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
        const maxId = employees.reduce((max: number, employee: any) => Math.max(max, parseInt(employee.id, 10)), 0);
        data.id = (maxId + 1).toString();
        return data;
      }),
      switchMap(newEmployee => this._http.post(this.api, newEmployee))
    );
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this._http.put(`${this.api}/${id}`, data);
  }

  getEmployees(): Observable<any> {
    return this._http.get(this.api);
  }

  deleteEmployee(id: string): Observable<any> {
    return this._http.delete(`${this.api}/${id}`);
  }
}
