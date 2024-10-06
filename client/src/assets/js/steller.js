
// smooth scroll
	$(document).ready(function () {

		var $hamburgerIcon = $("#hamburger-menu");
		var $hamburgerCrossIcon = $("#hamburger-cross");
		var $mobileMenu = $("#mobile-menu");
	
		$hamburgerIcon.on("click", function () {
			console.log("hello");
			$mobileMenu.css("display", "flex");
			setTimeout(function () {
				$mobileMenu.css("transform", "translateX(0%)"); // Slide in the menu
			}, 50); // Add a small delay for better transition effect
		});
	
		$hamburgerCrossIcon.on("click", function () {
			console.log("hello");
			$mobileMenu.css("transform", "translateX(-100%)"); // Slide out the menu
			setTimeout(function () {
				$mobileMenu.css("display", "none");
			}, 300); // Wait for the transition to end before hiding
		});
	
		// Check if screen size changes to desktop view and hide mobile menu
		$(window).on("resize", function () {
			if ($(window).width() > 770) {
				$mobileMenu.css("display", "none");
			}
		});

		// let $sidebar = $(".sidebar");
		// console.log("$sidebar", $sidebar);
		// let $closeBtn = $("#btn");
		// let $searchBtn = $(".bx-search");

		// $closeBtn.on("click", function () {
		// 	$sidebar.toggleClass("open");
		// 	menuBtnChange();
		// });

		// $searchBtn.on("click", function () {
		// 	$sidebar.toggleClass("open");
		// 	menuBtnChange();
		// });

		// function menuBtnChange() {
		// 	if ($sidebar.hasClass("open")) {
		// 		$closeBtn.removeClass("bx-menu").addClass("bx-menu-alt-right");
		// 	} else {
		// 		$closeBtn.removeClass("bx-menu-alt-right").addClass("bx-menu");
		// 	}
		// }


		
		
		// $('.toggle-password').click(function(){
		// 	console.log("hfshgd",$('.toggle-password'))
		// 	$(this).toggleClass('show');
		// 	var passwordInput = $(this).siblings('.password-input');
		// 	if (passwordInput.attr('type') === 'password') {
		// 		passwordInput.attr('type', 'text');
		// 	} else {
		// 		passwordInput.attr('type', 'password');
		// 	}
		// });

		
	});