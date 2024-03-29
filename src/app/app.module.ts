/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

/* x */
import { UrlSerializer } from '@angular/router';
import { CustomUrlSerializer } from './CustomURL';

/* Services */
import { NewsletterService } from './newsletter.service';
import { PostService } from './post.service';
import { BookService } from './services/book/book.service';

/* Components */
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { FooterComponent } from './footer/footer.component';
import { FilteredResultsComponent } from './filtered-results/filtered-results.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { IntrotextComponent } from './introtext/introtext.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { BookcardComponent } from './bookcard/bookcard.component';
import { NewsletterModalComponent } from './newsletter-modal/newsletter-modal.component';
import { NewsletterFormComponent } from './newsletter-form/newsletter-form.component';
import { NewsletterPageComponent } from './newsletter-page/newsletter-page.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { BookViewComponent } from './book-view/book-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PostComponent,
    FooterComponent,
    FilteredResultsComponent,
    NotFoundComponent,
    IntrotextComponent,
    FilterBarComponent,
    BookcardComponent,
    BookViewComponent,
    NewsletterModalComponent,
    NewsletterFormComponent,
    NewsletterPageComponent,
    AboutComponent,
    FaqComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'reddreader-ssr' }),
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [PostService, NewsletterService, BookService, { provide: UrlSerializer, useClass: CustomUrlSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
