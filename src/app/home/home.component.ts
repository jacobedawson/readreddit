import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { PostService } from './../post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  subscription: Subscription;
  posts = [];
  catalog = [];
  subreddits = [];
  dates = [];

  constructor(private meta: Meta, private title: Title, private postService: PostService) {
    // Subscribe to the post service
    this.subscription = this.postService.updatePosts().subscribe(res => {
      if (res['data']) {
        this.processPostData(res['data'][0]);
      }
    });

    title.setTitle('Reddreader - Top Reddit Book Recommendations & Subreddit Book Links');
    meta.addTag({
      name: 'description',
      content: `🔥 Reddreader - Reddit book recommendations from the top subreddits every week. 
      Browse reddit book recommendations & get lists of the best books to read.`
    });
  }

  ngOnInit() {
    this.postService.getCatalog().subscribe(res => {
      if (res['data']) {
        this.processPostData(res['data'][0]);
      }
    });
    // Get all history
    this.postService.getHistory().subscribe(res => {
      if (res['data']) {
        this.processHistoryData(res['data']);
      }
    });
  }

  processPostData(data) {
    this.subreddits = data.results.map(res => res.subreddit);
    this.posts = data.results[0].posts;
    this.catalog = data.results;
  }

  processHistoryData(data) {
    data.forEach(dateObject => {
      this.dates.push({
        week: dateObject.week,
        year: dateObject.year
      });
    });
  }

  onSubredditSelect(sub) {
    this.catalog.forEach(arr => {
      if (arr.subreddit === sub) {
        this.posts = arr.posts;
      }
    });
  }

}
