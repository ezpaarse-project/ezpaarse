/*jshint maxlen: 300*/
'use strict';

module.exports =
{
  ezproxy: [
    { format: '%h %l %u %t "%r" %s %b' }
  ],
  apache: [
    { format: '%h %l %u %t "%r" %>s %b' },
    { format: '%h %l %u %t "%r" %>s %b "%{referer}<[^ "]+>" "%{user-agent}<[^"]+>"' },
    { format: '%{timestamp}<[0-9]+>,%h,%b,%<"?>%{ress-name}<[a-zA-Z0-9\\- ]+>%<"?>,%U,%>s,%<"?>%{mt}<[a-zA-Z0-9\\-\\/;= ]+>%<"?>,%<"?>%{profil}<[a-zA-Z0-9/ _éèàç]*>%<"?>,%{uid}<[a-zA-Z0-9]*>,%{session-id}<[a-zA-Z0-9]*>' }, //Bibliopam Paris Descartes
    { format: '%{timestamp}<[0-9]+>,%h,%b,%<"?>%{ress-name}<[a-zA-Z0-9\\- ]+>%<"?>,%U,%>s,%<"?>%{mt}<[a-zA-Z0-9\\-\\/;= ]+>%<"?>,%<"?>%{profil1}<[a-zA-Z0-9/ _éèàç]*>%<"?>,%{uid}<[a-zA-Z0-9]*>,%{session-id}<[a-zA-Z0-9]*>,%<"?>%{profil2}<[a-zA-Z0-9/ _éèàç]*>%<"?>' } //Bibliopam EC-Lyon
  ],
  squid: [
    { format: '%ts.%03tu %6tr %>a %Ss/%03>Hs %<st %rm %ru %[un %Sh/%<a %mt' }, //squid
    { format: '%>a %[ui %[un [%tl] "%rm %ru HTTP/%rv" %>Hs %<st %Ss:%Sh' } //common
  ]
};
