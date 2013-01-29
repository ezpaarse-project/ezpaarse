window.onload = function () {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var list  = document.getElementById("platformsList");
    platforms = JSON.parse(xhr.responseText);
    platforms.forEach(function (platform) {
      var li  = document.createElement('li');
      var a   = document.createElement('a');
      a.setAttribute('href', platform.docurl);
      a.appendChild(document.createTextNode(platform.longname));
      li.appendChild(a);
      list.appendChild(li);
    });
  }
  xhr.onerror = function() {
    alert('Erreur : le serveur de données renvoie une erreur (' +
      xhr.status + ' : ' + xhr.statusText + ')');
    console.log(xhr);
  }
  xhr.open('GET', 'http://ezpaarse.analogist.couperin.org/ws/info/platforms', true);
  xhr.send(null);
}