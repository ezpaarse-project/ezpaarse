# Contenu du rapport #

ezPAARSE produit un rapport d'exécution.  
Les différentes sections disponibles sont documentées ici.

-  [Général](#general) Contient toutes les informations générales liées au traitement
-  [Rejets](#rejets) Répertories tous les rejets rencontrés, leur nombre et les liens vient les fichiers contenant les lignes écartées
-  [Statistiques](#stats) Fourni les premiers chiffres 
-  [Dédoublonnage](#dedoublonnage) Algorithme utilisé pour le dédoublonnage
-  [Fichiers](#files) Rappel du nom des fichiers de log utilisés pour le traitement
-  [Première consultation](#first_event) Contenu du premier événement de consultation


<table>
  <tr>
    <td>
      <div ng-repeat="category in report | reportCategories" class="ng-scope">
        <h3 id="general" class="ui purple dividing header ng-binding">
          Général
        </h3>

        <table class="ui basic compact table">
          <tbody><tr  class="ng-scope">
            <th class="four wide ng-binding">Job-Date</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">2014-06-16T14:55:04+02:00
              <div class="comment">Date d'execution du traitement</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">Job-Done</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">true
              <div class="comment">Le traitement s'est-il bien terminé ?</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">Job-Duration</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">4 m 22 s 
              <div class="comment">Durée du traitement</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">Job-ID</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">6f601540-f555-11e3-b477-758199fa5dc1
              <div class="comment">Identifiant unique du traitement</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">Rejection-Rate</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">96.74 %
              <div class="comment">Taux de lignes rejettées, considérées comme non significatives</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">URL-Traces</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/job-traces.log</a>
            <div class="comment">Accès aux traces d'exécution du traitement</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">client-user-agent</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/33.0.1750.152 Chrome/33.0.1750.152 Safari/537.36
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">ezPAARSE-version</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">ezPAARSE 1.7.0
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geolocalization</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">geoip-lookup
              <div class="comment">Type de géolocalisation demandée</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">git-branch</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">master
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">git-last-commit</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">429e61bf29e80326b09958b0a68a01c0ae3add91
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">git-tag</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1.7.0
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">input-first-line</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">rate-limited-proxy-72-14-199-16.google.com - - [19/Nov/2013:00:11:05 +0100] "GET http://gate1.inist.fr:50162/login?url=http://www.nature.com/rss/feed?doi=10.1038/465529d HTTP/1.1" 302 0
            <div class="comment">Première ligne trouvée dans le fichier de log soumis</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">input-format-literal</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">%h %l %u %t "%r" %s %b (ezproxy)
              <div class="comment">Format utilisé pour identifier les éléments des lignes de log</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">input-format-regex</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">^([a-zA-Z0-9\.\-]+(?:, ?[a-zA-Z0-9\.\-]+)*) ([a-zA-Z0-9\-]+|\-) ([a-zA-Z0-9@\.\-_%,=]+) \[([^\]]+)\] "[A-Z]+ ([^ ]+) [^ ]+" ([0-9]+) ([0-9]+)$
              <div class="comment">Expression régulière correspondant au format de reconnaissance des lignes de log</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-denied-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">104
              <div class="comment">Nombre d'événements de consultation en accès refusés (ressources non souscrites)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">14224
              <div class="comment">Nombre d'événements de consultation total</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-input</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">792049
              <div class="comment">Nombre de lignes de log en entrée</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">process-speed</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">3019 lignes/s
              <div class="comment">Vitesse du traitement (propre à la machine)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">result-file-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1</a>
              <div class="comment">Lien d'accès au fichier résultat</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-denied-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/denied-ecs.csv</a>
              <div class="comment">Lien d'accès au fichier des événements de consulttion en accès refusé (ressources non-souscrites)</div>
            </td>
          </tr>
        </tbody></table>
      </div><div ng-repeat="category in report | reportCategories" class="ng-scope">
        <h3 id="rejets" class="ui purple dividing header ng-binding">
          Rejets
        </h3>

        <table class="ui basic compact table">
          <tbody><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-duplicate-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1893
              <div class="comment">Nombre d'EC dédoublonnés en utilisant la stratégie COUNTER</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-ignored</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">351891
              <div class="comment">Nombre de lignes ignorées (non significatives)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-ignored-domains</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">4
              <div class="comment">Nombre de lignes avec domaines ignorés (cité par EZPAARSE_IGNORED_DOMAINS) </div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-pkb-miss-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">2107
              <div class="comment">Nombre de lignes avec identifiants éditeur sans correspondance</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-unknown-domains</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">335068
              <div class="comment">Nombre de lignes contenant des domaines inconnus</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-unknown-formats</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1891
              <div class="comment">Nombre de lignes ayant un format inconnu</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-unordered-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">0
              <div class="comment">Nombre de lignes en anomalie chronologique (écartées du fait du dédoublonnage)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">nb-lines-unqualified-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">86974
              <div class="comment">Nombre de lignes non qualifiées (ne comportant pas suffisament d'éléments d'identitification)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-duplicate-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-duplicate-ecs.log</a>
              <div class="comment">Lien vers le fichier contenant les lignes écartées par le dédoublonage</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-ignored-domains</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-ignored-domains.log</a>
              <div class="comment">Lien vers le fichier contenant les lignes ayant un domaine ignoré</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-pkb-miss-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-pkb-miss-ecs.log</a>
              <div class="comment">Lien vers le fichier contenant les lignes écartées avec identifiants éditeur sans correspondance</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-unknown-domains</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-domains.log</a>
              <div class="comment">Lien vers le fichier contenant les lignes écartées avec un domaine ignoré</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-unknown-formats</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unknown-formats.log</a>
              <div class="comment">Lien vers le fichier contenant les lignes écartées avec un format inconnu</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-unordered-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
              <div class="comment">Lien vers le fichier contenant les lignes écartées avec une anomalie chronologique</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url-unqualified-ecs</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log">http://localhost:59599/6f601540-f555-11e3-b477-758199fa5dc1/lines-unqualified-ecs.log
              <div class="comment">Lien vers le fichier contenant les lignes écartées ne comportant pas suffisament d'éléments d'identitification</div>
            </a>
            </td>
          </tr>
        </tbody></table>
      </div><div ng-repeat="category in report | reportCategories" class="ng-scope">
        <h3 id="stats" class="ui purple dividing header ng-binding">
          Statistiques
        </h3>

        <table class="ui basic compact table">
          <tbody><tr  class="ng-scope">
            <th class="four wide ng-binding">mime-HTML</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">4540
              <div class="comment">Nombre d'EC des principaux types mime rencontrés (nom préfixé par mime-)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">mime-MISC</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">3612</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">mime-PDF</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">6072</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-acs
            </th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">538
              <div class="comment">Nombre d'EC des plateformes rencontrées (nom préfixé par platform-nom_court de la plateforme)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-ar</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">97</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-bioone</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">15</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-bmc</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">75</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-cup</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">22</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-edp</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">27</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-hw</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1740</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-jstor</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">9</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-mal</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">97</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-metapress</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">27</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-npg</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">3132</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-sd</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">5255</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-springer</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1675</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform-wiley</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1515</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platforms</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">14
              <div class="comment">Nombre de platformes différentes rencontrées pour ce traitement</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">rtype-ABS</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1142
              <div class="comment">Nombre d'EC des principaux types de ressource rencontrés (nom préfixé par rtype-)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">rtype-ARTICLE</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">9991</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">rtype-BOOK</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">218</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">rtype-BOOKSERIE</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">23</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">rtype-BOOK_SECTION</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">314</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">rtype-TOC</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">2536</td>
          </tr>
        </tbody></table>
      </div><div ng-repeat="category in report | reportCategories" class="ng-scope">
        <h3 id="dedoublonnage" class="ui purple dividing header ng-binding">
          Dédoublonnage
        </h3>

        <table class="ui basic compact table">
          <tbody><tr  class="ng-scope">
            <th class="four wide ng-binding">activated</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">true</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">fieldname-C</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">session</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">fieldname-I</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">host</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">fieldname-L</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">login</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">strategy</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">CLI</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">window-html</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">10
              <div class="comment">Nombre de secondes utilisées pour la fenêtre de dédoublonnage des consultations HTML (les consultations d'une ressource avec la même identification sont regroupées en une seule, cf COUNTER)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">window-misc</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">30
               <div class="comment">Nombre de secondes utilisées pour la fenêtre de dédoublonnage des consultations MISC</div>
           </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">window-pdf</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">30
              <div class="comment">Nombre de secondes utilisées pour la fenêtre de dédoublonnage des consultations PDF</div>
            </td>
          </tr>
        </tbody></table>
      </div><div ng-repeat="category in report | reportCategories" class="ng-scope">
        <h3 id="files" class="ui purple dividing header ng-binding">
          Fichiers
        </h3>

        <table class="ui basic compact table">
          <tbody><tr  class="ng-scope">
            <th class="four wide ng-binding">1</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">fede.bibliovie.ezproxy.2013.11.19.log.gz</td>
          </tr>
        </tbody></table>
      </div><div ng-repeat="category in report | reportCategories" class="ng-scope">
        <h3 id="first_event" class="ui purple dividing header ng-binding">
          Première consultation
        </h3>

        <table class="ui basic compact table">
          <tbody><tr  class="ng-scope">
            <th class="four wide ng-binding">date</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">2013-11-19</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">datetime</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">2013-11-19T00:11:57+01:00</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">domain</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">www.nature.com</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-addr</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
              <div class="comment">Adresse extraite à partir de l'adresse IP de l'hôte consultant</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-city</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
              <div class="comment">Ville extraite à partir de l'adresse IP de l'hôte consultant</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-coordinates</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
              <div class="comment">Coordonnées (logitude+lattitude) extraites à partir de l'adresse IP de l'hôte consultant</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-country</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
              <div class="comment">Code pays extrait à partir de l'adresse IP de l'hôte consultant</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-family</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-host</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
              <div class="comment">Host correspondant à l'adresse IP de l'hôte consultant</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-latitude</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-longitude</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"></td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">geoip-region</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"></td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">host</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">test.proxad.net
              <div class="comment">Host original l'hôte consultant</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">login</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">MYLOGIN
              <div class="comment">Login d'identification utilisé pour accèder aux ressources</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">mime</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">MISC
              <div class="comment">Type mime de la ressource déterminée par le parseur</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">platform</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">npg
              <div class="comment">Nom court de la plateforme consultée (=nom du parseur utilisé pour décomposer l'URL de la ressource)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">rtype</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">TOC
              <div class="comment">Type de la ressource consultée déterminée par le parseur</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">size</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">40054
              <div class="comment">Taille de la requête http délivrant la ressource</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">status</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">200
              <div class="comment">Code du status de la requête http délivrant la ressource</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">timestamp</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">1384816317</td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">title_id</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">siteindex
              <div class="comment">Identifiant éditeur déterminé par le parseur</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">unitid</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding">siteindex
              <div class="comment">Identifiant unique de la ressource déterminé par le parseur (dédoublonnage de ressources identiques)</div>
            </td>
          </tr><tr  class="ng-scope">
            <th class="four wide ng-binding">url</th>
            <td ng-bind-html="val | toLink:&#39;_blank&#39;" class="ng-binding"><a target="_blank" href="http://www.nature.com/siteindex/index.html">http://www.nature.com:80/siteindex/index.html</a></td>
          </tr>
        </tbody></table>
      </div>
    </td>
</tr></table>
