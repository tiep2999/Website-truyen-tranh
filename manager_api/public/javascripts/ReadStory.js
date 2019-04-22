document.addEventListener("DOMContentLoaded", function () {

    var btn1 = document.querySelector('div a.btn1');
    var allList = document.querySelectorAll('embed.readFont');
    console.log(allList);
    var i = 0;
    if (btn1 != null)
        btn1.addEventListener('click', function () {
            i++;
            for (let i = 0; i < allList.length; i++) {

                allList[i].classList.remove("active");

            }
        })

}, false);