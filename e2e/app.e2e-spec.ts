import { eryazTemplatePage } from './app.po';

describe('eryaz App', function() {
  let page: eryazTemplatePage;

  beforeEach(() => {
    page = new eryazTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
