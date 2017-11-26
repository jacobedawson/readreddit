import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as ENV } from '../../../environments/environment';

@Injectable()
export class BookService {

  constructor(private http: HttpClient) { }

  getBookDescription(bookID: string) {
    return this.http.get(`${ENV.apiURL}/description/${bookID}`);
  }

  getBookDetails(bookID: string) {
    console.log('trying to get book details');
    return this.http.get(`${ENV.apiURL}/book/${bookID}`);
  }

}
