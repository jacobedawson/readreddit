import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostService {

  constructor(private http: HttpClient) {

  }

  getPosts() {
    return this.http.get('http://localhost:3000/api/list?week=32&year=2017&subreddit=entrepreneur');
  }

}
