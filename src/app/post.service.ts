import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PostService {

  private subject = new Subject<any>();

  constructor(private http: HttpClient) {}

  // This should run once on load to fill the select menus
  getCatalog() {
    return this.http.get('http://localhost:3000/api/catalog');
  }

  // this should take in the most recent week / year
  // TODO - remove the hardcoded week & year
  getPosts() {
    return this.http.get('http://localhost:3000/api/list?week=36&year=2017&subreddit=startups');
  }

  // This takes in a sub. TODO take in week / year based on select options for each subreddit
  getSubredditPosts(sub) {
    console.log(`Getting ${sub}`);
    this.http.get(
      `http://localhost:3000/api/list?week=36&year=2017&subreddit=${sub}`
    ).subscribe(res => {
      this.subject.next(res);
    });
  }

  updatePosts() {
    return this.subject.asObservable();
  }

}
