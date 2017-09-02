import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  subreddits = {
    1: 'startups',
    2: 'entrepreneur',
    3: 'webdev'
  };
  selectedSubreddit = this.subreddits[1];

  constructor(private postService: PostService) {}

  ngOnInit() {
  }

  onSubredditSelection(e) {
    this.selectedSubreddit = this.subreddits[e.target.value];
    this.postService.getSubredditPosts(this.selectedSubreddit);
  }


}
