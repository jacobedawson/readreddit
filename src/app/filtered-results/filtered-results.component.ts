import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PostService } from './../post.service';

@Component({
  selector: 'app-filtered-results',
  templateUrl: './filtered-results.component.html',
  styleUrls: ['./filtered-results.component.scss']
})
export class FilteredResultsComponent implements OnInit {
  posts: any;
  subscription: Subscription;
  constructor(private postService: PostService) {
    this.subscription = this.postService.updatePosts().subscribe(res => {
      this.posts = res['data'][0].posts;
    });
  }


  // If there are no posts for a particular week, there needs to be some kind 
  // of message & data for the user
  ngOnInit() {
    this.postService.getPosts().subscribe(res => {
      console.log(res);
      if (res['data']) {
        // console.log(res['data']);
        this.posts = res['data'][0].posts;
      }
    });
  }

}
