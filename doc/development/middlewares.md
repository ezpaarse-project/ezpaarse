# Middlewares #

## What's a middleware ? ##

Middlewares are functions that form the process chain. They are successively applied to the ECs in order to lead them to the definitive form they will have when they are written in the result.

## How to create a middleware ? ##

The middlewares have their own repository, refer to the [Readme](https://github.com/ezpaarse-project/ezpaarse-middlewares) for more details.

## How to load a middleware ? ##

To be loaded in the process chain, a middleware must have its name (the name of its file without the `.js`) added to `EZPAARSE_MIDDLEWARES` in the config file. The index in the array determine the order in which middlewares are applied.
