import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-newsletter-page',
  templateUrl: './newsletter-page.component.html',
  styleUrls: ['./newsletter-page.component.scss']
})
export class NewsletterPageComponent implements OnInit {

  constructor(meta: Meta, title: Title) {
    title.setTitle('Reddreader Newsletter - Reddit Book Recommendations & Book Links');
    meta.addTag({
      name: 'description',
      content: `🔥 Reddreader Newsletter - Reddit book recommendations from top subreddits each week. 
      Browse reddit book recommendations & lists of books.`
    });
  }


  ngOnInit() {
  }

}
