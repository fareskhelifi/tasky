(function (global) {
  var debug_mode = false;
  var _reserved_in_filter = { a: 1, e: 1, da: 1, del: 1, 'in': 1, con: 1, hanno: 1, maggiore: 1, minore: 1, uguale: 1, compreso: 1, tutti: 1, i: 1, che: 1 };
  var months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  var dayMap = { lun: 1, mar: 2, mer: 3, gio: 4, ven: 5, sab: 6, dom: 7 };
  var enumMap = { first: '1', second: '2', third: '3', forth: '4' };
  var opMap = { '=': '<>', like: '<>', '>=': '<', '<=': '>', '<': '>=', '>': '<=' };
  var testDate = new Date(); // per i test uso la data 21/08/2019
  testDate.setDate(21);
  testDate.setMonth(7);
  testDate.setFullYear(2019);

  Date.prototype.addMonths = function (months) {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + months);
    return date;
  };
  Date.prototype.addYears = function (years) {
    var date = new Date(this.valueOf());
    date.setFullYear(date.getFullYear() + years);
    return date;
  };
  Date.prototype.addWeeks = function (weeks) {
    var date = new Date(this.valueOf());
    return date.addDays(weeks * 7);
  };
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  Date.prototype.formatDate = function () {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var day = this.getDate();
    var ret = '';

    ret += (day < 10 ? '0' : '') + day;
    ret += '-' + (month < 10 ? '0' : '') + month;
    ret += '-' + year;

    return ret;
  };

  function parseNum(t, p, res) {
    if (p < t.length && t[p].match(/^[0-9]+(\.[0-9]+)?$/g)) {
      var r = parseFloat(t[p]);
      if (!isNaN(r)) {
        res.putCmd('NUM:' + t[p]);
        return 1;
      }
    }
    return 0;
  }

  function parseMultiStr(t, p, res, n) {
    if (p + n <= t.length) {
      var i,
        s = '',
        pr = 1;
      for (i = 0; i < n; i++) {
        s = s + (i > 0 ? ' ' : '') + t[p + i];
        // if (t[p+i].length<=2) pr=pr*0.98
        if (_reserved_in_filter[t[p + i]]) {
          pr = pr * 0.9;
        } // 0.95
        if (!isNaN(parseFloat(t[p + i]))) { // penalizza i numeri nelle stringhe
          pr = pr * 0.9;
        }
      }
      res.putCmd('STR:' + s);

      // if (s.length<=4*n) pr=pr.*0.95 //0.95

      if (n == 1) {
        { res.putProb(pr); }
      } else if (n == 2) {
        { res.putProb(0.99 * pr); }
      } else if (n == 3) {
        // res.putProb(0.97*pr)
        { res.putProb(0.98 * pr); }
      } else if (n >= 4) {
        // res.putProb(0.95*pr)
        res.putProb(0.97 * pr);
      }
      return n;
    }
    return 0;
  }

  function parseDate(t, p, res) {
    var s = t[p];
    if (s == undefined) {
      return 0;
    }
    if (s.match(/^((0?[1-9]|[12]\d|3[01])(\/|-)(0?[1-9]|1[0-2])(\/|-)([12]\d{3}|[12]\d{1}))$/g)) {
      // data nel formato 31/01/1970, 31/01/70, 3/12/ oppure 31-01-1970
      s = s.indexOf('/') > -1 ? s.split('/') : s.split('-');
      res.putCmd('DATE:' + new Date(s[1] + '/' + s[0] + '/' + s[2]).formatDate());
      return 1;
    } else if (s.match(/^([12]\d{3}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01]))$/g)) {
      // data nel formato 1970-01-01
      s = s.split('/');
      res.putCmd('DATE:' + new Date(s[2] + '/' + s[1] + '/' + s[0]).formatDate());
      return 1;
    } else if (s.match(/^(0?[1-9]|[12]\d|3[01])$/g)) {
      var res_string;
      var res_array = [0, 0, s];
      var i = 1;
      s = t[p + i];

      if (s == 'di') {
        i++;
        s = t[p + i];
      }

      if (s != undefined && months.indexOf(s.toLowerCase()) > -1) {
        res_array[1] = months.indexOf(s.toLowerCase()) + 1;
        res_string = 'DAYMONTH:' + res_array[2] + '/' + res_array[1];
        i++;
        s = t[p + i];

        if (s == 'del') {
          i++;
          s = t[p + i];
        }

        if (s != undefined && s.match(/^([0-2][0-9][0-9][0-9])$/g)) {
          res_array[0] = s;
          res_string = 'DATE:' + new Date(res_array.join('/')).formatDate();
          i++;
          res.putCmd(res_string);
          return i;
        }
        return 0;
      }
    }
    return 0;
  }

  function parseHour(t, p, res) {
    var s = t[p];
    if (s == undefined) {
      return 0;
    }
    if (s.match(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/g)) {
      // Log('HH:MM 12-hour format, optional leading 0, mandatory meridiems (AM/PM)', debug);
      res.putCmd('HOUR:' + s);
      return 1;
    } else if (s.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g)) {
      // Log('HH:MM 24-hour format, optional leading 0', debug);
      res.putCmd('HOUR:' + s);
      return 1;
    } else if (s.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3])$/g)) {
      // solo le ore senza i minuti
      res.putCmd('HOUR:' + s);
      return 1;
    }
    return 0;
  }

  function parseMinute(t, p, res) {
    var s = t[p];
    if (s == undefined) {
      return 0;
    }
    if (s.match(/^(0*(?:[1-5]?[0-9]?))$/g)) {
      res.putCmd('MINUTE:' + s);
      return 1;
    }
    return 0;
  }

  function parseDay(t, p, res) {
    var s = t[p];
    if (s == undefined) {
      return 0;
    }
    if (s.match(/^([0-9]|[0-2][0-9]|3[0-1])$/g)) {
      res.putCmd('DAY:' + s);
      return 1;
    }
    return 0;
  }

  function parseYear(t, p, res) {
    var s = t[p];
    if (s == undefined) {
      return 0;
    }
    if (s.match(/^([0-2][0-9][0-9][0-9])$/g)) {
      // anno formato numerico
      res.putCmd('YEAR:' + s);
      return 1;
    }
    return 0;
  }

  function parseCmd(element, char) {
    var split_char_index = element.indexOf(char);
    var cmd = element.substring(0, split_char_index);
    var value = element.substring(split_char_index + 1);
    return { cmd: cmd, value: value };
  }

  function transformCmd(cmd_array, debug) {
    debug_mode = !!debug;
    // la funzione trasforma l'array di comandi cercando vari tag di marcatura (ad esempio StartDate)
    var elm, obj;
    var res = {};
    for (var i = 0; i < cmd_array.length; i++) {
      elm = parseCmd(cmd_array[i], ':');
      var index = { i: i };
      if (elm.value == 'StartFilter') {
        res.filters = res.filters ? res.filters : [];
        obj = parseStartTag(cmd_array, index, 'EndFilter');
        i = index.i;
        res.filters.push(obj);
      } else if (elm.value == 'StartSort') {
        res.sorting = parseStartTag(cmd_array, index, 'EndSort');
        i = index.i;
      } else if (elm.value == 'StartDate') {
        res.datetime = res.datetime ? res.datetime : [];
        obj = parseStartTag(cmd_array, index, 'EndDate');
        i = index.i;
        res.datetime.push(obj);
      } else if (elm.value == 'StartCompile') {
        res.compile = res.compile ? res.compile : [];
        obj = parseStartTag(cmd_array, index, 'EndCompile');
        i = index.i;
        res.compile.push(obj);
      } else if (elm.value == 'StartNavigation') {
        res.navigation = res.navigation ? res.navigation : [];
        obj = parseStartTag(cmd_array, index, 'EndNavigation');
        i = index.i;
        res.navigation = obj;
      } else if (elm.value == 'StartMD') {
        res.masterdetail = res.masterdetail ? res.masterdetail : [];
        obj = parseStartTag(cmd_array, index, 'EndMD');
        i = index.i;
        res.masterdetail = obj;
      } else if (elm.value == 'StartFilterKey') {
        res.filterkey = res.filterkey ? res.filterkey : [];
        obj = parseStartTag(cmd_array, index, 'EndFilterKey');
        i = index.i;
        res.filterkey = obj;
      } else if (elm.value == 'StartOnlyValue') {
        res.onlyvalue = res.onlyvalue ? res.onlyvalue : [];
        obj = parseStartTag(cmd_array, index, 'EndOnlyValue');
        i = index.i;
        res.onlyvalue = obj;
      } else if (elm.cmd == 'FLD') {
        res.fld = res.fld ? res.fld : [];
        res.fld.push(elm.value);
      } else if (elm.cmd == 'STR' || elm.cmd == 'NUM') {
        res.values = res.values ? res.values : [];
        res.values.push(elm.value);
      } else if (elm.cmd != 'Once' && elm.cmd != 'Decr' && elm.value != 'tabella' && elm.cmd != 'TYPE') {
        elm.cmd == '' ? res[elm.value] = elm.value : res[elm.cmd] = elm.value;
      }
    }
    return res;
  }

  function parseStartTag(cmd_array, index, endCmd) {
    var i = index.i;
    var obj = {};
    var elm, nextElem;
    // booleano che tiene traccia se trova un'operazione "not" così da "rovesciare" l'operazione principale
    // una volta usato il not, negativeOp torna ad essere false
    var negativeOp = false;
    i++;
    while (i < cmd_array.length && cmd_array[i] != endCmd) {
      elm = parseCmd(cmd_array[i], ':');
      if (i < cmd_array.length - 1) {
        nextElem = parseCmd(cmd_array[i + 1], ':');
      }
      if (elm.value != endCmd) {
        if (elm.value == 'StartDate') {
          index.i = i;
          obj.values = obj.values ? obj.values : [];
          var objDate = parseStartTag(cmd_array, index, 'EndDate');
          i = index.i++;
          obj.values.push(interpretateDate(objDate));
        } else if (endCmd == 'EndMenu') {
          if (elm.cmd == 'NUM') {
            obj.num = elm.value;
          }
        } else if (endCmd == 'EndNavigation') {
          if (elm.cmd == 'NUM') {
            obj.num = elm.value;
          } else if (elm.cmd == 'STR') {
            obj.str = elm.value;
          } else if (elm.cmd == 'FLD') {
            obj.fld = elm.value;
          } else if (elm.cmd == 'ACTION') {
            obj.action = elm.value;
          } else if (elm.cmd == 'NAVTYPE') {
            obj.type = elm.value;
          } else if (elm.value == 'FIRST' || elm.value == 'SECOND' || elm.value == 'THIRD' || elm.value == 'FOURTH') {
            obj.num = enumMap[elm.value.toLowerCase()];
          }
        } else if (endCmd == 'EndMD') {
          if (elm.cmd == 'NUM') {
            obj.num = elm.value;
          } else if (elm.cmd == 'ACTTYPE') {
            obj.action = elm.value;
          } else if (elm.value == 'FIRST' || elm.value == 'SECOND' || elm.value == 'THIRD' || elm.value == 'FOURTH') {
            obj.num = enumMap[elm.value.toLowerCase()];
          } else if (elm.value == 'CURRENT') {
            obj.current = true;
          }
        } else if (elm.cmd == 'STR' || elm.cmd == 'NUM' && endCmd != 'EndDate') {
          obj.values = obj.values ? obj.values : [];
          obj.values.push(elm.value);
          if ( (endCmd == 'EndFilterKey' || obj.DEFAULTFILTER) && nextElem && nextElem.cmd == 'TYPE') {
            obj.type = nextElem.value;
          }
        } else if (elm.cmd == 'FLD' && endCmd == 'EndSort') {
          obj.fld = obj.fld ? obj.fld : [];
          obj.fld.push(elm.value);
          if (nextElem && nextElem.cmd == 'TYPE') {
            nextElem = parseCmd(cmd_array[i + 2], ':');
          }
          if (nextElem && nextElem.cmd != 'ORDER') { // prendo il comando seguente senza contare il tipo
            obj.order = obj.order ? obj.order : [];
            obj.order.push('asc'); // imposto il valore di default in quanto non è previsto dalla frase detta
          }
        } else if (elm.cmd == 'FLD') {
          obj.fld = obj.fld ? obj.fld : [];
          obj.fld.push(elm.value);
        } else if (elm.cmd == 'ORDER') {
          obj.order = obj.order ? obj.order : [];
          obj.order.push(elm.value);
        } else if (elm.cmd == 'OP') {
          obj.ops = obj.ops ? obj.ops : [];
          if (elm.value == 'btw') {
            if (negativeOp) {
              obj.ops.push('<');
              obj.ops.push('>');
              negativeOp = false;
            } else {
              obj.ops.push('>=');
              obj.ops.push('<=');
            }
          } else if (elm.value == '<' && nextElem && nextElem.value == '=') {
            obj.ops.push(negativeOp ? '>' : '<=');
            negativeOp = false;
            i++;
          } else if (elm.value == '>' && nextElem && nextElem.value == '=') {
            obj.ops.push(negativeOp ? '<' : '>=');
            negativeOp = false;
            i++;
          } else if (elm.value == '=') {
            obj.ops.push(negativeOp ? '<>' : '=');
            negativeOp = false;
          } else if (elm.value == 'not') {
            negativeOp = true;
          } else if (negativeOp) {
            obj.ops.push(opMap[elm.value]);
            negativeOp = false;
          } else {
            obj.ops.push(elm.value);
          }
        } else if (elm.cmd != 'TYPE') {
          elm.cmd == '' ? obj[elm.value] = elm.value : obj[elm.cmd] = elm.value;
        }
      }
      i++;
    }
    index.i = i;
    return obj;
  }

  function interpretateDate(dateCmds) {
    var resStr = '';
    var time = 0; // in minuti
    testDate.setDate(21);
    testDate.setMonth(7);
    testDate.setFullYear(2019);
    var date = debug_mode ? testDate : new Date();
    var dayToFound, currentDay;
    if (dateCmds.HOUR) {
      if (dateCmds.HOUR.indexOf(':') != -1) { // è già un ora completa valida
        resStr = dateCmds.HOUR;
      } else {
        time = 60 * dateCmds.HOUR;
        if (dateCmds.MINUTE) {
          if (dateCmds.SpHOUR == '-') {
            time -= parseInt(dateCmds.MINUTE);
          } else {
            time += parseInt(dateCmds.MINUTE);
          }
        }
        if (dateCmds.PoD == 'ser' || dateCmds.PoD == 'pom') {
          time += 12 * 60;
        }
        var hour = Math.floor(time / 60 % 24);
        var minutes = time % 60;
        resStr = (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
      }
    }

    var dateFound = false;
    if (dateCmds.DATE) {
      resStr = dateCmds.DATE;
    } else {
      if (dateCmds.DAY) {
        dateFound = true;
        date.setDate(parseInt(dateCmds.DAY));
      }
      if (dateCmds.MONTH) {
        dateFound = true;
        date.setMonth(parseInt(dateCmds.MONTH) - 1);
      }
      if (dateCmds.YEAR) {
        dateFound = true;
        date.setFullYear(parseInt(dateCmds.YEAR));
      }
      if (dateCmds.DAYMONTH) {
        dateFound = true;
        var tmpDate = dateCmds.DAYMONTH.split('/');
        date.setDate(parseInt(tmpDate[0]));
        date.setMonth(parseInt(tmpDate[1]) - 1);
        if (!dateCmds.SpYEAR) {
          if (dateCmds.CURRTIME) {
            date = date.addYears(0);
          } else if (dateCmds.PREVTIME) {
            date = date.addYears(-1);
          } else if (dateCmds.NEXTTIME) {
            date = date.addYears(1);
          }
        }
      }

      if (dateCmds['SpDAY-']) {
        dateFound = true;
        date = date.addDays(-parseInt(dateCmds.NUM));
      } else if (dateCmds['SpDAY+']) {
        dateFound = true;
        date = date.addDays(parseInt(dateCmds.NUM));
      } else if (dateCmds.SpDAY) {
        dateFound = true;
        date = date.addDays(parseInt(dateCmds.SpDAY));
      } else if (dateCmds['SpWEEK-']) {
        dateFound = true;
        date = date.addWeeks(-parseInt(dateCmds.NUM));
      } else if (dateCmds['SpWEEK+']) {
        dateFound = true;
        date = date.addWeeks(parseInt(dateCmds.NUM));
      } else if (dateCmds.SpWEEK) {
        dateFound = true;
        if (dateCmds.DOW) {
          if (dateCmds.PREVTIME) {
            date = date.addWeeks(-1);
          } else if (dateCmds.NEXTTIME) {
            date = date.addWeeks(1);
          }
          dayToFound = dayMap[dateCmds.DOW];
          currentDay = date.getDay();
          date = date.addDays(dayToFound - currentDay);
        } else {
          date = date.addWeeks(parseInt(dateCmds.SpWEEK));
        }
      } else if (dateCmds['SpMONTH-']) {
        dateFound = true;
        date = date.addMonths(-parseInt(dateCmds.NUM));
      } else if (dateCmds['SpMONTH+']) {
        dateFound = true;
        date = date.addMonths(parseInt(dateCmds.NUM));
      } else if (dateCmds.SpMONTH) {
        dateFound = true;
        if (dateCmds.CURRTIME) {
          date = date.addMonths(0);
        } else if (dateCmds.PREVTIME) {
          date = date.addMonths(-1);
        } else if (dateCmds.NEXTTIME) {
          date = date.addMonths(1);
        } else {
          date = date.addMonths(parseInt(dateCmds.SpMONTH));
        }
      } else if (dateCmds['SpYEAR-']) {
        dateFound = true;
        date = date.addYears(-parseInt(dateCmds.NUM));
      } else if (dateCmds['SpYEAR+']) {
        dateFound = true;
        date = date.addYears(parseInt(dateCmds.NUM));
      } else if (dateCmds.SpYEAR) {
        dateFound = true;
        if (dateCmds.CURRTIME) {
          date = date.addYears(0);
        } else if (dateCmds.PREVTIME) {
          date = date.addYears(-1);
        } else if (dateCmds.NEXTTIME) {
          date = date.addYears(1);
        } else {
          date = date.addYears(parseInt(dateCmds.SpYEAR));
        }
      }

      if (dateCmds.DOW) {
        dayToFound = dayMap[dateCmds.DOW];
        if (!dateFound) {
          dateFound = true;
          currentDay = date.getDay();

          if (dateCmds.PREVTIME && currentDay < dayToFound) {
            date = date.addWeeks(-1);
          } else if (dateCmds.NEXTTIME && currentDay > dayToFound) {
            date = date.addWeeks(1);
          }
          date = date.addDays(dayToFound - currentDay);
        }
      }

      if (dateCmds.LAST) {
        // l'ultimo del mese precedente
        date = date.addMonths(1); // ripristino il mese di partenza (lo tolgo successivamente)
        date = new Date(date.setDate(0)); // mi posiziono sull'ultimo giorno
        while (dayToFound != undefined && date.getDay() != dayToFound) { // controllo se c'è se c'è un DoW da trovare e poi procedo
          // l'ultimo giovedi del mese precedente
          date = date.addDays(-1);
        }
        dateFound = true;
      } else if (dateCmds.FIRST || dateCmds.SECOND || dateCmds.THIRD || dateCmds.FOURTH) {
        // il primo martedì del prossimo mese
        var nToFound = dateCmds.FIRST ? 1 : dateCmds.SECOND ? 2 : dateCmds.THIRD ? 3 : dateCmds.FOURTH ? 4 : -1;
        if (dayToFound != undefined) { // controllo se c'è se c'è un DoW da trovare
          date = new Date(date.setDate(1)); // mi posiziono sul primo giorno del mese
          while (date.getDay() != dayToFound) {
            date = date.addDays(1);
          }
          // sono posionato al giorno corrente
          nToFound--;
          date = date.addDays(nToFound * 7); // moltiplico per il numero di settimane (togliendo quella corrente in cui sono già posizionato)
        } else {
          date = new Date(date.setDate(nToFound)); // mi posiziono sul giorno del mese stabilito (frist, second, ...)
        }
        dateFound = true;
      }
    }

    if (dateFound) {
      resStr = date.formatDate();
    }

    return resStr;
  }

  global.GrammarParseFunctions = {
    transformCmd: transformCmd,
    parseNum: parseNum,
    parseMultiStr: parseMultiStr,
    parseDate: parseDate,
    parseHour: parseHour,
    parseMinute: parseMinute,
    parseDay: parseDay,
    parseYear: parseYear
  };
})(this);
