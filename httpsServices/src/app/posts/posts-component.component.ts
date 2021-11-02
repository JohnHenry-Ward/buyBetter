import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'posts-component',
  templateUrl: './posts-component.component.html',
  styleUrls: ['./posts-component.component.css']
})

export class PostsComponent implements OnInit{

  /* attributes */
  posts: any[];
  realPost : string;
  errorMsg: string;

  constructor(private service: PostService) 
  {
  }

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
        this.posts = response as Object[];
        for(let key in response)
        {
          //console.log("key = " + key);
          console.log("response["+key+"] = " + JSON.stringify(response[key]));
          if(response.hasOwnProperty(key))
          {
            this.posts.push(response[key]);
          }

        }
        //console.log("posts length = " + this.posts.length);

        //console.log("response = " + JSON.stringify(response));

      },
      _error =>{
        alert('An unexpected error occurred.');
        console.log(_error);
      });
  }




  /* method to add data to list, uses HTTP POST method */
  createPost(input: HTMLInputElement)
  {
    let post = { title : input.value };
    input.value = '';

    /* pessimistic update */
    this.service.create(post)
      .pipe( // catch error if there is any
        catchError(error => {
          this.errorMsg = error.message;
          return of([]);
        })
      )  
      .toPromise().then(data => { // create post and add it to front of list 
        this.realPost = JSON.stringify(data['title']);
        this.posts.splice(0,0,data);
      });
  }


  /* method to update post using HTTP PATCH method */
  /*
  updatePost(post)
  {
    this.service.updatePost(post)
      .subscribe(response => {
        console.log(response);
      });
    //this.http.put(this.url, JSON.stringify({ post }))
  }
  */

  /* method to delete post object, using HTTP DELETE method */
  deletePost(post)
  {
    //console.log('post.id: ' + post.id)
    this.service.delete(post.id) // pessimistic update
      .pipe( // catch error if there is any 
        catchError(error => {
          this.errorMsg = error.message;
          return of([]);
        })
      )
      // call the backend
      .subscribe( // delete post selected
        response => {
          let index = this.posts.indexOf(post);
          this.posts.splice(index,1);
        }
      );
        /*
        // if another user deleted the same post, throw error message
        (error: Response) => {
           // check status of error 
          if(error.status === 404)
          {
            alert('This post has been already deleted.');
          }
          else
          {
            alert('An unexpected error occurred.');
            console.log(error);
          }
        } */
  }
}
