import { Injectable } from '@angular/core';
import { ScrollToService, ScrollToConfig } from '@nicky-lenaers/ngx-scroll-to';

@Injectable()
export class ScrollService {

    constructor(private _scrollToService: ScrollToService) { }

    public triggerScrollTo($event: Event) {

        const config: ScrollToConfig = {
            target: '#navbar'
        };

        this._scrollToService.scrollTo($event, config);
    }
}