# Developer's Documentation: middlewares #

## What's a middleware ? ##

Middlewares are functions that form the process chain. They are successively applied to the ECs in order to lead them to the definitive form they will have when they are written in the result.

## How to create a middleware ? ##

Create a new javascript file in the directory `lib/middlewares`, which will take the form of a nodejs module exporting a function. This will be used to initialize the middleware when a job starts, and should return the actual processing function. In case of failure during the initialization, returning an error instead of a function will abort the job. The error object should be extended with a `status` property that specify the status code to send back (defaults to **500**), and optionally a `code` property for the ezPAARSE-specific status (inserted in the header **ezPAARSE-Status**). The error message will be inserted in the header **ezPAARSE-Status-Message**.

The processing function can freely modify the given EC, and should invoke the callback when it's done. Giving an error will result in the EC being rejected. The EC will be `null` when there are no EC left.

In case of **asynchronous** initialization, a **promise** can be provided in place of the processing function. It should then be resolved with the processing function as first argument, or rejected with an error.

### Example : ###
```javascript
/**
 * Middleware that removes ECs missing a given field
 * @param  {Object}   req       the request object
 * @param  {Object}   res       the response object
 * @param  {Object}   job       the job being initialized
 * @param  {Function} saturate  call when saturating in order to pause the request
 * @param  {Function} drain     call when drained in order to resume the request
 */
module.exports = function init(req, res, job, saturate, drain) {

  var mandatoryField = req.header('Mandatory-Field');

  if (mandatoryField && mandatoryField.includes(' ')) {
    var err = new Error('space not allowed in mandatory field');
    err.status = 400;
    return err;
  }

  /**
   * Actual processing function
   * @param  {Object}   ec   the EC to process, null if no EC left
   * @param  {Function} next the function to call when we are done with the given EC
   */
  return function process(ec, next) {
    if (!mandatoryField || !ec) { return next(); }
    
    if (ec[mandatoryField]) {
      next();
    } else {
      next(new Error(mandatoryField + ' is missing'));
    }
  };
};
```

### Use of promises : ###
```javascript
module.exports = function init(req, res, job, saturate, drain) {

  return new Promise(function (resolve, reject) {
    if ("foo") {
      return reject(new Error('initialization failed for some reason'));
    }

    resolve(function process(ec, next) {
      // Processing function
    });
  })
};
```

## How to load a middleware ? ##

To be loaded in the process chain, a middleware must have its name (the name of its file without the `.js`) added to `EZPAARSE_MIDDLEWARES` in the config file. The index in the array determine the order in which middlewares are applied.
