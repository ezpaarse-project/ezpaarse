alert("pamplemousse !");
    $.ajax({
      url: 'http://localhost:59599/ws/info/platforms/'
    }).done(function (platforms) { 
      var i = 0;
      platforms = JSON.parse(platforms);
      if (platforms === undefined) {
        console.log(platforms);
        alert("Erreur : l'instance locale ezPAARSE ne rÃ©pond pas");
      } else {
        platforms.forEach(function (platform) {
            console.log(platform.describe);
            console.log(platform.docurl);
            i++;
        });
        console.log("Enregistrements valides : "+ i);
      }
    }).error(function (jqXHR) { 
      alert('Erreur : le serveur de donnÃ©es renvoie une erreur (' +
        jqXHR.status + ' : ' + jqXHR.statusText + ')');
      console.log(jqXHR);
      
    });
