import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-filtered-results',
  templateUrl: './filtered-results.component.html',
  styleUrls: ['./filtered-results.component.scss']
})
export class FilteredResultsComponent implements OnInit {
  @Input() posts;

  constructor() {}

  ngOnInit() {}

}
