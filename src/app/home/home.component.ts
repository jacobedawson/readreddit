import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { PostService } from './../post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  posts = [];
  catalog = [];
  subreddits = [];
  dates = [];

  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService) {
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
    const range = this.route.snapshot.params;
    if (range.year && range.week) {
      this.postService.getRange(range).subscribe(res => {
        if (res['data']) {
          this.processPostData(res['data'][0]);
        }
      }, error => {
        this.router.navigate(['/404']);
      });
    } else {
      this.postService.getCatalog().subscribe(res => {
        if (res['data']) {
          this.processPostData(res['data'][0]);
        }
      }, error => {
        this.router.navigate(['/404']);
      });
    }
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
    console.log(this.catalog);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
