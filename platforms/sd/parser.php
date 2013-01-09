#!/usr/bin/env php
<?php


while($line = trim(fgets(STDIN))) {
  $result = Array();
  $url = parse_url($line);
  $param = '';
  if (isset($url['query'])) parse_str($url['query'], $param);
  
  if (isset($param['_ob']) ) {
    if (isset($param['_cdi'])) {
      $result['cdi'] = $param['_cdi'];
     }
    switch($param['_ob']) {
    case 'IssueURL' :
      // sommaire
      $arg = explode("#", $param['_tockey']);
      // l'identifiant est le 2 param du _tockey separé par des #
      $result['cdi'] = $arg[2];
      $result['type'] = 'TOC';
      break;
    case 'ArticleURL' :
      // resume ou full text
      if (isset($param['_fmt']))
      {
        switch($param['_fmt']) {
        case 'summary' :
          $result['type'] = 'SUMMARY';
          break;
        case 'full' :
          $result['type'] = 'TXT';
          break;
        }
      }
      break;
    case 'MImg' :
      // PDF
      $result['type'] = 'PDF';
      break;
    case 'MiamiImageURL':
      if (isset($param['_pii'])) {
        $ISSN = substr($param['_pii'], 1, 4) . "-" . substr($param['_pii'], 5, 4);
        $result['issn'] = $ISSN;
        $result['type'] = 'PDF';
      }
      break;
    case 'DocumentDeliveryURL' :
      // commande
      $result['type'] = 'ORDER';
      break;
    default :
      // cas non repertorie ne prend pas
      $result['qualification'] = false;
      break;
    }
  }
  else if (preg_match("/\/science\/article\/pii\/S([0-9]{4})([0-9]{3}[0-9Xx])/", $line, $format)) {
    $result['issn'] = ($format[1]."-".strtoupper($format[2]));
    $result['type'] = 'TXT';
  }
fprintf(STDOUT, "%s\n", json_encode($result));
}
exit(0);
?>