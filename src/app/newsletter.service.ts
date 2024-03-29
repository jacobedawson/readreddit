import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NewsletterService {
  constructor(private http: HttpClient) {}

  addSubscriber(email) {
    return this.http.post('https://reddreader.com/api/newsletter', {
      email
    });
  }

}
