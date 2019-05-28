var elements = {
  'page_content' : document.getElementById('page-content'),
  'loading_text' : document.getElementById('loading-text'),
  'svg_wrapper' : document.getElementById('svg-wrapper'),
}

var slideshow = new SlideShow( slideshow_options );
var page_manager = new PageManager( elements, slideshow, pages );

window.addEventListener('load', page_manager.setPage);
window.addEventListener('hashchange', page_manager.setPage);
