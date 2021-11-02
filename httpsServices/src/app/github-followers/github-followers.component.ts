import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of, Observable, combineLatest } from 'rxjs';
import { GithubFollowersService } from '../github-followers.service';


@Component({
  selector: 'github-followers',
  templateUrl: './github-followers.component.html',
  styleUrls: ['./github-followers.component.css']
})
export class GithubFollowersComponent implements OnInit {
  // Mosh Followers 
  followers: any[];
  errorMsg: string; 
  private route: ActivatedRoute;  

  constructor(private service: GithubFollowersService) { }
  
  ngOnInit(): void {

    /*
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ])
    .subscribe(combined => {
      let id = combined[0].get('id');
      let page = combined[1].get('page');

    })
    */
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
