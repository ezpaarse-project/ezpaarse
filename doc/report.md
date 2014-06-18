# Contenu du rapport #

ezPAARSE produit un rapport d'exécution.  
Les différentes sections disponibles sont documentées ici.

-  [Général](#general) Contient toutes les informations générales liées au traitement
-  [Rejets](#rejets) Répertories tous les rejets rencontrés, leur nombre et les liens vient les fichiers contenant les lignes écartées
-  [Statistiques](#stats) Fourni les premiers chiffres 
-  [Dédoublonnage](#dedoublonnage) Algorithme utilisé pour le dédoublonnage
-  [Fichiers](#files) Rappel du nom des fichiers de log utilisés pour le traitement
-  [Première consultation](#first_event) Contenu du premier événement de consultation



<div>
  <h3 id="general" class="ui purple dividing header">
    Général
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">Job-Date</th>
      <td>2014-06-16T14:55:04+02:00
        <div class="comment">Date d'execution du traitement</div>
      </td>
    </tr><tr>
      <th class="four wide">Job-Done</th>
      <td>true
        <div class="comment">Le traitement s'est-il bien terminé ?</div>
      </td>
    </tr><tr>
      <th class="four wide">Job-Duration</th>
      <td>4 m 22 s 
        <div class="comment">Durée du traitement</div>
      </td>
    </tr><tr>
      <th class="four wide">Job-ID</th>
      <td>6f601540-f555-11e3-b477-758199fa5dc1
        <div class="comment">Identifiant unique du traitement</div>
      </td>
    </tr><tr>
      <th class="four wide">Rejection-Rate</th>
      <td>96.74 %
        <div class="comment">Taux de lignes rejetées (ie. domaines inconnus, doublons...) parmi les lignes pertinentes.</div>
      </td>
    </tr><tr>
      <th class="four wide">URL-Traces</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log</a>
      <div class="comment">Accès aux traces d'exécution du traitement</div>
      </td>
    </tr><tr>
      <th class="four wide">client-user-agent</th>
      <td>Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/33.0.1750.152 Chrome/33.0.1750.152 Safari/537.36
      </td>
    </tr><tr>
      <th class="four wide">ezPAARSE-version</th>
      <td>ezPAARSE 1.7.0
      </td>
    </tr><tr>
      <th class="four wide">geolocalization</th>
      <td>geoip-lookup
        <div class="comment">Type de géolocalisation demandée</div>
      </td>
    </tr><tr>
      <th class="four wide">git-branch</th>
      <td>master
      </td>
    </tr><tr>
      <th class="four wide">git-last-commit</th>
      <td>429e61bf29e80326b09958b0a68a01c0ae3add91
      </td>
    </tr><tr>
      <th class="four wide">git-tag</th>
      <td>1.7.0
      </td>
    </tr><tr>
      <th class="four wide">input-first-line</th>
      <td>rate-limited-proxy-72-14-199-16.google.com - - [19/Nov/2013:00:11:05 +0100] "GET http://gate1.inist.fr:50162/login?url=http://www.nature.com/rss/feed?doi=10.1038/465529d HTTP/1.1" 302 0
      <div class="comment">Première ligne trouvée dans le fichier de log soumis</div>
      </td>
    </tr><tr>
      <th class="four wide">input-format-literal</th>
      <td>%h %l %u %t "%r" %s %b (ezproxy)
        <div class="comment">Format utilisé pour identifier les éléments des lignes de log</div>
      </td>
    </tr><tr>
      <th class="four wide">input-format-regex</th>
      <td>^([a-zA-Z0-9\.\-]+(?:, ?[a-zA-Z0-9\.\-]+)*) ([a-zA-Z0-9\-]+|\-) ([a-zA-Z0-9@\.\-_%,=]+) \[([^\]]+)\] "[A-Z]+ ([^ ]+) [^ ]+" ([0-9]+) ([0-9]+)$
        <div class="comment">Expression régulière correspondant au format de reconnaissance des lignes de log</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-denied-ecs</th>
      <td>104
        <div class="comment">Nombre d'événements de consultation en accès refusé (ressources non souscrites)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-ecs</th>
      <td>14224
        <div class="comment">Nombre total d'événements de consultation</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-input</th>
      <td>792049
        <div class="comment">Nombre de lignes de log en entrée</div>
      </td>
    </tr><tr>
      <th class="four wide">process-speed</th>
      <td>3019 lignes/s
        <div class="comment">Vitesse du traitement (variable selon la machine)</div>
      </td>
    </tr><tr>
      <th class="four wide">result-file-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1</a>
        <div class="comment">Lien d'accès au fichier résultat</div>
      </td>
    </tr><tr>
      <th class="four wide">url-denied-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv</a>
        <div class="comment">Lien d'accès au fichier des événements de consultation en accès refusé (ressources non-souscrites)</div>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="rejets" class="ui purple dividing header">
    Rejets
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">nb-lines-duplicate-ecs</th>
      <td>1893
        <div class="comment">Nombre d'EC dédoublonnés selon la stratégie COUNTER</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-ignored</th>
      <td>351891
        <div class="comment">Nombre de lignes ignorées (non pertinentes)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-ignored-domains</th>
      <td>4
        <div class="comment">Nombre de lignes dont le domaine est ignoré (ie. présent dans EZPAARSE_IGNORED_DOMAINS) </div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-pkb-miss-ecs</th>
      <td>2107
        <div class="comment">Nombre de lignes avec identifiants éditeur sans correspondance</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unknown-domains</th>
      <td>335068
        <div class="comment">Nombre de lignes ayant un domaine inconnu</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unknown-formats</th>
      <td>1891
        <div class="comment">Nombre de lignes ayant un format inconnu</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unordered-ecs</th>
      <td>0
        <div class="comment">Nombre de lignes chronologiquement désordonnées (l'ordre chronologique est nécessaire au dédoublonnage)</div>
      </td>
    </tr><tr>
      <th class="four wide">nb-lines-unqualified-ecs</th>
      <td>86974
        <div class="comment">Nombre de lignes non qualifiées (trop pauvres en informations)</div>
      </td>
    </tr><tr>
      <th class="four wide">url-duplicate-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log</a>
        <div class="comment">Lien vers le fichier contenant les lignes écartées par le dédoublonage</div>
      </td>
    </tr><tr>
      <th class="four wide">url-ignored-domains</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log</a>
        <div class="comment">Lien vers le fichier contenant les lignes ayant un domaine ignoré</div>
      </td>
    </tr><tr>
      <th class="four wide">url-pkb-miss-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log</a>
        <div class="comment">Lien vers le fichier contenant les lignes écartées avec identifiants éditeur sans correspondance</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unknown-domains</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log</a>
        <div class="comment">Lien vers le fichier contenant les lignes écartées avec un domaine ignoré</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unknown-formats</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log</a>
        <div class="comment">Lien vers le fichier contenant les lignes écartées avec un format inconnu</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unordered-ecs</th>
      <td>
        <div class="comment">Lien vers le fichier contenant les lignes écartées avec une anomalie chronologique</div>
      </td>
    </tr><tr>
      <th class="four wide">url-unqualified-ecs</th>
      <td><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log
        <div class="comment">Lien vers le fichier contenant les lignes écartées car trop pauvres en informations</div>
      </a>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="stats" class="ui purple dividing header">
    Statistiques
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">mime-HTML</th>
      <td>4540
        <div class="comment">Nombre d'EC des principaux types mime rencontrés (nom préfixé par mime-)</div>
      </td>
    </tr><tr>
      <th class="four wide">mime-MISC</th>
      <td>3612</td>
    </tr><tr>
      <th class="four wide">mime-PDF</th>
      <td>6072</td>
    </tr><tr>
      <th class="four wide">platform-acs
      </th>
      <td>538
        <div class="comment">Nombre d'EC des plateformes rencontrées (nom préfixé par platform-nom_court de la plateforme)</div>
      </td>
    </tr><tr>
      <th class="four wide">platform-ar</th>
      <td>97</td>
    </tr><tr>
      <th class="four wide">platform-bioone</th>
      <td>15</td>
    </tr><tr>
      <th class="four wide">platform-bmc</th>
      <td>75</td>
    </tr><tr>
      <th class="four wide">platform-cup</th>
      <td>22</td>
    </tr><tr>
      <th class="four wide">platform-edp</th>
      <td>27</td>
    </tr><tr>
      <th class="four wide">platform-hw</th>
      <td>1740</td>
    </tr><tr>
      <th class="four wide">platform-jstor</th>
      <td>9</td>
    </tr><tr>
      <th class="four wide">platform-mal</th>
      <td>97</td>
    </tr><tr>
      <th class="four wide">platform-metapress</th>
      <td>27</td>
    </tr><tr>
      <th class="four wide">platform-npg</th>
      <td>3132</td>
    </tr><tr>
      <th class="four wide">platform-sd</th>
      <td>5255</td>
    </tr><tr>
      <th class="four wide">platform-springer</th>
      <td>1675</td>
    </tr><tr>
      <th class="four wide">platform-wiley</th>
      <td>1515</td>
    </tr><tr>
      <th class="four wide">platforms</th>
      <td>14
        <div class="comment">Nombre de platformes différentes rencontrées pour ce traitement</div>
      </td>
    </tr><tr>
      <th class="four wide">rtype-ABS</th>
      <td>1142
        <div class="comment">Nombre d'EC des principaux types de ressource rencontrés (nom préfixé par rtype-)</div>
      </td>
    </tr><tr>
      <th class="four wide">rtype-ARTICLE</th>
      <td>9991</td>
    </tr><tr>
      <th class="four wide">rtype-BOOK</th>
      <td>218</td>
    </tr><tr>
      <th class="four wide">rtype-BOOKSERIE</th>
      <td>23</td>
    </tr><tr>
      <th class="four wide">rtype-BOOK_SECTION</th>
      <td>314</td>
    </tr><tr>
      <th class="four wide">rtype-TOC</th>
      <td>2536</td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="dedoublonnage" class="ui purple dividing header">
    Dédoublonnage
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">activated</th>
      <td>true</td>
    </tr><tr>
      <th class="four wide">fieldname-C</th>
      <td>session</td>
    </tr><tr>
      <th class="four wide">fieldname-I</th>
      <td>host</td>
    </tr><tr>
      <th class="four wide">fieldname-L</th>
      <td>login</td>
    </tr><tr>
      <th class="four wide">strategy</th>
      <td>CLI</td>
    </tr><tr>
      <th class="four wide">window-html</th>
      <td>10
        <div class="comment">Nombre de secondes utilisées pour la fenêtre de dédoublonnage des consultations HTML (les consultations d'une ressource avec la même identification sont regroupées en une seule, cf COUNTER)</div>
      </td>
    </tr><tr>
      <th class="four wide">window-misc</th>
      <td>30
         <div class="comment">Nombre de secondes utilisées pour la fenêtre de dédoublonnage des consultations MISC</div>
     </td>
    </tr><tr>
      <th class="four wide">window-pdf</th>
      <td>30
        <div class="comment">Nombre de secondes utilisées pour la fenêtre de dédoublonnage des consultations PDF</div>
      </td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="files" class="ui purple dividing header">
    Fichiers
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">1</th>
      <td>fede.bibliovie.ezproxy.2013.11.19.log.gz</td>
    </tr>
  </tbody></table>
</div>
<div>
  <h3 id="first_event" class="ui purple dividing header">
    Première consultation
  </h3>

  <table class="ui basic compact table">
    <tbody><tr>
      <th class="four wide">date</th>
      <td>2013-11-19</td>
    </tr><tr>
      <th class="four wide">datetime</th>
      <td>2013-11-19T00:11:57+01:00</td>
    </tr><tr>
      <th class="four wide">domain</th>
      <td>www.nature.com</td>
    </tr><tr>
      <th class="four wide">geoip-addr</th>
      <td>
        <div class="comment">Adresse extraite à partir de l'adresse IP de l'hôte consultant</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-city</th>
      <td>
        <div class="comment">Ville extraite à partir de l'adresse IP de l'hôte consultant</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-coordinates</th>
      <td>
        <div class="comment">Coordonnées (logitude+lattitude) extraites à partir de l'adresse IP de l'hôte consultant</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-country</th>
      <td>
        <div class="comment">Code pays extrait à partir de l'adresse IP de l'hôte consultant</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-family</th>
      <td>
      </td>
    </tr><tr>
      <th class="four wide">geoip-host</th>
      <td>
        <div class="comment">Host correspondant à l'adresse IP de l'hôte consultant</div>
      </td>
    </tr><tr>
      <th class="four wide">geoip-latitude</th>
      <td>
      </td>
    </tr><tr>
      <th class="four wide">geoip-longitude</th>
      <td></td>
    </tr><tr>
      <th class="four wide">geoip-region</th>
      <td></td>
    </tr><tr>
      <th class="four wide">host</th>
      <td>test.proxad.net
        <div class="comment">Host original l'hôte consultant</div>
      </td>
    </tr><tr>
      <th class="four wide">login</th>
      <td>MYLOGIN
        <div class="comment">Login d'identification utilisé pour accèder aux ressources</div>
      </td>
    </tr><tr>
      <th class="four wide">mime</th>
      <td>MISC
        <div class="comment">Type mime de la ressource déterminée par le parseur</div>
      </td>
    </tr><tr>
      <th class="four wide">platform</th>
      <td>npg
        <div class="comment">Nom court de la plateforme consultée (=nom du parseur utilisé pour décomposer l'URL de la ressource)</div>
      </td>
    </tr><tr>
      <th class="four wide">rtype</th>
      <td>TOC
        <div class="comment">Type de la ressource consultée déterminée par le parseur</div>
      </td>
    </tr><tr>
      <th class="four wide">size</th>
      <td>40054
        <div class="comment">Taille de la requête http délivrant la ressource</div>
      </td>
    </tr><tr>
      <th class="four wide">status</th>
      <td>200
        <div class="comment">Code HTTP renvoyé par le serveur lors de l'accès à la ressource</div>
      </td>
    </tr><tr>
      <th class="four wide">timestamp</th>
      <td>1384816317</td>
    </tr><tr>
      <th class="four wide">title_id</th>
      <td>siteindex
        <div class="comment">Identifiant éditeur déterminé par le parseur</div>
      </td>
    </tr><tr>
      <th class="four wide">unitid</th>
      <td>siteindex
        <div class="comment">Identifiant unique de la ressource déterminé par le parseur (dédoublonnage de ressources identiques)</div>
      </td>
    </tr><tr>
      <th class="four wide">url</th>
      <td><a target="_blank" href="http://www.nature.com/siteindex/index.html">http://www.nature.com:80/siteindex/index.html</a></td>
    </tr>
  </tbody></table>
</div>
