# Core dumped

You may get the following error when updating ezPAARSE :

```bash
Segmentation error (core dumped) npm install --no-save -q --unsafe-perm
```

This error comes from a conflict between the versions of nodejs and npm. To solve this problem, you need to purge your nodejs and npm packages with the following commands :

```bash
sudo apt --auto-remove purge nodejs
sudo apt --auto-remove purge npm
```
