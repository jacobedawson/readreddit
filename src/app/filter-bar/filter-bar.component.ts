import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  catalog = [];
  subreddits = [];
  selectedSubreddit = '';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getCatalog().subscribe(res => {
      if (res['error']) {
        console.log(res['error']);
      }
      if (res['data']) {
        this.catalog = res['data'];
        this.catalog.map(sub => {
          this.subreddits.push(sub.subreddit);
        });
      }
    });
  }

  // On the selection of a subreddit
  onSubredditSelection(e) {
    this.selectedSubreddit = e.target.value;
    this.postService.getSubredditPosts(this.selectedSubreddit);
  }


}
