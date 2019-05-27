function PageManager( elements, slide_show, page_names ){

  var gotoLoadText = function(){
    elements.loading_text.style.display = 'flex';
    elements.page_content.style.display = 'none';
    elements.svg_wrapper.style.display = 'none';
  }

  var gotoSlideshow = function(){
    elements.loading_text.style.display = 'none';
    elements.page_content.style.display = 'none';
    elements.svg_wrapper.style.display = 'flex';
  }

  var gotoContent = function( html ){
    elements.page_content.innerHTML = html;
    elements.loading_text.style.display = 'none';
    elements.page_content.style.display = 'flex';
    elements.svg_wrapper.style.display = 'none';
  }

  this.setPage = function(){
    gotoLoadText();
    var hash = window.location.hash;
    var page_name = page_names.find(function(x){
      return '#'+x === hash;
    });
    if( hash  === '' || hash === '#' ){
      if( slide_show.isReady() ){ gotoSlideshow(); }
      else {
        slide_show.load(function(){
          elements.svg_wrapper.appendChild( slide_show.svg );
          gotoSlideshow();
        });
      }
    } else {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          gotoContent( xhr.response );
        }
      }

      var href = [
        window.location.origin,
        window.location.pathname,
        '/pages/',
        hash.split('#').pop()
      ].join('');

      xhr.open('GET', href+'.html', true);
      xhr.send(null);
    }
  };

}
