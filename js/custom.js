jQuery(document).ready(function(){ 
	
	/* ---------------------------------------------------------------------- */
	/*	Custom Functions
	/* ---------------------------------------------------------------------- */

	// Logo
	var $logo 	= $('#logo');

    if (location.href.indexOf("#") != -1) {
        $logo.show();
    }
	// Show logo 
	$('.menu .tabs a').click(function() {
	  $logo.fadeIn('slow');
	});
	// Hide logo
	$('.tab-profile').click(function() {
	  $logo.fadeOut('slow');
	});	

	 
	/* ---------------------------------------------------------------------- */
	/*	Menu
	/* ---------------------------------------------------------------------- */
	
	// Needed variables
	var $content 		= $("#content");
	
	// Run easytabs
  	$content.easytabs({
	  animate			: true,
	  updateHash		: false,
	  transitionIn		:'slideDown',
	  transitionOut		:'slideUp',
	  animationSpeed	:600,
	  tabs				:".tmenu",
	  tabActiveClass	:'active',
	});

	
	// Hover menu effect
	$content.find('.tabs li a').hover(
		function() {
			$(this).stop().animate({ marginTop: "-7px" }, 200);
		},function(){
			$(this).stop().animate({ marginTop: "0px" }, 300);
		}
	);

	// Menu Navigation
	 $(".menu .tabs").carouFredSel({
        responsive          : true,
        direction           : "left",
 	    circular: false,
    	infinite: false,
        pagination  		: "#menu-controls",  
        auto    			: false,
        scroll 			: {
            items           : 1,
            duration        : 300,                        
            wipe    : true
        },
		prev	: {	
			button	: "#menu-prev",
			key		: "right"
		},
		next	: { 
			button	: "#menu-next",
			key		: "left"
		},
	    swipe: {
	        onTouch: true
	    },
        items: {
            width: 140,
            visible: {
              min: 2,
              max: 5
            }
        }           
    });

	/* ---------------------------------------------------------------------- */
	/*	Analystics
	/* ---------------------------------------------------------------------- */
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  	ga('create', 'UA-89884618-1', 'auto');
  	ga('send', 'pageview');

});	