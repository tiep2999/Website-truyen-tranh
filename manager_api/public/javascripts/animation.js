document.addEventListener("DOMContentLoaded", function () {
    //animation for New Story
    var newStory = document.querySelector(".new-story");
    var all_newStory = document.querySelectorAll(".newStory .card-comic");
    var tt = "duoi30";
    window.addEventListener("scroll", function () {
        if (window.pageYOffset > 100) {
            if (tt == "duoi30" && newStory != null) {
                newStory.classList.add("aniFooter2");
                var i = 0;
                setInterval(() => {
                    if (i < all_newStory.length) {
                        all_newStory[i].classList.add("addAnimationstr");
                    }
                    else {
                        clearInterval(this);
                    }
                    i++;
                }, 100);

                tt = "tren30";
            }
        }
        else {
            if (newStory != null) {
                newStory.classList.remove("aniFooter2");
                for (var i = 0; i < all_newStory.length; i++) {
                    all_newStory[i].classList.remove("addAnimationstr");
                }
                tt = "duoi30";
            }
        }
    })



    //Animation for Best Story

    var bestStory = document.querySelector('.best-story');
    var all_bestStory = document.querySelectorAll('.bestStory .card-comic');
    var ttb = "duoi900";
    window.addEventListener("scroll", function () {
        if (bestStory != null)
            if (window.pageYOffset > bestStory.offsetTop - 250) {
                if (ttb == "duoi900") {
                    bestStory.classList.add("aniFooter2");
                    var i = 0;
                    setInterval(() => {
                        if (i < all_bestStory.length) {
                            all_bestStory[i].classList.add("addAnimationstr");
                        }
                        else {
                            clearInterval(this);
                        }
                        i++;
                    }, 100);

                    ttb = "tren900";
                }
            }
            else {
                bestStory.classList.remove("aniFooter2");
                for (var i = 0; i < all_bestStory.length; i++) {
                    all_bestStory[i].classList.remove("addAnimationstr");
                }
                ttb = "duoi900";
            }
    })

    //animation for footer


    var footer = document.querySelector('.footer');
    var title = document.querySelectorAll('.text-uppercase');
    var list = document.querySelectorAll('.list-unstyled');
    var ttfooter = 'duoifooter';
    window.addEventListener("scroll", function () {
        if (window.pageYOffset > footer.offsetTop - 600) {
            if (ttfooter == "duoifooter") {
                //footer.classList.add("addAnimationFooter");
                for (var i = 0; i < title.length; i++)
                    title[i].classList.add('aniFooter');
                for (var i = 0; i < list.length; i++)
                    list[i].classList.add('aniFooter2');
                ttfooter = "trenfooter";
            }
        }
        else {
            //footer.classList.remove("addAnimationFooter");
            for (var i = 0; i < title.length; i++)
                title[i].classList.remove('aniFooter');
            for (var i = 0; i < list.length; i++)
                list[i].classList.remove('aniFooter2');
            ttfooter = "duoifooter";
        }
    })


}, false);