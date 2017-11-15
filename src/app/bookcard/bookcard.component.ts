import { BookService } from './../services/book/book.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bookcard',
  templateUrl: './bookcard.component.html',
  styleUrls: ['./bookcard.component.scss']
})
export class BookcardComponent implements OnInit {

  @Input() bookData;
  description = '';
  bookID = '';

  constructor(
    private bookService: BookService
  ) { }

  ngOnInit() {
    this.bookID = this.getAmazonID(this.bookData.url);
  }

  getBookDescription() {
    this.bookService.getBookDescription(this.bookID).subscribe(res => {
      if (res['data'][0].EditorialReviews[0].EditorialReview[0].Content[0]) {
        const bookDescriptionText = res['data'][0].EditorialReviews[0].EditorialReview[0].Content[0];
        this.description = bookDescriptionText.replace(/<\/?[^>]+(>|$)/g, '');
      } else {
        console.log('no description found');
      }
    });
  }

  getAmazonID(s) {
    const a = s.indexOf('dp/');
    if (a > -1) {
      const x = s.slice(a + 3);
      const b = x.indexOf('?');
      return x.slice(0, b);
    }

  }

}
