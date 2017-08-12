import { ReadredditPage } from './app.po';

describe('readreddit App', function() {
  let page: ReadredditPage;

  beforeEach(() => {
    page = new ReadredditPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
