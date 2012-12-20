#!/usr/bin/env perl
$| = 1;

use URI;
use URI::QueryParam;
use Switch;
use JSON;

while ($a = <STDIN>) {
  %result = ();
  @param = ();
  my $url = URI->new($a);
  my @param = $url->query_param;
  
  if (grep { $_ eq '_ob'} @param) {
    if (grep { $_ eq '_cdi'} @param) {
      $result{'cdi'} = $url->query_param('_cdi');
    }
    switch($url->query_param('_ob')) {
      case "IssueURL" {
        # sommaire
        $arg = explode("#", $param['_tockey']);
        # l'identifiant est le 2 param du _tockey separé par des #
        $result{'cdi'} = $arg[2];
        $result{'type'} = 'TOC';
      }
      case "ArticleURL" {
        # resume ou full text
        if (grep { $_ eq '_fmt'} @param)
        {
          switch($param['_fmt']) {
            case 'summary' {
              $result{'type'} = 'SUMMARY';
            }
            case 'full' {
              $result{'type'} = 'TXT';
            }
          }
        }
      }
      case "MImg" {
        # PDF
        $result{'type'} = 'PDF';
      }
      case "MiamiImageURL" {
        if (grep { $_ eq '_pii'} @param) {
          $pii = $url->query_param('_pii');
          $ISSN = substr($pii, 1, 4) . "-" . substr($pii, 5, 4);
          $result{'issn'} = $ISSN;
          $result{'type'} = 'PDF';
        }
      }
      case "DocumentDeliveryURL" {
        # commande
        $result{'type'} = 'ORDER';
      }
      else {
        # cas non repertorie ne prend pas
        $result{'qualification'} = false;
      }
    }
  }
  else {
    if (my @matches = ($a =~ /\/science\/article\/pii\/S([0-9]{4})([0-9]{3}[0-9Xx])/)) {
      $result{'issn'} = ($matches[0]."-".uc($matches[1]));
      $result{'type'} = 'TXT';
    }
  }
  my $json = encode_json \%result;
  print STDOUT "$json\n";
}
