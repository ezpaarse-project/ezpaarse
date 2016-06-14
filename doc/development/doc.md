# Documentation #

In order to build the documentation locally, you need [Sphinx](http://www.sphinx-doc.org/) and the Sphinx theme for [ReadTheDocs](https://readthedocs.org/). For convenience, the instructions below include a live-reload server.

First, install the dependencies :

```bash
sudo apt-get install python python-pip python-sphinx
sudo pip install sphinx_rtd_theme sphinx-autobuild
```

Then move to the `doc` directory and type :

```bash
make serve
```

Finally, visit [http://localhost:8000/](http://localhost:8000/).
