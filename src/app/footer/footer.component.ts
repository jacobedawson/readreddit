import { Component, OnInit } from '@angular/core';
import { ScrollService } from './../scroll.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private scrollTo: ScrollService) {}

  ngOnInit() {}

  onScrollTo($event) {
    this.scrollTo.triggerScrollTo($event);
  }

}
