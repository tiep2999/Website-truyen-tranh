document.addEventListener("DOMContentLoaded", function () {
	// body... 
	var trangthai = "duoi300";
    var menu = document.querySelector(".haveMenu");
    var menu1 = document.querySelector(".menu");
    var logo = document.querySelector(".menu a");
	window.addEventListener("scroll",function(){
		if(window.pageYOffset>0){
			if(trangthai=="duoi300"){
                menu.classList.add("scollPage");
                menu1.classList.add("menuMin");
                logo.classList.add("minBar");
				trangthai = "tren300";
			}
		}
		else{
            menu.classList.remove("scollPage");
            menu1.classList.remove("menuMin");
            logo.classList.remove("minBar");
			trangthai = "duoi300";
		}
	})
	
},false);