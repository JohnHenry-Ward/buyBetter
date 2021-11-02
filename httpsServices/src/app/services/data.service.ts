import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /* what end point to work with */

  constructor(private url: string, private http: HttpClient) { }

  getAll()
  {
    return this.http.get(this.url) 
      .pipe( // catch error if it occurs and tell user what the error was
        catchError(error => {
          let errorMsg: string;
          if(error.error instanceof ErrorEvent)
          {
            errorMsg = 'Error: ' + error.error.message;
          }
          else
          {
            console.log('I fell in here first');
            errorMsg = this.getServerErrorMessage(error);
            console.log('finally Im here ' + errorMsg);
          }
          return throwError(errorMsg);
        })
      );
  }

  create(resource)
  {
    return this.http.post(this.url, resource)
      .pipe( // catch error if it occurs and tell user what the error was
        catchError(error => {
          let errorMsg: string;
          if(error.error instanceof ErrorEvent)
          {
            errorMsg = 'Error: ' + error.error.message;
          }
          else
          {
            errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }

  update(resource)
  {
    return this.http.patch(this.url + '/' + resource.id , JSON.stringify({ isRead: true }))
      .pipe( // catch error if there is any and tell user what the error was 
        catchError(error => {
          let errorMsg: string;
          if(error.error instanceof ErrorEvent)
          {
            errorMsg = 'Error: ' + error.error.message;
          }
          else{
            errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }

  delete(id)
  {
    return this.http.delete(this.url + '/' + id)
      .pipe( // catch error if there is any and tell the user what the error was
        catchError(error => {
          let errorMsg: string;
          if(error.error instanceof ErrorEvent)
          {
            errorMsg = 'Error: ' + error.error.message;
          }
          else
          {
            errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
      
  }

  /* method to get which error message happened */
  private getServerErrorMessage(error: HttpErrorResponse): string{
    console.log('error.status = ' + error.status);
    switch(error.status)
    {
      case 404: {
        alert(error.name + ': ' + error.message);
        return 'Not Found: ${error.message}';
      }
      case 403: {
        alert(error.name + ': ' + error.message);
        return 'Access Denied: {$error.message}'; 
      }
      case 500: {
        alert(error.name + ': ' + error.message);
        return 'Internal Server Error: ${error.message}';
      }
      default: {
        console.log('then i fell in here');
        alert(error.name + ': ' + error.message);

        return 'Unknown Server Error: ' + error.message;
      }
    }
  }
}