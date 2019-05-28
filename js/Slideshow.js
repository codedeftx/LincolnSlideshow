
function SlideShow( options ){

  var createElement = function( name ){
    return document.createElementNS('http://www.w3.org/2000/svg', name );
  };

  var loadSlides = function( slides, callback ){
    var images_loaded = 0;
    return slides.map( function(slide, i){

      var group = createElement('svg');
      group.setAttribute('y', slideTargetY() );
      group.setAttribute('class', 'slide-group' );
  
      var index_text = createElement('text');
      index_text.textContent = (i+1)+'';
      index_text.setAttribute('class','index-text');
  
      var title_text = createElement('text');
      title_text.setAttribute('class','title-text');
      title_text.setAttribute('y', 'calc('+options.slide_height+'/2)' );
      title_text.setAttribute('opacity', 0 );
  
      var footer_text = createElement('text');
      footer_text.setAttribute('class', 'footer-text');
      footer_text.setAttribute('y', options.slide_height);
      footer_text.textContent = slide.footer;

      if( slide.title ){
        title_text.textContent = slide.title;
        title_text.setAttribute('x', 'calc('+options.slide_width+'/2)'  );
      } else if( slide.title_lines ){
        for( var i=0; i<slide.title_lines.length; ++i ){
          var line = createElement('tspan');
          line.textContent = slide.title_lines[i];
          line.setAttribute('x', 'calc('+options.slide_width+'/2)'  );
          line.setAttribute('dy', i*20 )
          line.setAttribute('class', 'title-text' )
          title_text.appendChild(line);
        }
      }
  
      var image = createElement('image');

      var href = [
        window.location.origin,
        window.location.pathname,
        options.img_path,
        slide.filename
      ].join('');

      image.setAttribute('href', href);
      image.setAttribute('x', 0);
      image.setAttribute('y', 0);
      image.setAttribute('width', options.slide_width);
      image.setAttribute('height', options.slide_height);
      image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      image.onload = function(){
        if( ++images_loaded === slides.length ){
          callback();
        }
      };

      group.appendChild(image);
      group.appendChild(index_text);
      group.appendChild(title_text);
      group.appendChild(footer_text);

      slide.index = i;
      slide.svg = group;
      slide.title_text = title_text;
      return slide;
    });
  };

  var slideTargetX = function ( i, n ){
    var r = (i*100) / (n+1);
    return 'calc('+r+'% - ('+options.slide_width+')/2)';
  };

  var slideTargetY = function (){
    return 'calc(50% - ('+options.slide_height+')/2)'
  };

  var eachSlide = function( itter ){
    for( var i=0; i<svg.childNodes.length; ++i ){
      itter( svg.childNodes[i], i );
    }
    
  };

  function slideAnim( dt, current, next ){

    animating = true;

    anime({
      'targets' : current.title_text,
      'opacity': 0,
      'duration' : 700,
      'easing' : 'easeOutExpo'
    });

    anime({
      'targets' : next.title_text,
      'opacity': 1.0,
      'delay' : 300,
      'duration' : 700,
      'easing' : 'easeOutExpo'
    });

    var dur = 1400;
    var del = 100;
    eachSlide(function(node, i){
      anime({
        'targets' : node,
        'x': slideTargetX( (i+dt)*2, 3),
        'delay': del,
        'duration' : dur,
        'easing' : 'easeOutExpo'
      });
    });
    setTimeout(function(){
      animating = false;
    }, dur+del);
  }

  function clickRight(){
    var new_slide = current_slide.next.next;
    new_slide.svg.setAttribute('x', slideTargetX( 6, 3));
    svg.appendChild( new_slide.svg );
    slideAnim(-1, current_slide, current_slide.next);
    current_slide = current_slide.next;
  }
 
  function clickMiddle(){
    var pagename = current_slide.pagename;
    window.location.hash = options.slideshow_path+pagename.split('.html').shift();
  }
 
  function clickLeft(){
    var new_slide = current_slide.prev.prev;
    new_slide.svg.setAttribute('x', slideTargetX( -2, 3));
    console.log( new_slide  )
    svg.insertBefore( new_slide.svg, svg.childNodes[0] );
    slideAnim(0, current_slide, current_slide.prev);
    current_slide = current_slide.prev;
  }

  this.svg = createElement('svg');
  var view_width = options.view_width;
  var view_height = options.view_height;
  var center_x = view_width / 2;
  var center_y = view_height / 2;

  this.svg.setAttribute('viewBox', '0 0 ' + view_width + ' ' + view_height);
  this.svg.setAttribute('preserveAspectRatio', 'xMidYMid slice' );
  this.svg.setAttribute('class', 'slideshow-svg noselect');

  var slides = [];
  var current_slide = null;
  var svg = this.svg;
  var ready = false;
  var animating = false;

  this.isReady = function(){
    return ready;
  }

  this.load = function( loaded ){
    slides = loadSlides( options.slides, function(){
      ready = true;
      loaded();
    });

    [
      slides[slides.length-1],
      slides[0],
      slides[1]
    ].forEach(function(slide, i){
      slide.svg.setAttribute('x', slideTargetX( i*2, 3));
      svg.appendChild(slide.svg);
    });

    current_slide = slides[0];
    current_slide.title_text.setAttribute('opacity', '1.0');

    var prev = null;
    slides.forEach(function(slide, i){
      slide.prev = prev;
      if(slide.prev){ slide.prev.next = slide; }
      prev = slide;
    });
    slides[0].prev = slides[slides.length-1];
    slides[slides.length-1].next = slides[0];
  };

  this.svg.onclick = function ( event ){
    if( animating ){ return; }
    var ratio = window.innerWidth / 3;
    var i = parseInt( event.clientX / ratio );
    [ clickLeft, clickMiddle, clickRight ][i](); 
  };
}
