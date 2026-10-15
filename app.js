(function () {
  var I = {
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    back: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>',
    home: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    office: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    chev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    gift: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>',
    pin: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
    ext: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>'
  };
  var COUNTRIES = ["United States", "India", "United Kingdom", "Canada", "Australia", "Germany", "France", "Netherlands", "Singapore", "United Arab Emirates", "Other"];

  var state = {
    step: 1,
    v: { firstName: "", lastName: "", email: "", company: "", addressType: "office", line1: "", line2: "", city: "", region: "", postal: "", country: "United States", phone: "", consent: false, website: "" },
    errors: {}, saving: false, submitError: "", done: null
  };
  var root = document.getElementById("form-root");
  var heading = document.getElementById("form-heading");
  var desc = document.querySelector(".form-description");
  // Google Sheets endpoint: paste your Apps Script Web App URL here (see README).
  var SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbzE0Dn45spDyI1vpRLXVnBrVOSl-hng6DjlP6BoE0o3fZlD4vroNq3ZLVpabnFWPdfc/exec";
  var params = new URLSearchParams(location.search);
  function tracking() {
    var t = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "account", "ref"].forEach(function (k) { t[k] = params.get(k) || ""; });
    t.pageUrl = location.origin + location.pathname;
    t.referrer = document.referrer || "";
    return t;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function field(id, label, opts) {
    opts = opts || {};
    var err = state.errors[id];
    return '<div class="field"><label for="' + id + '">' + label + (opts.optional ? ' <span>(optional)</span>' : '') + '</label>' +
      '<input id="' + id + '" name="' + id + '" type="' + (opts.type || "text") + '" autocomplete="' + (opts.ac || "off") + '" placeholder="' + esc(opts.ph || "") + '" maxlength="' + (opts.max || 160) + '" aria-invalid="' + (err ? "true" : "false") + '"' + (err ? ' aria-describedby="' + id + '-err"' : '') + ' value="' + esc(state.v[id]) + '">' +
      (err ? '<p class="field-error" id="' + id + '-err">' + esc(err) + '</p>' : '') + '</div>';
  }
  function steps() {
    var s = state.step;
    return '<ol class="steps" aria-label="Form progress">' +
      '<li class="' + (s === 1 ? "active" : "complete") + '"' + (s === 1 ? ' aria-current="step"' : '') + '><span>' + (s === 1 ? "1" : I.check) + '</span>Your details</li>' +
      '<li class="' + (s === 2 ? "active" : "") + '"' + (s === 2 ? ' aria-current="step"' : '') + '><span>2</span>Delivery address</li></ol>';
  }
  function render() {
    if (state.done) return renderDone();
    var h = steps() + '<form novalidate id="gift-form-el">';
    if (state.step === 1) {
      h += '<div class="field-grid">' + field("firstName", "First name", { ac: "given-name", ph: "Alex" }) + field("lastName", "Last name", { ac: "family-name", ph: "Morgan" }) + '</div>' +
        field("email", "Work email", { type: "email", ac: "email", ph: "alex@company.com", max: 254 }) +
        field("company", "Company", { ac: "organization", ph: "Your company" }) +
        '<button class="primary-button" type="submit">Continue to delivery <span class="button-arrow">' + I.arrow + '</span></button>';
    } else {
      var t = state.v.addressType;
      h += '<fieldset class="address-toggle"><legend>Where should we send it?</legend>' +
        '<label class="' + (t === "office" ? "selected" : "") + '"><input type="radio" name="addressType" id="addr-office" value="office"' + (t === "office" ? " checked" : "") + '>' + I.office + 'Office</label>' +
        '<label class="' + (t === "home" ? "selected" : "") + '"><input type="radio" name="addressType" id="addr-home" value="home"' + (t === "home" ? " checked" : "") + '>' + I.home + 'Home</label></fieldset>' +
        field("line1", "Street address", { ac: "address-line1", ph: "123 Market Street", max: 200 }) +
        field("line2", "Apartment, suite, floor", { ac: "address-line2", ph: "Suite 400", optional: true, max: 200 }) +
        '<div class="field-grid">' + field("city", "City", { ac: "address-level2", ph: "San Francisco" }) + field("region", "State / Province", { ac: "address-level1", ph: "CA" }) + '</div>' +
        '<div class="field-grid">' + field("postal", "Postal code", { ac: "postal-code", ph: "94105", max: 20 }) +
        '<div class="field"><label for="country">Country</label><div class="select-wrap"><select id="country" name="country" autocomplete="country-name">' +
        COUNTRIES.map(function (c) { return '<option' + (c === state.v.country ? " selected" : "") + '>' + c + '</option>'; }).join("") +
        '</select>' + I.chev + '</div></div></div>' +
        field("phone", "Phone for delivery", { type: "tel", ac: "tel", ph: "+1 415 555 0100", optional: true, max: 30 }) +
        '<p class="field-hint">Couriers sometimes need a number to complete delivery.</p>' +
        '<div class="honeypot" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off" value=""></div>' +
        '<label class="consent" for="consent"><input type="checkbox" id="consent" name="consent"' + (state.v.consent ? " checked" : "") + (state.errors.consent ? ' aria-invalid="true"' : '') + '><span>I agree that Rocketlane may use these details to arrange my gift delivery, as described in the <a href="https://www.rocketlane.com/privacy-policy" target="_blank" rel="noreferrer">privacy policy ' + I.ext + '</a>.</span></label>' +
        (state.errors.consent ? '<p class="field-error" style="margin:-12px 0 16px">' + esc(state.errors.consent) + '</p>' : '') +
        (state.submitError ? '<div class="submit-error" role="alert">' + esc(state.submitError) + '</div>' : '') +
        '<button class="primary-button" type="submit"' + (state.saving ? " disabled" : "") + '>' + (state.saving ? "Sending your request…" : "Request my gift") + ' <span class="button-arrow">' + I.arrow + '</span></button>' +
        '<button class="back-button" type="button" id="back-btn">' + I.back + ' Back to your details</button>';
    }
    h += '<div class="form-reassurance">' + I.lock + '<span>Your details help us get your gift to you.</span></div></form>';
    root.innerHTML = h;
    bind();
  }
  function renderDone() {
    var v = state.v, d = state.done;
    heading.innerHTML = "Your gift is<br>on its way.";
    desc.hidden = true;
    root.innerHTML = '<div class="success-content"><div class="success-icon">' + I.gift + '</div>' +
      '<p class="eyebrow">THANK YOU, ' + esc(v.firstName.toUpperCase()) + '</p>' +
      '<p>We’ve got your details. Your Rocketlane contact will confirm the gift and let you know when it ships.</p>' +
      '<div class="address-summary"><span class="summary-label">' + I.pin + ' DELIVERING TO ' + (v.addressType === "home" ? "HOME" : "OFFICE") + '</span>' +
      '<strong>' + esc(v.firstName + " " + v.lastName) + '</strong>' +
      (v.addressType === "office" ? '<span>' + esc(v.company) + '</span>' : '') +
      '<span>' + esc(v.line1) + (v.line2 ? ", " + esc(v.line2) : "") + '</span>' +
      '<span>' + esc(v.city) + (v.region ? ", " + esc(v.region) : "") + " " + esc(v.postal) + '</span>' +
      '<span>' + esc(v.country) + '</span></div>' +
      '<p class="reference">Reference<strong>' + esc(d.ref) + '</strong></p>' +
      
      '</div>';
    heading.focus();
  }
  function collect() {
    var f = document.getElementById("gift-form-el");
    Array.prototype.forEach.call(f.querySelectorAll("input,select"), function (el) {
      if (el.type === "radio") { if (el.checked) state.v[el.name] = el.value; }
      else if (el.type === "checkbox") state.v[el.name] = el.checked;
      else if (el.name in state.v) state.v[el.name] = el.value.trim();
    });
  }
  function validate() {
    var v = state.v, e = {};
    if (state.step === 1) {
      if (!v.firstName) e.firstName = "Enter your first name.";
      if (!v.lastName) e.lastName = "Enter your last name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = "Enter a work email like alex@company.com.";
      if (!v.company) e.company = "Enter your company name.";
    } else {
      if (!v.line1) e.line1 = "Enter a street address.";
      if (!v.city) e.city = "Enter a city.";
      if (!v.postal) e.postal = "Enter a postal code.";
      if (!v.consent) e.consent = "Tick the box so we can use these details for delivery.";
    }
    state.errors = e;
    return Object.keys(e)[0];
  }
  function bind() {
    var f = document.getElementById("gift-form-el");
    f.addEventListener("submit", onSubmit);
    f.addEventListener("change", function (ev) {
      if (ev.target.name === "addressType") { collect(); render(); document.getElementById("addr-" + state.v.addressType).focus(); }
    });
    var b = document.getElementById("back-btn");
    if (b) b.addEventListener("click", function () { collect(); state.step = 1; state.errors = {}; render(); document.getElementById("firstName").focus(); });
  }
  function ref() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "RL-"; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  function onSubmit(ev) {
    ev.preventDefault();
    collect();
    var bad = validate();
    if (bad) { render(); var el = document.getElementById(bad); if (el) el.focus(); return; }
    if (state.step === 1) { state.step = 2; render(); document.getElementById("addr-office").focus(); return; }
    if (state.v.website) { state.done = { ref: ref() }; return render(); }
    state.saving = true; state.submitError = ""; render();
    var r = ref(), v = state.v;
    var rec = { reference: r, firstName: v.firstName, lastName: v.lastName, email: v.email, company: v.company, addressType: v.addressType, line1: v.line1, line2: v.line2, city: v.city, region: v.region, postal: v.postal, country: v.country, phone: v.phone, consent: true, website: v.website };
    var t = tracking(); for (var k in t) rec[k] = t[k];
    if (SHEET_ENDPOINT.indexOf("https://script.google.com/") !== 0) {
      state.saving = false;
      state.submitError = "This form isn’t connected yet. Add the Google Sheets URL to app.js.";
      return render();
    }
    fetch(SHEET_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(rec), redirect: "follow" })
      .then(function (res) { return res.json(); })
      .then(function (out) {
        if (!out || !out.ok) throw new Error(out && out.error || "save_failed");
        state.saving = false; state.done = { ref: r }; render();
      })
      .catch(function () {
        state.saving = false;
        state.submitError = "We couldn’t send your request. Check your connection and try again, or reply to your Rocketlane contact.";
        render();
      });
  }
  render();

  // FAQ accordion
  Array.prototype.forEach.call(document.querySelectorAll(".faq-item button"), function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item"), panel = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      item.classList.toggle("open", open);
      panel.hidden = !open;
    });
  });
})();
