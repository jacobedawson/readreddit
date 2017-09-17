import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  catalog: any = [];
  selectedSubreddit = false;
  selectedDate;
  activeSub;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.getCatalog().subscribe(res => {
      if (res['data']) {
        this.catalog = res['data'];
        this.catalog.map((x) => x.dates.reverse());
        this.activeSub = this.catalog[0];
        this.selectedSubreddit = this.catalog[0].subreddit;
        this.selectedDate = this.catalog[0].dates[0].week + '2017';
      }
    });
  }

  /* 
    TODO: The functionality on this page is becoming very messy
    and hard to follow. There are too many hard-coded functions & data.
  */
  onSubredditSelection(e) {
    this.selectedSubreddit = e.target.value;
    this.activeSub = this.catalog.filter(cat => {
      return cat.subreddit === this.selectedSubreddit;
    })[0] || [];
    this.selectedDate = this.activeSub.dates[0].week + '2017';
    this.postService.getSubredditPosts({
      sub: this.selectedSubreddit,
      week: this.selectedDate.slice(0, 2),
      year: 2017
    });
  }

  onDateSelection(e) {
    this.selectedDate = e.target.value;
    this.postService.getSubredditPosts({
      sub: this.selectedSubreddit,
      week: this.selectedDate.slice(0, 2),
      year: 2017
    });
  }

  onFilterSearch() {
    if (this.selectedSubreddit && this.selectedDate) {
      const week = this.selectedDate.slice(0, 2);
      const year = this.selectedDate.slice(2);
      this.postService.getSubredditPosts({
        sub: this.selectedSubreddit,
        week,
        year
      });
    }
  }

}
