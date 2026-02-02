import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee, ApiResponse } from '@core/models/employee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `https://saaf.net.sa/api/register`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': token,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      errorMessage = `خطأ ${error.status}: ${error.message}`;
    }

    console.error('EmployeeService Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  addEmployee(employeeData: Employee): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/add-employee`,
      employeeData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${this.apiUrl}/getallemployees`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateEmployee(id: string, employeeData: Partial<Employee>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/update-employee/${id}`,
      employeeData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  deleteEmployee(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/delete-employee/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
}
