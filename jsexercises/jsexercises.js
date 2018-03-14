function toggle_drawer() {
  var e = document.getElementById('drawer');
  if (e.className == 'o-drawer u-highest o-drawer--top o-drawer--visible') {
    e.className = 'o-drawer u-highest o-drawer--top';
  } else {
    e.className = 'o-drawer u-highest o-drawer--top o-drawer--visible';
  }
//  console.log(e.className);
}

var exercises = {
  B1: {
    label: '3 Data Types',
    stars: 3,
    instructions: '<p>Write out three variables named var1, var2, and var3.  Set them as a string, number, and boolean value.</p>',
    code: '/* Enter code below */' + "\n",
    html: '',
    check: function(o,v) {
      var errors = 3;
      alert(window['var1']);
      for (var i = 1; i <= 3; i++) {
        if (window['var' + i] != null) {
          if (typeof window['var' + i] == 'string') {
            errors--;
          }
        }
      }
      return errors;
    }
  },
  B2: {
    label: 'Broken Syntax 1',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  B3: {
    label: 'Broken Syntax 2',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  B4: {
    label: 'Broken Syntax 3',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  B5: {
    label: 'Make an Array',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  C1: {
    label: 'Sort Numbers',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  C2: {
    label: 'Different Colors',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  C3: {
    label: 'Powers',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  C4: {
    label: 'Days of the Week',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  C5: {
    label: 'XYZ Grid',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  F1: {
    label: 'Addition',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  F2: {
    label: 'Square',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  F3: {
    label: 'Answer a Question',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  F4: {
    label: 'Day of the Week',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  F5: {
    label: 'Day of the Month',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
   O1: {
    label: 'Create a Person',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  O2: {
    label: 'Add Actions',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  O3: {
    label: '',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
  O4: {
    label: '',
    stars: 3,
    code: '',
    instructions: '',
    html: '',
    check: function(o,v) {

    }
  },
  O5: {
    label: '',
    stars: 3,
    instructions: '',
    code: '',
    html: '',
    check: function(o,v) {

    }
  },
}

function setMenu() {
  var labels = {B: 'Basics', C: 'Control Structures', F: 'Functions', O: 'Objects'};
  var c = '';

  var e = {};
  for (var i in labels) {
    e[i] = {
      label: labels[i],
      items: []
    };
  }

  for (var i in exercises) {
    var group = i.substring(0,1);
    var no = parseInt(i.substring(1));
    e[group].items[no] = exercises[i];
    e[group].items[no]['id'] = i;
  }

  for (var g in e) {
    c += '<div class="o-grid__cell o-grid__cell--width-25">' +
      '<div class="o-grid-text">' + e[g].label + '</div>';
      for (var i in e[g].items) {
        c += '<div class="o-grid-text"><a onClick="set(\'' + e[g].items[i].id + '\');" class="exercise_btn">';
        var s = '<span class="star">&#9733;</span>';
        c += s.repeat(e[g].items[i].stars);
        c += ' ' + e[g].items[i].label + '</a></div>';
      }
    c += '</div>';
  }
  var n = document.getElementById('navmenu');
  n.innerHTML = c;
}

var exercise_no = '';
function set(no) {
  if (exercises[no] != null) {
    var o = exercises[no];
    exercise_no = no;

    var instructions = document.getElementById('instructions_block');
    instructions.innerHTML = o.instructions;
    editor.setValue(o.code);

    var html_block = document.getElementById('html_block');
    html_block.innerHTML = o.html;

    var console_block = document.getElementById('console_block');
    console_block.innerHTML = '';

    var result_block = document.getElementById('results');
    result_block.innerHTML = '';

    var e = document.getElementById('drawer');
    e.className = 'o-drawer u-highest o-drawer--top';
  }
}


console.log = function(...props) {
  var e = document.getElementById('console_block');
  var seen = [];

  e.innerHTML += JSON.stringify(props, function(key, val) {
    if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
            return;
        }
        seen.push(val);
    }
    return val;
  });
}

window.console.log = console.log;

function run() {
  var c = editor.getValue();
  var console_block = document.getElementById('console_block');
  console_block.innerHTML = '';

  try {
    eval(c);
    var e = document.getElementById('results');

    if (exercises[exercise_no] != null) {
      var o = exercises[exercise_no];
      var errors = o.check(o,'');
      if (errors == 0) {
        e.innerHTML = '<div class="c-alert c-alert--success">Exercise completed.</div>';
      } else {
        e.innerHTML = '<div class="c-alert c-alert--error">Exercise incomplete: ' + errors + ' errors.</div>';
      }
    } else {
      e.innerHTML = '<div class="c-alert c-alert--warning">Invalid exercise.</div>';
    }
  } catch (e) {
    alert(e);
    console.log(e);
  }
}
