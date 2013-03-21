#Installation Multi-OS

ezPAARSE peut être installé sur différents OS Linux.

Selon les OS des pré-requis sont nécessaires avant le lancement de la [procédure d'installation](https://github.com/ezpaarse-project/ezpaarse/blob/master/doc/quickstart.md)

##Pré-requis sur Ubuntu

A partir d'une [image ubuntu](http://www.ubuntu.com/download) chargée dans une machine virtuelle, avec les droits root ou via sudo.

```
apt-get install perl git make python gcc nsis
```

##Pré-requis sur Fedora

A partir d'une [image fedora](http://fedoraproject.org/get-fedora) chargée dans une machine virtuelle, avec les droits root ou via sudo.

```
yum install perl git make python gcc-c++ nsis
```

##Pré-requis sur SUSE
 
 (à vérifier)
```
yum install perl git make python gcc-c++ nsis
```

##Pré-requis sur Mac OS X

Sur votre Mac, installer xCode et git

##Usage sous Windows

ezPAARSE peut être utilisé sous windows, mais de façon partielle.
Seul le coeur et les modules écrits en node seront fonctionnels (Certains modules (parseurs) pourront fonctionner selon votre installation windows, en particulier les outils ne sont pas disponibles).
Cet usage est réservé pour des tests de fonctionnement ou de compatibilité des formats de log.
Un installeur est disponible sur [la page de téléchargement](http://analogist.couperin.org/ezpaarse/download).
