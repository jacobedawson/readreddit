import { Component, OnInit } from '@angular/core';
import { PostService } from './../post.service';

@Component({
  selector: 'app-filtered-results',
  templateUrl: './filtered-results.component.html',
  styleUrls: ['./filtered-results.component.scss']
})
export class FilteredResultsComponent implements OnInit {
  posts;
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.getPosts().subscribe((res) => {
      console.log(res['data']);
      this.posts = res['data'][0].posts;
    });
  }

}
