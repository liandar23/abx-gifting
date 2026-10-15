/**
 * Rocketlane gift requests -> Google Sheet
 * Deploy as: Web app · Execute as: Me · Who has access: Anyone
 */
var SHEET_ID = '1To2W-Er2xXv3j8ePeYdiseMgqO0Cwsa5X3phl_kGAuU';
var SHEET_NAME = ''; // leave blank to use the first tab, or set a tab name e.g. 'Gift requests'

var COLUMNS = [
  ['submittedAt', 'Submitted at'],
  ['reference', 'Reference'],
  ['firstName', 'First name'],
  ['lastName', 'Last name'],
  ['email', 'Work email'],
  ['company', 'Company'],
  ['addressType', 'Address type'],
  ['line1', 'Street address'],
  ['line2', 'Apt / suite / floor'],
  ['city', 'City'],
  ['region', 'State / Province'],
  ['postal', 'Postal code'],
  ['country', 'Country'],
  ['phone', 'Phone'],
  ['consent', 'Consent'],
  ['account', 'Account (?account=)'],
  ['ref', 'Ref (?ref=)'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'],
  ['utm_term', 'utm_term'],
  ['pageUrl', 'Page URL'],
  ['referrer', 'Referrer']
];

var REQUIRED = ['firstName', 'lastName', 'email', 'company', 'line1', 'city', 'postal', 'country'];

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Bot trap: the hidden "website" field must stay empty.
    if (data.website) return json_({ ok: true });

    for (var i = 0; i < REQUIRED.length; i++) {
      if (!String(data[REQUIRED[i]] || '').trim()) return json_({ ok: false, error: 'missing_' + REQUIRED[i] });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email))) return json_({ ok: false, error: 'bad_email' });

    data.submittedAt = new Date();
    data.consent = data.consent ? 'Yes' : 'No';

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSheet_();
      ensureHeader_(sheet);
      sheet.appendRow(COLUMNS.map(function (c) { return clean_(data[c[0]]); }));
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true, reference: data.reference || '' });
  } catch (err) {
    return json_({ ok: false, error: 'server_error' });
  }
}

// Visiting the web app URL in a browser shows this; handy to confirm the deploy works.
function doGet() {
  return json_({ ok: true, status: 'Gift request endpoint is live' });
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  if (SHEET_NAME) return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  return ss.getSheets()[0];
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
}

// Trims, caps length, and stops spreadsheet formula injection (=, +, -, @).
function clean_(v) {
  if (v instanceof Date) return v;
  if (v === undefined || v === null) return '';
  var s = String(v).trim().slice(0, 300);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
