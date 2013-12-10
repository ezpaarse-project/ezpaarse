'use strict';

var XMLWriter = require('xml-writer');
var moment    = require('moment');

/**
 * Create a JR1 reporter
 */
function JR1Reporter() {
  this.journals    = [];
  this.identifiers = [
    'pissn',
    'eissn',
    'pisbn',
    'eisbn',
    'doi',
    'pid',
    'title'
  ];

  this.counterNames = {
    'pissn': 'Print_ISSN',
    'eissn': 'Online_ISSN',
    'pisbn': 'Print_ISBN',
    'eisbn': 'Online_ISBN',
    'doi':   'DOI',
    'pid':   'Proprietary'
  };

  // pointers to journals
  for (var i = this.identifiers.length; i >= 0; i--) {
    this[this.identifiers[i]] = {};
  }
}
module.exports = JR1Reporter;

/**
 * Count a new EC
 * @param {Object} ec consultation event
 */
JR1Reporter.prototype.count = function (ec) {
  if (!this.startDate) { this.startDate = ec.timestamp; }
  this.endDate = ec.timestamp;

  var ecIdentifiers = this.getIdentifiers(ec);
  if (!Object.keys(ecIdentifiers).length) { return; }

  var journal = this.getJournal(ecIdentifiers);
  var month   = moment.unix(ec.timestamp).format('YYYY-MM');

  if (!journal) {
    journal = {
      platform: ec.platform,
      metrics: {}
    };
    this.journals.push(journal);
  }

  if (!journal.metrics[month]) {
    journal.metrics[month] = {
      ft_pdf: 0,
      ft_html: 0
    };
  }

  var mime = ec.mime || '';
  switch (mime.toUpperCase()) {
    case 'PDF':
      journal.metrics[month].ft_pdf++;
      break;
    case 'HTML':
      journal.metrics[month].ft_html++;
      break;
  }

  this.updateJournal(journal, ecIdentifiers);
};

/**
 * Get the list of properties that are valid identifiers
 * @param  {Object} consultation event
 * @return {Object} list of properties
 */
JR1Reporter.prototype.getIdentifiers = function (ec) {
  var ecIdentifiers = {};
  this.identifiers.forEach(function (identifier) {
    if (ec[identifier]) { ecIdentifiers[identifier] = ec[identifier]; }
  });
  return ecIdentifiers;
};

/**
 * Search a journal with an identifier of the given list
 * @param {Object} ecIdentifiers and their values
 */
JR1Reporter.prototype.getJournal = function (ecIdentifiers) {
  var journal;
  for (var identifier in ecIdentifiers) {
    var value = ecIdentifiers[identifier];

    journal = this[identifier][value];
    if (journal) { break; }
  }
  return journal;
};

/**
 * Update journal identifiers and add pointers if needed
 * @param {Object} journal
 * @param {Object} ecIdentifiers
 */
JR1Reporter.prototype.updateJournal = function (journal, ecIdentifiers) {
  for (var identifier in ecIdentifiers) {
    if (!journal[identifier]) {
      var value               = ecIdentifiers[identifier];
      journal[identifier]     = value;
      this[identifier][value] = journal;
    }
  }
};

/**
 * Create a counter JR1 report with the journal list
 */
JR1Reporter.prototype.generateReport = function () {
  var self = this;
  var xw   = new XMLWriter(true);

  var currentDate = moment.unix(this.startDate);
  var lastDate    = moment.unix(this.endDate);
  var periods     = [];
  var period;

  var lastPeriod = false;
  while (!lastPeriod) {
    period = [currentDate.format('YYYY-MM-DD')];
    currentDate.endOf('month');

    if (currentDate.diff(lastDate) > 0) {
      lastPeriod = true;
      period.push(lastDate.format('YYYY-MM-DD'));
    } else {
      period.push(currentDate.format('YYYY-MM-DD'));
      currentDate.add('months', 1).startOf('month');
    }

    periods.push(period);
  }

  xw.startDocument();
  xw.startElement('Report');
  xw.writeAttribute('Created', moment().format());
  xw.writeAttribute('Name', 'JR1');
  xw.writeAttribute('Title', 'Journal Report 1');

  self.journals.forEach(function (journal) {
    xw.startElement('ReportItems');
    self.identifiers.forEach(function (identifier) {
      if (journal[identifier] && self.counterNames[identifier]) {
        xw.startElement('ItemIdentifier');
        xw.writeElement('Type', self.counterNames[identifier]);
        xw.writeElement('Value', journal[identifier]);
        xw.endElement();
      }
    });

    if (journal.title) { xw.writeElement('ItemName', journal.title); }
    if (journal.title) { xw.writeElement('ItemDataType', 'Journal'); }

    periods.forEach(function (period) {
      xw.startElement('ItemPerformance');

      xw.startElement('Period');
      xw.writeElement('Begin', period[0]);
      xw.writeElement('End', period[1]);
      xw.endElement(); // Period
      xw.writeElement('Category', 'Requests');

      var total = 0;
      var metrics = journal.metrics[moment(period[0]).format('YYYY-MM')];
      if (!metrics) {
        metrics = { ft_pdf: 0, ft_html: 0 };
      }
      for (var metric in metrics) {
        xw.startElement('Instance');
        xw.writeElement('Metric', metric);
        xw.writeElement('Count', metrics[metric].toString());
        xw.endElement(); // Instance
        total += metrics[metric];
      }
      xw.startElement('Instance');
      xw.writeElement('Metric', 'ft_total');
      xw.writeElement('Count', total.toString());
      xw.endElement(); // Instance

      xw.endElement(); // ItemPerformance
    });
    xw.endElement(); // ReportItems
  });

  xw.endDocument();

  return xw.toString();
};