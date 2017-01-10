    function htmlbodyHeightUpdate(){
		var height3 = $( window ).height()
		var height1 = $('.nav').height()+50
		height2 = $('.main').height()
		if(height2 > height3){
			$('html').height(Math.max(height1,height3,height2)+10);
			$('body').height(Math.max(height1,height3,height2)+10);
		}
		else
		{
			$('html').height(Math.max(height1,height3,height2));
			$('body').height(Math.max(height1,height3,height2));
		}
		
	}
	$(document).ready(function () {
		htmlbodyHeightUpdate()
		$( window ).resize(function() {
			htmlbodyHeightUpdate()
		});
		$( window ).scroll(function() {
			height2 = $('.main').height()
  			htmlbodyHeightUpdate()
		});


		$('.sideMenu li').find("a[link]").not('.dropdown-toggle').on("click",function(e){
		//	$(".cssload-container").show();
		    e.stopImmediatePropagation();
		    if(!$(this).closest("ul").hasClass("dropdown-menu")){
		    	$(".dropdown",".sideMenu").removeClass("open");
		    }
		    var hrefURL = $(this).attr("link");
		    var iframeURL = $("iframe").attr("src");

		    if(hrefURL != iframeURL)
				$("iframe").attr("src",hrefURL);
		//	$(".cssload-container").hide();
		});

	});

