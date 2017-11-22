import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from './../post.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  selectedDate = '';
  activeSub;
  @Input() dates;
  @Input() subreddits;
  @Input() selectedSubreddit;
  @Output()
  subredditSelect = new EventEmitter<String>(); // creating an output event
  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit() {
    const dates = this.route.snapshot.params;
    if (dates.year && dates.week) {
      this.selectedDate = dates.week + dates.year;
    }
  }

  onSubredditSelection(e) {
    console.log('changed', e);
    this.subredditSelect.emit(e.target.value);
  }

  onDateSelection(e) {
    this.selectedDate = e.target.value;
    const week = this.selectedDate.slice(0, 2);
    const year = this.selectedDate.slice(2);
    this.postService.getSubredditPosts({
      week: this.selectedDate.slice(0, 2),
      year: 2017
    });
  }

  onFilterSearch() {
    if (this.selectedSubreddit && this.selectedDate) {
      const week = this.selectedDate.slice(0, 2);
      const year = this.selectedDate.slice(2);
      this.postService.getSubredditPosts({
        week,
        year
      });
    }
  }

}
