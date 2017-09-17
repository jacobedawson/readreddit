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
  posts: any;
  constructor(private meta: Meta, private title: Title, private postService: PostService) {
    this.subscription = this.postService.updatePosts().subscribe(res => {
      this.posts = res['data'][0].posts;
    });
    title.setTitle('Reddreader - Top Reddit Book Recommendations & Subreddit Book Links');
    meta.addTag({
      name: 'description',
      content: `🔥 Reddreader - Reddit book recommendations from the top subreddits every week. 
      Browse reddit book recommendations & get lists of the best books to read.`
    });
  }

  ngOnInit() {
    this.postService.getPosts().subscribe(res => {
      if (res['data']) {
        this.posts = res['data'][0].posts;
      }
    });
  }

}
