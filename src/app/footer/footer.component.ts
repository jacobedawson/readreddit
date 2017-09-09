import { NewsletterService } from './../newsletter.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  email = '';
  subscribeStatus = '';
  constructor(private newsletter: NewsletterService) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.email.length > 0) {
      this.newsletter.addSubscriber(this.email).subscribe(
        // Successful responses call the first callback.
        data => {
          this.subscribeStatus = 'Thanks for subscribing!';
        },
        // Errors will call this callback instead:
        err => {
          console.log(err);
          this.subscribeStatus = 'Sorry, there was an error';
        }
      );
    }
  }

}
