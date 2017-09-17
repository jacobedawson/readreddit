import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PostService {

  private subject = new Subject<any>();
  // URL = 'http://localhost:3000';
  URL = 'https://reddreader.com';

  constructor(private http: HttpClient) {}

  // This should run once on load to fill the select menus
  getCatalog() {
    return this.http.get(`${this.URL}/api/catalog`);
  }

  // This will get all subreddits for the latest week
  getPosts() {
    return this.http.get(`${this.URL}/api/list`);
  }

  // This get the info for a particular subreddit
  getSubredditPosts({sub, week, year}) {
    this.http.get(
      `${this.URL}/api/list?week=${week}&year=${year}&subreddit=${sub}`
    ).subscribe(res => {
      this.subject.next(res);
    });
  }

  updatePosts() {
    return this.subject.asObservable();
  }

}
