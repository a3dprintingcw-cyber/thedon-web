/* Demo order store. Keeps orders in this browser only (localStorage) so the
   order page and the kitchen board can talk to each other without a backend.
   Nothing is sent anywhere. */
(function () {
  var K = { orders: 'thedon_orders', settings: 'thedon_settings', seeded: 'thedon_seeded' };
  var mem = {};
  function read(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in mem ? mem[k] : d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
  function money(v) { return 'XCG ' + (Math.round(v * 100) % 100 ? v.toFixed(2) : v.toFixed(0)); }
  function orders() { return read(K.orders, []); }
  function settings() { var s = read(K.settings, {}); return { prep: s.prep || 20, paused: !!s.paused }; }
  function setSettings(p) { var s = settings(); for (var k in p) s[k] = p[k]; write(K.settings, s); }
  function nextNumber() { var o = orders(); return o.length ? Math.max.apply(null, o.map(function (x) { return x.number; })) + 1 : 101; }
  function add(o) {
    var all = orders();
    o.id = 'o' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    o.number = nextNumber();
    o.status = 'new';
    o.created = Date.now();
    var prep = settings().prep;
    var extra = { 'ASAP': 0, 'In 30 min': 30, 'In 1 hour': 60, 'Later today': 120 }[o.when] || 0;
    o.due = Date.now() + Math.max(prep, extra) * 60000 + (o.mode === 'delivery' ? 15 * 60000 : 0);
    o.paid = o.pay === 'Online';
    all.push(o); write(K.orders, all); return o;
  }
  function get(id) { return orders().filter(function (o) { return o.id === id; })[0]; }
  function update(id, p) { var all = orders(); all.forEach(function (o) { if (o.id === id) for (var k in p) o[k] = p[k]; }); write(K.orders, all); }
  function seed() {
    if (read(K.seeded, false)) return;
    write(K.seeded, true);
    var now = Date.now(), m = 60000;
    var demo = [
      { name: 'Shanaira M.', phone: '+599 9 512 3344', mode: 'pickup', pay: 'Cash', notes: '', total: 71,
        items: [{ qty: 1, name: 'Picaña', opts: ['Small'], price: 36 }, { qty: 1, name: 'The Don burger 4XL stacker', opts: [], price: 35, note: 'No pickles' }].map(function (l) { return l; }),
        status: 'cooking', created: now - 14 * m, due: now + 6 * m, paid: false },
      { name: 'Jurgen R.', phone: '+599 9 678 1020', mode: 'delivery', address: 'Kaya Flamboyan 14, Mahaai', pay: 'Online', notes: 'Call when outside', total: 59,
        items: [{ qty: 1, name: 'Mix platter · choose 3', opts: ['Wings', 'Ribs', 'Lomito'], price: 47 }, { qty: 3, name: 'Soft drink', opts: ['Coca Cola'], price: 4 }],
        status: 'new', created: now - 2 * m, due: now + 33 * m, paid: true },
      { name: 'Kimberly D.', phone: '+599 9 523 7788', mode: 'pickup', pay: 'Card', notes: '', total: 52,
        items: [{ qty: 1, name: 'BBQ chicken pizza', opts: [], price: 41 }, { qty: 1, name: 'Loaded fries', opts: [], price: 11 }],
        status: 'ready', created: now - 25 * m, due: now - 1 * m, paid: true }
    ];
    var all = orders(), n = 98;
    demo.forEach(function (o) { o.id = 'seed' + n; o.number = n++; all.unshift(o); });
    all.sort(function (a, b) { return a.number - b.number; });
    write(K.orders, all);
  }
  function reset() { write(K.orders, []); write(K.settings, {}); write(K.seeded, false); seed(); }
  window.DonStore = { orders: orders, get: get, add: add, update: update, settings: settings, setSettings: setSettings, seed: seed, reset: reset, money: money };
})();
