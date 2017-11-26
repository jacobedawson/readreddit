import { BookService } from '../services/book/book.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit {

  public book;

  constructor(private route: ActivatedRoute, private bookService: BookService) { }

  ngOnInit() {
    this.route.params
      .map(params => params['id'])
      .switchMap(id => this.bookService.getBookDetails(id))
      .subscribe(bookDetails => this.book = bookDetails['data'][0]);
  }

}
