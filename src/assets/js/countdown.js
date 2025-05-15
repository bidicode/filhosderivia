var countDownDate = new Date("2025-05-31T13:00:00.000Z").getTime();
// var countDownDate = new Date().getTime() + 3600 * 1000 * 24 + 5000; // 1 day from now
// var countDownDate = new Date().getTime() + 15000; // 15 seconds from now

var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  if (distance <= 0) {
    clearInterval(x);
    document.getElementById("countdown-container").remove();
  } else {
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var text = (days ? (days + "d ") : ("")) + 
      (hours ? (hours + "h ") : ("")) + 
      (minutes ? (minutes + "m ") : ("")) + 
      seconds + "s";

    document.getElementById("countdown-value").innerHTML = text;
  }
}, 1000);