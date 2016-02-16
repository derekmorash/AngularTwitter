$(function() {
  smoothScroll(300); //call smoothScroll function
  navToggle(); //call navToggle function
  // $('#email').fluidText(); //call fluidText Function
  headerPosition(); //call headerPosition function
  allPosts();
});

$(window).scroll(function() {
  postBG();
});

// smoothScroll function is applied from the document ready function
function smoothScroll (duration) {
	$('a[href^="#"]').on('click', function(event) {

	    var target = $( $(this).attr('href') );

	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, duration);
	    }
	});
}

/*
 * mobile nav toggle
 * toggles class on or off
 * my selectors specificity is way to strong lol
 */
function navToggle() {
  //when menu hamburger is clicked
  $('.hamburger').click(function() {
    $('#nav').addClass('nav-open');
  });
  //when menu close "X" is clicked
  $('#close-nav').click(function() {
    $('#nav').removeClass('nav-open');
  });
  //when menu link is clicked
  $('#nav a').click(function() {
    $('#nav').removeClass('nav-open');
  });
} //end navToggle

/*
 * about section position header in the middle of the window
 * uses margin top to push the section down to the right height
 */
function headerPosition() {
  var about = $('.about');
  var textHeight;
  var windowHeight;

  reposition();

  function reposition() {
    //get the height of the window
    windowHeight = $(window).height();
    //get the height of the header text
    textHeight = about.find('h1').height();

    //if the window is taller than 400px
    if(windowHeight > 400) {
      //add a margin-top to the about selection-color
      //margin is half the window height minus the 100px header, and minus half the text height
      about.css('margin-top', (windowHeight/2) - 100 - (textHeight/2));
    } else {
      //usually for phones in landscape
      //add margin-top of only 50px
      about.css('margin-top', 50);
    }
  }

  //call the reposition function on window resize
  $( window ).resize(function() {
    reposition();
  });

  //call the reposition function on window resize
  $( window ).on("orientationchange", function() {
    reposition();
  });
} //end headerPosition

/*
 * Change post page background-color
 * When the .post--article div is scrolled to the top of the window
 */
function postBG(){
  //if user is on a post page
  if($('.post--article').length) {

    //get the scroll position
    var wScroll = $(window).scrollTop();

    //if the window is between the article and the comments section
    //change the background color to white
    //otherwise change it to the regular bg color
    if($('.post--article').offset().top/1.2 < wScroll && $('#disqus_thread').offset().top > wScroll + 500) {
      /*
       *only change bg color if the color isn't already the white color
       *this is so the color isn't constantly being updated when it doesn't need to be
       */
      if($('body').css('background-color') !== 'rgb(242, 242, 242)') {
        $('body').css('background-color', '#f2f2f2');
      }
    } else {
      /*
       *only change bg color if the color isn't already the regular color
       *this is so the color isn't constantly being updated when it doesn't need to be
       */
      if($('body').css('background-color') != 'rgb(248, 181, 147)') {
        $('body').css('background-color', '#f8b593');
      }
    }
  }
}


/*
 * Switching text on the all posts button
 */
function allPosts() {
  var allPosts = $('#all-posts');
  setInterval(function() {
    if(allPosts.text() === 'All') {
      allPosts.text('Posts');
    } else {
      allPosts.text('All');
    }
  }, 800);
}
