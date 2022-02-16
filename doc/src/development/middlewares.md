# Middlewares

NB: The middlewares have their [own dedicated repository](https://github.com/ezpaarse-project/ezpaarse-middlewares).

## What is a middleware ?

Middlewares are functions that constitute the processing chain. The middlewares are successively applied to the consultation events processed by ezPAARSE and turnthem into the definitive form they will have when the events are eventually written in the result file.

## How to load a middleware ?

To become part of the processing chain, a middleware must have its name (*ie* the name of its file, without the `.js` suffix) added to the `EZPAARSE_MIDDLEWARES` array in the config file. The order of declaration in the array determines the order in which middlewares are called.

## Middlewares loaded by default
<table>
  <thead>
    <tr>
      <th colspan="3">Middlewares</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span style="font-size: 12px">1.</span> <a href="/middlewares/filter.html">filter</a></td>
      <td><span style="font-size: 12px">2.</span> <a href="/middlewares/parser.html">parser</a></td>
      <td><span style="font-size: 12px">3.</span> <a href="/middlewares/deduplicator.html">deduplicator</a></td>
    </tr>
    <tr>
      <td><span style="font-size: 12px">4.</span> <a href="/middlewares/istex.html">istex</a></td>
      <td><span style="font-size: 12px">5.</span> <a href="/middlewares/crossref.html">crossref</a></td>
      <td><span style="font-size: 12px">6.</span> <a href="/middlewares/sudoc.html">sudoc</a></td>
    </tr>
    <tr>
      <td><span style="font-size: 12px">7.</span> <a href="/middlewares/hal.html">hal</a></td>
      <td><span style="font-size: 12px">8.</span> <a href="/middlewares/enhancer.html">enhancer</a></td>
      <td><span style="font-size: 12px">9.</span> <a href="/middlewares/geolocalizer.html">geolocalizer</a></td>
    </tr>
    <tr>
      <td><span style="font-size: 12px">10.</span> <a href="/middlewares/cut.html">cut</a></td>
      <td><span style="font-size: 12px">11.</span> <a href="/middlewares/on-campus-counter.html">on-campus-counter</a></td>
      <td><span style="font-size: 12px">12.</span> <a href="/middlewares/qualifier.html">qualifier</a></td>
    </tr>
    <tr>
      <td><span style="font-size: 12px">13.</span> <a href="/middlewares/anonymizer.html">anonymizer</a></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

## How to create a middleware ?

### Specifications
Each middleware must have its own directory, with `index.js` as entrypoint, and must export a function that will serve as `initiator`. The initiator function must return either the actual processing function, or a `promise` that will then return it. In case of failure during the initialization, returning an `Error` object (or rejecting the `promise`) will abort the job. The error object should be extended with a `status` property that specify the status code to send back (defaults to **500**), and optionally a `code` property for the ezPAARSE-specific status (inserted in the header **ezPAARSE-Status**). The error message will be inserted in the header **ezPAARSE-Status-Message**.

The `processing function` takes the EC as first argument and a function to call when the EC should go on to the next middleware. Calling this function with an error will result in the EC being rejected. When there's no line left to read, the function will be called with `null` as EC.

The `initiator` and the `processing function` have the following properties in their context (this) :
- `request`: the request stream.
- `response`: the response stream.
- `job`: the job object.
- `logger`: a winston instance (shorthand for job.logger).
- `report`: a report object (shorthand for job.report).
- `saturate`: a function to call when the middleware is saturated.
- `drain`: a function to call when the middleware is not saturated anymore.

### Example

#### Article counter

Here is an example of a very simple middleware that counts the articles and put the total in the report as `General -> nb-articles` :

```javascript
module.exports = function articleCounter() {
  this.logger.verbose('Initializing article counter');

  this.report.set('general', 'nb-articles', 0);

  // Processing function
  return function count(ec, next) {
    if (!ec) { return next(); }

    if (ec.rtype === 'ARTICLE') {
      this.report.inc('general', 'nb-articles');
    }

    next();
  };
};
```

#### Mandatory field

This middleware is a bit more advanced. It's activated by giving a field name in the `Mandatory-Field` header and it filters any EC that doesn't have a value for this field. An error is thrown on startup if the header contains a space.

```javascript
module.exports = function mandatoryField() {
  this.logger.verbose('Initializing mandatory field');

  let mandatoryField = req.header('Mandatory-Field');

  if (mandatoryField && mandatoryField.includes(' ')) {
    let err = new Error('space not allowed in mandatory field');
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

#### Use of promises
```javascript
module.exports = function mandatoryField() {

  return new Promise(function (resolve, reject) {
    if ('foo') {
      return reject(new Error('initialization failed for some reason'));
    }

    resolve(function process(ec, next) {
      // Processing function
    });
  })
};
```
