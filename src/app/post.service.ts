import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment as ENV } from '../environments/environment';

@Injectable()
export class PostService {

  private subject = new Subject<any>();

  constructor(private http: HttpClient) {}

  // This should run once on load to fill the select menus
  getCatalog() {
    return this.http.get(`${ENV.apiURL}/catalog`);
  }

  // This will get all subreddits for the latest week
  getPosts() {
    return this.http.get(`${ENV.apiURL}/list`);
  }

  getHistory() {
    return this.http.get(`${ENV.apiURL}/history`);
  }

  getRange(range) {
    return this.http.get(`${ENV.apiURL}/year/${range.year}/week/${range.week}`);
  }

  // This gets the info for a particular date range
  getSubredditPosts({week, year}) {
    this.http.get(
      `${ENV.apiURL}/catalog?week=${week}&year=${year}`
    ).subscribe(res => {
      this.subject.next(res);
    });
  }

  updatePosts() {
    return this.subject.asObservable();
  }

}
