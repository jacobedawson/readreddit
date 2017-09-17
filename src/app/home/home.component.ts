import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(meta: Meta, title: Title) {
    title.setTitle('Reddreader - Top Reddit Book Recommendations & Subreddit Book Links');
    meta.addTag({
      name: 'description',
      content: `🔥 Reddreader - Reddit book recommendations from the top subreddits every week. 
      Browse reddit book recommendations & get lists of the best books to read.`
    });
  }

  ngOnInit() {
  }

}
