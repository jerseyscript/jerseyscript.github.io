// Hide the fake styles, and grab the real styles
var realStyle = document.getElementsByTagName('jersey-style')[0];
realStyle.style.display = 'none';

// Grab the data
var toApply = [];
realStyle.innerText.split("\n").forEach(function (line) {
  var match = line.trim().match('(.+?){(.+?)}');
  if (match) {

    var things = match[2].split(';').map(function (s) { return s.trim(); });
    things.slice(0, -1).forEach(function (t) {
      var pieces = t.split(':');

      // handle dem commas
      match[1].split(',').forEach(function (selector) {

        selector = selector.trim();

        var elems;
        if (selector[0] === '#') {
          // IDs
          elems = [document.getElementById(selector.slice(1))];
        } else if (selector.indexOf(' ') !== -1) {
          // Nested
          var tags = selector.split(' ');
          elems = [];
          var es = document.getElementsByTagName(tags[0]);
          for (var i = 0; i < es.length; i++) {
            var cn = es[i].childNodes;
            for (var j = 0; j < cn.length; j++) {
              if (cn[j].tagName === tags[1].toUpperCase()) {
                elems.push(cn[j]);
              }
            }
          }
        } else {
          // Bare tags
          elems = document.getElementsByTagName(selector), elem;
        }

        var elem;
        for (var i = 0; i < elems.length; i++) {
          elem = elems[i];
          toApply.push([elem, pieces[0], pieces[1].trim()]);
        }

      });

    });

  }
});

// Shuffle the styles like google does
var o = toApply;
for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

var applyNext = function () {
  var app = toApply.shift();
  app[0].style[app[1]] = app[2];
};

// And apply it
var interval = setInterval(function () {
  applyNext();
  if (!toApply.length) {
    clearInterval(interval);
  }
}, 50);
