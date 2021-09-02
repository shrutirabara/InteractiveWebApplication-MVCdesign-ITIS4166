var $slideshow = $(".cycle-slideshow");

$slideshow.click(function() {
    if ($slideshow.is(".cycle-paused"))
        $slideshow.cycle("resume");
    else
        $slideshow.cycle("pause");
});
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "until.txt", true);
    xhttp.send();
}
function loadDoc2() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo2").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "para.txt", true);
    xhttp.send();
}