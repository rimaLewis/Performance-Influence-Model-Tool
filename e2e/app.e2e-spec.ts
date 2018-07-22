import { PerformanceToolPage } from './app.po';

describe('performance-tool App', function() {
  let page: PerformanceToolPage;

  beforeEach(() => {
    page = new PerformanceToolPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
