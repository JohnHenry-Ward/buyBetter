import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { GithubFollowersService } from '../github-followers.service';

@Component({
  selector: 'http-exercise',
  templateUrl: './http-exercise.component.html',
  styleUrls: ['./http-exercise.component.css']
})
export class HttpExerciseComponent implements OnInit {

  // Mosh Followers 
  followers: any[];
  errorMsg: string; 
  // avatar_url, html_url, login

  constructor(private service: GithubFollowersService) { }

  ngOnInit(): void {
    /* get method to get data, using HTTP GET method */
    this.service.getAll() // pessimistic update
      .pipe( // get error message if any 
        catchError(error => {
          this.errorMsg = error.message;
          return of([]);
        })
      )
      .subscribe(response => { // get data from end-point 
        this.followers= response as Object[];
        console.log(this.followers);
        for(let key in response)
        {
          if(response.hasOwnProperty(key))
          {
            this.followers.push(response[key]);
          }
        }
      },
      _error =>{
        alert('An unexpected error occurred.');
        console.log(_error);
      });
  }

}
