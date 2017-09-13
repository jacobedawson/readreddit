import { AppComponent } from './app.component';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        AppModule,
        ServerModule
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule {}
