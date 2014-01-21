'use strict';

var XMLWriter = require('xml-writer');
var moment    = require('moment');

/**
 * Create a JR1 reporter
 */
function JR1Reporter(customer, vendor) {
  this.journals    = [];
  this.references  = [];
  this.jid         = 1;
  this.customer    = customer;
  this.vendor      = vendor;
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
    this.references[this.identifiers[i]] = {};
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

  if (ec.rtype != 'ARTICLE') { return; }

  var ecIdentifiers = this.getIdentifiers(ec);
  if (!Object.keys(ecIdentifiers).length) { return; }

  var month   = moment.unix(ec.timestamp).format('YYYY-MM');
  var journal = this.getJournal(ecIdentifiers);

  if (!journal) {
    journal = {
      jid: this.jid++,
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
 * If there are more than one, they are merged
 * @param {Object} ecIdentifiers and their values
 */
JR1Reporter.prototype.getJournal = function (ecIdentifiers) {
  var journal;
  var otherJournal;

  for (var identifier in ecIdentifiers) {
    var value = ecIdentifiers[identifier];

    otherJournal = this.references[identifier][value];
    if (otherJournal) {
      if (journal) {
        if (journal.jid != otherJournal.jid && journal.platform == otherJournal.platform) {
          this.mergeJournals(journal, otherJournal);

          // Redirect all references to the first journal
          for (var i in this.references) {
            var val = otherJournal[i];
            if (val) { this.references[i][val] = journal; }
          }
        }
      } else {
        journal = otherJournal;
      }
    }
  }
  return journal;
};

/**
 * Merge identifiers and metrics of two journals. (into the first)
 * @param  {Object} j1 first journal
 * @param  {Object} j2 second journal
 */
JR1Reporter.prototype.mergeJournals = function (j1, j2) {
  this.identifiers.forEach(function (identifier) {
    if (j2[identifier] && !j1[identifier]) {
      j1[identifier] = j2[identifier];
    }
  });
  for (var month in j2.metrics) {
    if (j1.metrics[month]) {
      j1.metrics[month].ft_pdf  += j2.metrics[month].ft_pdf  || 0;
      j1.metrics[month].ft_html += j2.metrics[month].ft_html || 0;
    } else {
      j1.metrics[month] = j2.metrics[month];
    }
  }
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
      this.references[identifier][value] = journal;
    }
  }
};

/**
 * Create a counter JR1 report with the journal list
 * @return {String} the report
 */
JR1Reporter.prototype.generateReport = function (format) {

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

  switch (format) {
    case 'xml':
      return this.generateXML(periods);
    case 'csv':
      return this.generateCSV(periods);
    default:
      return '';
  }
};

/**
 * Generate an XML version of JR1 report
 * @param  {Array} periods  per-month periods
 * @return {String}         final report
 */
JR1Reporter.prototype.generateXML = function (periods) {
  var self = this;
  var xw   = new XMLWriter(true);
  xw.startDocument();
  xw.startElement('Report');
  xw.writeAttribute('Created', moment().format());
  xw.writeAttribute('Name', 'JR1');
  xw.writeAttribute('Title', 'Journal Report 1');

  xw.startElement('Vendor');
  if (self.vendor) {
    if (self.vendor.name) { xw.writeElement('Name', self.vendor.name); }
    if (self.vendor.email) {
      xw.startElement('Contact');
      xw.writeElement('E-mail', self.vendor.email);
      xw.endElement();
    }
  }
  xw.endElement(); // Vendor

  xw.startElement('Customer');
  if (self.customer) {
    if (self.customer.name) { xw.writeElement('Name', self.customer.name); }
    if (self.customer.email) {
      xw.startElement('Contact');
      xw.writeElement('E-mail', self.customer.email);
      xw.endElement();
    }
  }
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

  xw.endElement(); // Customer
  xw.endDocument();

  return xw.toString();
};

/**
 * Generate a CSV version of JR1 report
 * @param  {Array} periods  per-month periods
 * @return {String}         final report
 */
JR1Reporter.prototype.generateCSV = function (periods) {
  var reportHeader = '';
  var report       = '';

  var escapeMember = function (member) {
    member = member || '';
    if (/,/.test(member)) {
      return '"' + member.replace('"', '""') + '"';
    }
    return member;
  };

  reportHeader += "Journal Report 1 (R4),";
  reportHeader += "Number of Successful Full-Text Article Requests by Month and Journal\n"; //L1
  reportHeader += this.customer ? this.customer.name || '' : '';
  reportHeader += "\n"; //L3 - line for "institutional identifier", blank for now

  reportHeader += "\nPeriod covered by Report\n"; //L4
  reportHeader += moment(periods[0][0]).format("YYYY-MM-DD");
  reportHeader += " to ";
  reportHeader += moment(periods[periods.length - 1][1]).format("YYYY-MM-DD"); //L5

  reportHeader += "\nDate run\n"; //L6
  reportHeader += moment().format('YYYY-MM-DD'); //L7
  reportHeader += "\n";

  reportHeader += "Journal";
  reportHeader += ",Publisher";
  reportHeader += ",Platform";
  reportHeader += ",Journal DOI";
  reportHeader += ",Proprietary Identifier";
  reportHeader += ",Print ISSN";
  reportHeader += ",Online ISSN";
  reportHeader += ",Reporting Period Total";
  reportHeader += ",Reporting Period HTML";
  reportHeader += ",Reporting Period PDF";
  periods.forEach(function (period) {
    reportHeader += "," + moment(period[0], 'YYYY-MM-DD').format("MMM-YYYY");
  });
  reportHeader += '\n'; //L8

  var overallPDF       = 0;
  var overallHTML      = 0;
  var perPeriodOverall = [];
  this.journals.forEach(function (journal) {
    report += escapeMember(journal.title);
    report += ','; // publisher, blank for now
    report += ',' + escapeMember(journal.platform);
    report += ',' + escapeMember(journal.doi);
    report += ',' + escapeMember(journal.pid);
    report += ',' + escapeMember(journal.pissn);
    report += ',' + escapeMember(journal.eissn);

    var totalPDF       = 0;
    var totalHTML      = 0;
    var perPeriodTotal = [];

    periods.forEach(function (period, index) {
      var metrics = journal.metrics[moment(period[0]).format('YYYY-MM')];
      if (!metrics) {
        perPeriodTotal.push(0);
      } else {
        totalPDF  += metrics.ft_pdf;
        totalHTML += metrics.ft_html;
        perPeriodTotal.push(metrics.ft_pdf + metrics.ft_html);

        if (!perPeriodOverall[index]) { perPeriodOverall[index] = 0; }
        perPeriodOverall[index] += metrics.ft_pdf + metrics.ft_html;
      }
    });
    report += ',' + (totalHTML + totalPDF);
    report += ',' + totalHTML;
    report += ',' + totalPDF;

    overallPDF  += totalPDF;
    overallHTML += totalHTML;

    perPeriodTotal.forEach(function (metric) {
      report += ',' + (metric || 0);
    });

    report += '\n';
  });

  var overall = 'Total for all journals,,,,,,';
  overall += ',' + (overallHTML + overallPDF);
  overall += ',' + overallHTML;
  overall += ',' + overallPDF;
  perPeriodOverall.forEach(function (metric) {
    overall += ',' + metric;
  });
  overall += '\n';

  return reportHeader + overall + report;
};