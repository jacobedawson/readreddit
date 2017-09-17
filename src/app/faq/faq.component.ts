import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(meta: Meta, title: Title) {
    title.setTitle('Reddreader FAQ - Top Reddit Book Recommendations & Book Links');
    meta.addTag({
      name: 'description',
      content: `🔥 Reddreader FAQ - Reddit book recommendations from top subreddits each week. 
      Browse reddit book recommendations & lists of the best books.`
    });
  }

  ngOnInit() {
  }

}
