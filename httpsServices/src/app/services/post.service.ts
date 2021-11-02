import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})

/* superclass is DataService in which, handles http errors */
export class PostService extends DataService {

  constructor(http : HttpClient) { 
    /* for http tutorial */
    super("https://jsonplaceholder.typicode.com/posts", http);
  }


}