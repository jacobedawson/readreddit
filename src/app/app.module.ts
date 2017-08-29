import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

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
    BookcardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
