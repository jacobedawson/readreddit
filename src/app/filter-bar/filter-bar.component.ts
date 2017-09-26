import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostService } from './../post.service';

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
  @Input() dates;
  @Input() subreddits;
  @Output()
  subredditSelect = new EventEmitter<String>(); // creating an output event
  constructor(private postService: PostService) { }

  ngOnInit() {}

  onSubredditSelection(e) {
    this.subredditSelect.emit(e.target.value);
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
