(function (global) { // versione ES5 per browser tradizionale
  function Tokens(s, mode) {
    // mode 0: apice è apostrofo, 1: apici delimitano stringhe
    var r = [];
    var c, i,
      t = '';
    var stop = null;
    mode = mode == null ? 0 : mode;
    for (i = 0; i < s.length; i++) {
      c = s.charAt(i);
      if (c == stop) {
        t = t + c;
        stop = null;
      } else if (!(stop === null)) {
        t = t + c;
      } else if (mode == 1 && (c == "'" || c == '"' || c == '$')) {
        t = c;
        stop = c;
      } else if (mode == 0 && c == "'") {
        // t = t + c; // questo serve a togliere l'apostrofo dai token, scommentanto lascia l'apostrofo
        r.push(t);
        t = '';
      } else if (c == ' ' || c == '[' || c == ']' || c == '(' || c == ')' || c == '{' || c == '}' || c == '|') {
        if (t != '') {
          r.push(t); t = '';
        }
        if (c != ' ') {
          r.push(c);
        }
      } else {
        t = t + c;
      }
    }
    if (t != '') {
      r.push(t);
    }
    return r;
  }

  function levenshteinDistance(a, b) {
    // Create empty edit distance matrix for all possible modifications of
    // substrings of a to substrings of b.
    const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    // Fill the first row of the matrix.
    // If this is first row then we're transforming empty string to a.
    // In this case the number of transformations equals to size of a substring.
    for (let i = 0; i <= a.length; i += 1) {
      distanceMatrix[0][i] = i;
    }

    // Fill the first column of the matrix.
    // If this is first column then we're transforming empty string to b.
    // In this case the number of transformations equals to size of b substring.
    for (let j = 0; j <= b.length; j += 1) {
      distanceMatrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j += 1) {
      for (let i = 1; i <= a.length; i += 1) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        distanceMatrix[j][i] = Math.min(
          distanceMatrix[j][i - 1] + 1, // deletion
          distanceMatrix[j - 1][i] + 1, // insertion
          distanceMatrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return distanceMatrix[b.length][a.length];
  }

  class GrammarElement {
    NLPParse() {
      /* abstract*/ 1 / 0;
    }
  }

  class GrammarAlt extends GrammarElement {
    constructor() {
      super();
      this.alt = [];
    }

    NLPParse(pos, prob, res, next) {
      var i,
        ocmdp = res.cmdp;
      res.nodeCnt++;
      for (i = 0; i < this.alt.length; i++) {
        if (prob > res.prob) {
          this.alt[i].NLPParse(pos, prob, res, next);
        }
        res.cmdp = ocmdp;
      }
      if (this.opt && prob > res.prob) {
        next(pos, prob, res);
      }
    }
  }

  class GrammarSeq extends GrammarElement {
    constructor() {
      super();
      this.seq = [];
    }

    NLPParse(pos, prob, res, next) {
      res.nodeCnt++;
      if (prob > res.prob) {
        this.seq[0].NLPParse(pos, prob, res, (pos, prob, res) => {
          this.NLPNext(pos, prob, res, 1, next);
        });
      }
    }
    NLPNext(pos, prob, res, idx, next) {
      if (prob > res.prob) {
        if (idx < this.seq.length) {
          this.seq[idx].NLPParse(pos, prob, res, (pos, prob, res) => {
            this.NLPNext(pos, prob, res, idx + 1, next);
          });
        } else {
          next(pos, prob, res);
        }
      }
    }
  }

  class GrammarRep extends GrammarElement {
    constructor() {
      super();
      this.rep = null;
    }

    NLPParse(pos, prob, res, next) {
      res.nodeCnt++;
      if (pos < res.tokens.length) {
        this.rep.NLPParse(pos, prob, res, (pos, prob, res) => {
          this.NLPNext(pos, prob, res, next);
        });
      }
    }
    NLPNext(pos, prob, res, next) {
      var ocmdp = res.cmdp;
      if (pos < res.tokens.length) {
        this.rep.NLPParse(pos, prob, res, (pos, prob, res) => {
          this.NLPNext(pos, prob, res, next);
        });
      }
      res.cmdp = ocmdp;
      if (prob > res.prob) {
        next(pos, prob, res);
      }
    }
  }

  function _minimal_stemmer(s) {
    // stemming ultra-minimale se manca lo stemmer ufficiale
    if (s.length > 3) {
      return s.substring(0, s.length - 1);
    }
    return s;
  }

  var _articoli = { il: 1, lo: 1, la: 1, "l'": 1, l: 1, i: 2, gli: 2, le: 2, un: 3, uno: 3, una: 3, "un'": 3, dei: 4, degli: 4, delle: 4, "dell'": 4, dell: 4 };
  function articolo(s) {
    return _articoli[s] >= 1;
  }

  var _da_preposizioni_a_preposizioni_articolate = {
    di: { del: 1, della: 1, dello: 1, dei: 1, delle: 1, degli: 1, "dell'": 1, dell: 1 },
    a: { al: 1, alla: 1, allo: 1, ai: 1, alle: 1, agli: 1, "all'": 1, all: 1 },
    da: { dal: 1, dalla: 1, dallo: 1, dai: 1, dalle: 1, dagli: 1, "dall'": 1, dall: 1 },
    'in': { nel: 1, nella: 1, nello: 1, nei: 1, negli: 1, nelle: 1, "nell'": 1, nell: 1 },
    con: { col: 1, coi: 1 },
    su: { sul: 1, sulla: 1, sullo: 1, sui: 1, sulle: 1, sugli: 1, "sull'": 1, sull: 1 }
  };
  function preposizioneArticolata(s, t) {
    var v = _da_preposizioni_a_preposizioni_articolate[t];
    return v != null && v[s] >= 1;
  }
  var _da_articolo_a_preposizioni_articolate = {
    il: { del: 1, al: 1, dal: 1, nel: 1, col: 1, sul: 1, "dell'": 1, del: 1 },
    la: { della: 1, alla: 1, dalla: 1, nella: 1, sulla: 1, "all'": 1, all: 1 },
    lo: { dello: 1, allo: 1, dallo: 1, nello: 1, sullo: 1, "sull'": 1, sull: 1 },
    l: { del: 1, al: 1, dal: 1, nel: 1, col: 1, sul: 1, "dell'": 1, del: 1, della: 1, alla: 1, dalla: 1, nella: 1, sulla: 1, "all'": 1, all: 1, dello: 1, allo: 1, dallo: 1, nello: 1, sullo: 1, "sull'": 1, sull: 1, delle: 1, alle: 1, dalle: 1, nelle: 1, sulle: 1 },
    "l'": { del: 1, al: 1, dal: 1, nel: 1, col: 1, sul: 1, "dell'": 1, del: 1, della: 1, alla: 1, dalla: 1, nella: 1, sulla: 1, "all'": 1, all: 1, dello: 1, allo: 1, dallo: 1, nello: 1, sullo: 1, "sull'": 1, sull: 1, delle: 1, alle: 1, dalle: 1, nelle: 1, sulle: 1 },
    i: { dei: 1, ai: 1, dai: 1, nei: 1, coi: 1, sui: 1 },
    le: { delle: 1, alle: 1, dalle: 1, nelle: 1, sulle: 1 },
    gli: { degli: 1, agli: 1, dagli: 1, negli: 1, sugli: 1 }
  };
  function preposizioneDaArticolo(s, t) {
    var v = _da_articolo_a_preposizioni_articolate[t];
    return v != null && v[s] >= 1;
  }


  class GrammarTok extends GrammarElement {
    constructor() {
      super();
      this.tok = null;
      this.stemmed_tok = null;
      this.lowercase_tok = null;
    }

    NLPParse(pos, prob, res, next) {
      res.nodeCnt++;
      var ocmdp = res.cmdp;
      if (pos < res.tokens.length) {
        var tok_at_pos = res.tokens[pos];
        if (tok_at_pos == this.tok || res.tokens[pos].toLowerCase() == this.tok) { // token esatto
          next(pos + 1, prob, res);
        } else {
          /** **************** TEST ***********************/
          if (pos > 0 && preposizioneDaArticolo(res.tokens[pos - 1], this.lowercase_tok) && articolo(this.lowercase_tok) && res.prob < prob * 1) { // se è un articolo guarda se la parola precedente è una preposizione articolata (che si è assorbita l'articolo)
            res.cmdp = ocmdp;
            next(pos, prob * 1, res);
          }
          /** *****************************************/
          if (stem(tok_at_pos) == this.stemmed_tok && res.prob < prob * 0.98) { // il token "stemmato"
            res.cmdp = ocmdp;
            next(pos + 1, prob * 0.98, res);
          }
          if (articolo(tok_at_pos) && articolo(this.lowercase_tok) && res.prob < prob * 0.98) { // se sono due articoli (per ora) accetta ...
            res.cmdp = ocmdp;
            next(pos + 1, prob * 0.98, res);
          }
          if ((tok_at_pos == 'ed' || tok_at_pos == 'è') && this.tok == 'e' && res.prob < prob * 0.98) { // accetta ed per e (forse ce ne sono anche altri ....
            res.cmdp = ocmdp;
            next(pos + 1, prob * 0.98, res);
          }
          if (this.tok.length <= 3 && preposizioneArticolata(tok_at_pos, this.lowercase_tok) && res.prob < prob * 0.98) { // nella grammatica c'è una preposizione semplice, ha trovato una corrispondente preposizione articolata
            res.cmdp = ocmdp;
            next(pos + 1, prob * 0.98, res);
          }
          /*
            if (levenshteinDistance(res.tokens[pos],this.tok)<=2 && res.prob < prob*0.95){ // prova anche tra token "simili" scondo la distanza di levenshteinDistance
              res.cmdp = ocmdp;
              next(pos + 1, prob * 0.95, res);
            }
            */
          if (articolo(this.lowercase_tok) && res.prob < prob * 0.95) { // prova anche scartando un articolo
            res.cmdp = ocmdp;
            next(pos, prob * 0.95, res);
          }
        }
      }
    }
  }

  class GrammarSub extends GrammarElement {
    constructor() {
      super();
      this.subtxt = null;
    }

    NLPParse(pos, prob, res, next) {
      res.nodeCnt++;
      var el = res.completeGrammar[this.subtxt];
      if (el == undefined) {
        throw '[speechGrammar] ' + this.subtxt + ': sub-grammar not found.';
      }
      el.NLPParse(pos, prob, res, next);
    }
  }

  class GrammarAdded extends GrammarElement {
    constructor() {
      super();
      this.category = null;
    }

    NLPParse(pos, prob, res, next) {
      res.nodeCnt++;
      var i, k, p, lm, ocmdp, step;
      var added = res.completeGrammar.added;
      if (added) {
        var categoryArray = added[this.category]; // la categoria di parole aggiunte
        if (res.learnMode && !categoryArray) {
          categoryArray = [];
        }
        if (categoryArray && pos < res.tokens.length) {
          lm = getCategoryMatch(categoryArray, this.category, res, pos);
          for (i = 0; i < lm.length; i++) {
            ocmdp = res.cmdp;
            for (k = 0; k < lm[i].cmds.length; k++) {
              res.putCmd(lm[i].cmds[k]);
            }
            step = lm[i].nTok;
            p = lm[i].prob;
            next(pos + step, prob * p, res, next);
            res.cmdp = ocmdp;
          }
        }
      }
    }
  }

  function getCategoryMatch(category, categoryName, res, pos) {
    if (res.ctx._mem_category && res.ctx._mem_category[categoryName] && res.ctx._mem_category[categoryName][pos]) {
      // console.log('pos='+pos+' categoryName='+categoryName+' Hit!')
      // console.log(res.ctx._mem_category[categoryName][pos])
      return res.ctx._mem_category[categoryName][pos];
    }
    var t = res.tokens;
    var tokensStart = articolo(t[pos].toLowerCase()) && pos + 1 < t.length ? 1 : 0; // se la prima parola è un articolo controlla la seguente
    var w = t[pos + tokensStart].toLowerCase();
    var match = category[w];
    if (!match) {
      match = category[stem(w)];
    }
    // in match i valori che corrispondono alla parola nella categoria
    var result = [];
    if (match) {
      for (let i = 0; i < match.length; i++) {
        // controllo tutte le parole del match corrente
        var words = match[i].tokens;
        var matchStart = articolo(words[0].toLowerCase()) ? 1 : 0;
        var nStem = 0,
          ok = true,
          j;
        for (j = matchStart; j < words.length && ok; j++) {
          if (pos + j - matchStart + tokensStart < t.length) {
            if (words[j].toLowerCase() == t[pos + j - matchStart + tokensStart].toLowerCase()) {
              // nulla da fare
            } else if (stem(words[j]) == stem(t[pos + j - matchStart + tokensStart])) {
              nStem++;
            } else {
              ok = false;
            }
          } else {
            ok = false;
          }
        }
        if (ok) {
          // console.log('w='+w+' nTok='+(j-matchStart+tokensStart))
          result.push({ nTok: j - matchStart + tokensStart, prob: nStem > 0 ? 0.98 : 1, cmds: match[i].commands });
        }
      }
    }
    if (res.learnMode && (!match || result.length == 0) && !stopLearn(w)) {
      // console.log("ora tenta di imparare "+w+" per "+categoryName)
      result.push({ nTok: tokensStart + 1, prob: 0.93, cmds: ['LEARN', 'CAT:' + categoryName, 'WORD:' + w] });
      if (pos + tokensStart + 1 < t.length && !stopLearn(t[pos + tokensStart + 1]) && !articolo(t[pos + tokensStart + 1])) {
        result.push({ nTok: tokensStart + 2, prob: 0.92, cmds: ['LEARN', 'CAT:' + categoryName, 'WORD:' + w, 'WORD:' + t[pos + tokensStart + 1]] });
      }
      if (pos + tokensStart + 2 < t.length && !stopLearn(t[pos + tokensStart + 2]) && !articolo(t[pos + tokensStart + 2])) {
        result.push({ nTok: tokensStart + 3, prob: 0.91, cmds: ['LEARN', 'CAT:' + categoryName, 'WORD:' + w, 'WORD:' + t[pos + tokensStart + 1], 'WORD:' + t[pos + tokensStart + 2]] });
      }
      if (pos + tokensStart + 3 < t.length && !stopLearn(t[pos + tokensStart + 3]) && !articolo(t[pos + tokensStart + 3])) {
        result.push({ nTok: tokensStart + 4, prob: 0.90, cmds: ['LEARN', 'CAT:' + categoryName, 'WORD:' + w, 'WORD:' + t[pos + tokensStart + 1], 'WORD:' + t[pos + tokensStart + 2], 'WORD:' + t[pos + tokensStart + 3]] });
      }
    }
    // console.log('pos='+pos+' categoryName='+categoryName+' calc')
    if (!res.ctx._mem_category) {
      res.ctx._mem_category = [];
    }
    if (!res.ctx._mem_category[categoryName]) {
      res.ctx._mem_category[categoryName] = [];
    }
    res.ctx._mem_category[categoryName][pos] = result;
    return result;
  }

  // eslint-disable-next-line quote-props
  var _stopLearn = { con: 1, tutti: 1, e: 1, uguale: 1, 'più': 1, meno: 1, maggiore: 1, minore: 1, che: 1, a: 1, di: 1, come: 1, nel: 1, del: 1, vorrei: 1 };
  function stopLearn(w) {
    return _stopLearn[w] == 1;
  }

  class GrammarFunc extends GrammarElement {
    constructor() {
      super();
      this.func = null;
      this.rep = 1;
    }

    NLPParse(pos, prob, res, next) {
      res.nodeCnt++;
      var i, k, j, ocmdp;
      ocmdp = res.cmdp;
      for (k = 1; k <= this.rep; k++) {
        var o = {
          cmds: [], putCmd: function (c) {
            this.cmds.push(c);
          }, prob: 1, putProb: function (p) {
            this.prob = p;
          },
          ctx: res.ctx // passo anche il contesto per le funzioni dello stato del riconoscimento, le funzioni possono usarlo come area di memoria durante il pasing della frase
        };
        i = this.func(res.tokens, pos, o, k);
        res.ctx = o.ctx; // se la funzione cambia il contesto, questo viene riassegnato al contesto globale
        if (i <= 0 || prob * o.prob <= res.prob) {
          return;
        } // al primo che non consuma token si ferma
        for (j = 0; j < o.cmds.length; j++) {
          res.putCmd(o.cmds[j]);
        }
        next(pos + i, prob * o.prob, res);
        res.cmdp = ocmdp;
      }
    }
  }

  class GrammarCmd extends GrammarElement {
    constructor() {
      super();
      this.cmd = null;
      this.prob = null;
      this.subtxt = null;
    }

    NLPParse(pos, prob, res, next) {
      var txt, idx, el, ocmdp, ok;
      res.nodeCnt++;
      if (this.cmd == 'Prob') {
        prob = prob * this.prob;
        if (prob > res.prob) {
          next(pos, prob, res);
        }
      } else if (this.cmd == 'Once' || this.cmd == 'Decr') {
        txt = this.cmd + ':' + this.subtxt;
        idx = res.cmds.indexOf(txt);
        var pp = idx < 0 || res.cmpd <= idx || this.cmd == 'Once' ? 1 : 0.95;
        if (idx < 0 || res.cmpd <= idx || this.cmd == 'Decr') {
          ocmdp = res.cmdp;
          res.putCmd(txt);
          el = res.completeGrammar[this.subtxt];
          if (el == undefined) {
            throw '[speechGrammar] ' + this.subtxt + ': sub-grammar not found.';
          }
          el.NLPParse(pos, prob * pp, res, next);
          res.cmdp = ocmdp;
        }
      } else if (this.cmd == 'Before') {
        ok = false;
        for (idx = 0; idx < res.cmdp && !ok; idx++) {
          ok = res.cmds[idx] == this.subtxt;
        }
        next(pos, prob * (ok ? 0.95 : 1), res);
      } else if (this.cmd == 'After') {
        ok = false;
        for (idx = 0; idx < res.cmdp && !ok; idx++) {
          ok = res.cmds[idx] == this.subtxt;
        }
        next(pos, prob * (ok ? 1 : 0.95), res);
      } else if (this.cmd) {
        res.putCmd(this.cmd);
        next(pos, prob, res);
      }
    }
  }

  function GrammarCreator() {
    function MakeAlt(t, p, opt) {
      var a = new GrammarAlt();
      var closing_par = opt ? ']' : ')';
      a.opt = opt;
      p.v = p.v + 1;
      while (p.v < t.length && t[p.v] != closing_par) {
        a.alt.push(MakeSeq(t, p));
        if (t[p.v] == '|') {
          p.v = p.v + 1;
        }
      }
      p.v = p.v + 1; // serve a saltare la ] finale
      return a.alt.length == 1 && !opt ? a.alt[0] : a;
    }

    function MakeRep(t, p) {
      var r = new GrammarRep();
      p.v = p.v + 1;
      r.rep = MakeSeq(t, p);
      if (p >= t.length || t[p.v] != '}') {
        throw 'bag grammar, } expected';
      }
      p.v = p.v + 1;
      return r;
    }

    function MakeTok(t, p) {
      var r = new GrammarTok();
      r.tok = t[p.v].substr(1, t[p.v].length - 2);
      r.stemmed_tok = stem(r.tok);
      r.lowercase_tok = r.tok.toLowerCase();
      p.v = p.v + 1;
      return r;
    }

    function MakeSub(t, p) {
      var r = new GrammarSub();
      r.subtxt = t[p.v];
      p.v = p.v + 1;
      return r;
    }

    function MakeAdded(t, p) {
      var r = new GrammarAdded();
      r.category = t[p.v].substring(1);
      p.v = p.v + 1;
      return r;
    }

    function MakeCmd(t, p) {
      var c = new GrammarCmd();
      var cmd = t[p.v];
      cmd = cmd.substring(1, cmd.length - 1);
      if (cmd.substring(0, 5) == 'Prob:') {
        c.cmd = 'Prob';
        c.prob = parseFloat(cmd.substring(5));
      } else if (cmd.substring(0, 5) == 'Once:') {
        c.cmd = 'Once';
        c.subtxt = cmd.substring(5);
      } else if (cmd.substring(0, 5) == 'Decr:') {
        c.cmd = 'Decr';
        c.subtxt = cmd.substring(5);
      } else if (cmd.substring(0, 7) == 'Before:') {
        c.cmd = 'Before';
        c.subtxt = cmd.substring(7);
      } else if (cmd.substring(0, 6) == 'After:') {
        c.cmd = 'After';
        c.subtxt = cmd.substring(6);
      } else {
        c.cmd = cmd;
      }
      p.v = p.v + 1;
      return c;
    }

    function MakeFunc(n, f, repetitions) {
      var r = new GrammarFunc();
      r.func = f;
      if (repetitions) {
        r.rep = repetitions;
      }
      return r;
    }

    function MakeSeq(t, p) {
      var s = new GrammarSeq();
      while (p.v < t.length && t[p.v] != '|' && t[p.v] != ']' && t[p.v] != '}' && t[p.v] != ')') {
        if (t[p.v] == '(') {
          s.seq.push(MakeAlt(t, p, false));
        } else if (t[p.v] == '[') {
          s.seq.push(MakeAlt(t, p, true));
        } else if (t[p.v] == '{') {
          s.seq.push(MakeRep(t, p));
        } else if (t[p.v].substr(0, 1) == "'" || t[p.v].substr(0, 1) == '"') {
          s.seq.push(MakeTok(t, p));
        } else if (t[p.v].substr(0, 1) == '$') {
          s.seq.push(MakeCmd(t, p));
        } else if (t[p.v].substr(0, 1) == '#') {
          s.seq.push(MakeAdded(t, p));
        } else {
          s.seq.push(MakeSub(t, p));
        }
      }
      return s.seq.length == 1 ? s.seq[0] : s;
    }

    function MakeGrammar(s) {
      var t = Tokens(s, 1);
      var p = { v: 0 };
      var g = MakeSeq(t, p);
      if (p.v < t.length && t[p.v] == '|') {
        // è il caso del livello 0 con alternative senza aver messo una parentesi all'inizio
        var a = MakeAlt(t, p, false);
        a.alt.unshift(g);
        g = a;
      }
      return g;
    }

    function IncludeGrammar(main, sub, sub_name) {
      for (var n in sub) {
        if (n != 'main') {
          main[n] = sub[n];
        }
      }
      main[sub_name] = sub.main;
    }

    function Add(grammar, category, words, cmds) {
      if (!grammar.added) {
        grammar.added = {};
      }
      if (!grammar.added[category]) {
        grammar.added[category] = {};
      }
      var t = Tokens(words);
      var w = (articolo(t[0]) && t.length > 1 ? t[1] : t[0]).toLowerCase();
      if (!grammar.added[category][w]) {
        grammar.added[category][w] = [];
      }
      grammar.added[category][w].push({ tokens: t, commands: cmds });
      var sw = stem(w);
      if (!grammar.added[category][sw]) {
        grammar.added[category][sw] = [];
      }
      grammar.added[category][sw].push({ tokens: t, commands: cmds });
      //console.log(w+' ---> '+JSON.stringify(grammar.added[category][w]))
    }

    return { MakeGrammar: MakeGrammar, MakeFunc: MakeFunc, IncludeGrammar: IncludeGrammar, Add: Add };
  }

  function scaleProb(nodeCnt) {
    if (learnMode) {
      return nodeCnt > 1000000 ? 1000 : 1.0;
    } // per modalità LEARN???
    // return (nodeCnt>10000?(nodeCnt>30000?(nodeCnt>50000?(nodeCnt>150000?1000:1.1):1.05):1.01):1)
    // return (nodeCnt>10000?(nodeCnt>30000?(nodeCnt>50000?(nodeCnt>150000?1000:1.16):1.05):1.01):1) // resta poco aggressivo fino a 50000 nodi, poi diventa aggressivo
    return nodeCnt > 5000 ? nodeCnt > 20000 ? nodeCnt > 30000 ? nodeCnt > 150000 ? 1000 : 1.20 : 1.10 : 1.02 : 1.01; // abbastanza aggressivo
    // return (nodeCnt>5000?(nodeCnt>20000?(nodeCnt>50000?(nodeCnt>150000?1000:1.40):1.20):1.02):1) // molto aggressivo
    // return (nodeCnt>10000?(nodeCnt>20000?(nodeCnt>30000?(nodeCnt>150000?1000:1.50):1.25):1.085):1.025) // ultra aggressivo
  }

  function NLPParse(completeGrammar, s) {
    var t = Tokens(s);
    var r = {
      cmds: [],
      cmdp: 0,
      ok: false,
      parsed: [],
      learnMode: learnMode,
      prob: learnMode ? 0.5 : 0.8,
      realprob: learnMode ? 0.5 : 0.8,
      koprob: 0.0,
      completeGrammar: completeGrammar,
      tokens: t,
      maxtok: 0,
      endCnt: 0,
      nodeCnt: 0,
      putCmd: function (cmd) {
        var i = this.cmdp;
        if (i < this.cmds.length) {
          this.cmds[i] = cmd;
        } else {
          this.cmds.push(cmd);
        }
        this.cmdp = i + 1;
      },
      ctx: {}, // contesto che può essere utilizzato dalle funzioni per memorizzare informazioni durante il parsing
      parsedCnt: 0 // il contatore di nodi al momento dell'accetazone della stringa
    };
    completeGrammar.main.NLPParse(0, 1, r, function (pos, prob, res) {
      //        console.log(prob+' '+res.cmds)
      // il processo di parsing è terminato
      res.endCnt++;
      if (pos == res.tokens.length) {
        if (res.realprob < prob) {
          res.prob = prob; // (prob>0.95?1:prob)//prob+(prob>0.95?2.0:0);
          res.realprob = prob;
          res.ok = true;
          res.maxtok = pos;
          res.parsedCnt = res.nodeCnt;
          // copiare i comandi
          res.parsed = [];
          for (let i = 0; i < res.cmdp; i++) {
            res.parsed.push(res.cmds[i]);
          }
          // console.log('===> '+prob+' '+res.parsed+' '+res.nodeCnt)
        } // else
        // console.log('---> '+prob+' '+res.parsed+' '+res.nodeCnt)
      } else if (!res.ok && (res.maxtok < pos || res.koprob < prob)) {
        // console.log('xxx> '+prob+' '+res.parsed+' '+res.nodeCnt+' pos='+pos+' res.prob='+res.prob)
        res.maxtok = pos;
        res.koprob = prob;
        // copiare i comandi
        res.parsed = [];
        for (let i = 0; i < res.cmdp; i++) {
          res.parsed.push(res.cmds[i]);
        }
      }
      res.prob = res.realprob * scaleProb(res.nodeCnt);
    });
    return { ok: r.ok, prob: r.ok ? r.realprob : r.koprob, cmd: r.parsed, maxtok: r.maxtok, nodeCnt: r.nodeCnt, endCnt: r.endCnt, parsedCnt: r.parsedCnt };
  }

  function spezzone(s, e, t) {
    var r = '';
    for (let i = s; i < e; i++) {
      r = r + ' ' + t[i];
    }
    return r;
  }

  function NLPExtract(completeGrammar, s) {
    var t = Tokens(s),
      i, r;
    var extracted = [];
    for (i = 0; i < t.length; i++) {
      r = {
        cmds: [],
        cmdp: 0,
        ok: false,
        parsed: [],
        prob: 0.8,
        realprob: 0.8,
        koprob: 0.0,
        completeGrammar: completeGrammar,
        tokens: t,
        maxtok: 0,
        endCnt: 0,
        nodeCnt: 0,
        putCmd: function (cmd) {
          var i = this.cmdp;
          if (i < this.cmds.length) {
            this.cmds[i] = cmd;
          } else {
            this.cmds.push(cmd);
          }
          this.cmdp = i + 1;
        },
        startTok: i,
        ctx: {} // contesto che può essere utilizzato dalle funzioni per memorizzare informazioni durante il parsing
      };
      completeGrammar.main.NLPParse(i, 1, r, function (pos, prob, res) {
        // il processo di parsing è terminato
        res.endCnt++;
        // console.log('--> start:'+res.startTok+' end:'+pos+' prob:'+prob+' >> '+spezzone(res.startTok,pos,res.tokens)) //+' '+res.cmds+' res.realprob='+res.realprob)
        if (res.maxtok < pos || res.maxtok == pos && res.realprob < prob) {
          res.maxtok = pos;
          res.realprob = prob;
          // copiare i comandi
          res.parsed = [];
          for (var i = 0; i < res.cmdp; i++) {
            res.parsed.push(res.cmds[i]);
          }
          // console.log('===> start:'+res.startTok+' end:'+pos+' prob:'+prob+' '+res.parsed+' length='+res.parsed.length+' '+res.nodeCnt+' res.prob='+res.prob+' >> '+spezzone(res.startTok,pos,res.tokens))
        }
        res.prob = res.realprob * scaleProb(res.nodeCnt);
      });
      if (r.parsed.length > 0 || i < r.maxtok) {
        console.log('+++> start:' + i + ' end:' + (r.maxtok - 1) + ' prob:' + r.realprob + ' ' + r.parsed + ' >> ' + spezzone(i, r.maxtok, t));
        extracted.push({ startTok: i, cmd: r.parsed, endTok: r.maxtok - 1, prob: r.realprob });
        i = r.maxtok - 1;
      }
    }
    return extracted;
  }

  var learnMode = false;

  function setLearnMode(mode) {
    learnMode = mode;
  }

  // eslint-disable-next-line no-undef
  var stem = typeof PorterStemmerIt !== 'undefined' ? PorterStemmerIt.newStemmer('italian').stem : _minimal_stemmer;

  /* eslint-disable */
  // export { GrammarCreator: GrammarCreator, NLPParse: NLPParse, NLPExtract:NLPExtract, articolo: articolo, preposizioneArticolata: preposizioneArticolata, Tokens: Tokens, stem:stem, levenshteinDistance:levenshteinDistance, setLearnMode:setLearnMode } // versione per modulo ES6
  global.RailroadProbabilisticParser = { 
    GrammarCreator: GrammarCreator, 
    NLPParse: NLPParse, 
    NLPExtract: NLPExtract, 
    articolo: articolo, 
    preposizioneArticolata: preposizioneArticolata, 
    Tokens: Tokens, 
    stem: stem, 
    levenshteinDistance: levenshteinDistance, 
    setLearnMode: setLearnMode 
  };
})(this); // versione tradizionale ES5 per il browser
  /* eslint-enable */

