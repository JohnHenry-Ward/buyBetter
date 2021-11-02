import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './services/data.service';

@Injectable({
  providedIn: 'root'
})
export class GithubFollowersService extends DataService{

  constructor(http: HttpClient) {
    console.log("fuck you, I am in here");
    super("https://api.github.com/users/mosh-hamedani/followers", http);
  }

}
