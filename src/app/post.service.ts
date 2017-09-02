import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PostService {

  private subject = new Subject<any>();

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get('http://localhost:3000/api/list?week=35&year=2017&subreddit=startups');
  }

  getSubredditPosts(sub) {
    console.log(`Getting ${sub}`);
    this.http.get(
      `http://localhost:3000/api/list?week=35&year=2017&subreddit=${sub}`
    ).subscribe(res => {
      this.subject.next(res);
    });
  }

  updatePosts() {
    return this.subject.asObservable();
  }

}
