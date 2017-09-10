import { Component, OnInit } from '@angular/core';
import { NewsletterService } from './../newsletter.service';

@Component({
  selector: 'app-newsletter-form',
  templateUrl: './newsletter-form.component.html',
  styleUrls: ['./newsletter-form.component.scss']
})
export class NewsletterFormComponent implements OnInit {
  email = '';
  subscribeStatus = '';
  constructor(private newsletter: NewsletterService) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.email.length > 0) {
      this.newsletter.addSubscriber(this.email).subscribe(
        data => {
          this.subscribeStatus = 'Thanks for subscribing!';
        },
        err => {
          console.log(err);
          this.subscribeStatus = 'Sorry, there was an error';
        }
      );
    }
  }

}
