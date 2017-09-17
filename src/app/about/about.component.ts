import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(meta: Meta, title: Title) {
    title.setTitle('About Reddreader - Top Reddit Book Recommendations & Book Links');
    meta.addTag({
      name: 'description',
      content: `🔥 About Reddreader - Reddit book recommendations from the top subreddits every week. 
      Browse reddit book recommendations & lists of the best books.`
    });
  }

  ngOnInit() {
  }

}
