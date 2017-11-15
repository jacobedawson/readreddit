import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BookService {
  URL = 'https://reddreader.com/api';
  // URL = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  getBookDescription(bookID: string) {
    return this.http.get(`${this.URL}/description/${bookID}`);
  }

}
