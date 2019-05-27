var elements = {
  'page_content' : document.getElementById('page-content'),
  'loading_text' : document.getElementById('loading-text'),
  'svg_wrapper' : document.getElementById('svg-wrapper'),
}

var pages = [ 'work', 'about' ]
  .concat(slideshow_options.slides.map(function(x){
    return slideshow_options.page_path + x.pagename.split('.html').shift();
  }));

var slideshow = new SlideShow( slideshow_options );
var page_manager = new PageManager( elements, slideshow, pages );

window.addEventListener('load', page_manager.setPage);
window.addEventListener('hashchange', page_manager.setPage);
