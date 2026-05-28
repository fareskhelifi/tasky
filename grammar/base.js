/* global RailroadProbabilisticParser GrammarParseFunctions */
var gc = RailroadProbabilisticParser.GrammarCreator();

(function (global) {
  var grammars = {
    help: "('help' | 'aiuto' | ['che'] 'cosa' 'posso' ('fare' | 'vedere') ['?'] | 'mi' 'aiuti' | 'aiutami') $HELP$ ",
    cortesia: "'per' ('favore'|'cortesia'|'piacere'|'gentilezza')| 'gentilmente' | 'cortesemente' | 'ti' 'garba' | 'ti' 'dispiace' | 'uffa' | 'veloce' | 'velocemente' ",
    saluti: "('salve'| 'buongiorno'|'ciao'|'Ehi'|'computer'|'Zucchetti')",

    cmd_potere: "[PRE_RIFL] [[FARE] | ('puoi'|'potresti') [PRE_FARE]] CMD",
    cmd_volere: "('voglio'|'vorrei'|'desidero'|'desidererei') ['che' [PRE_RIFL][FARE]] CMD",
    cmd_chiedere: "( ['ti'] ('chiedo'|'chiederei')|('ho'|'avrei') 'bisogno') 'di' [PRE_FARE] CMD",
    cmd_PRE_RIFL: " 'mi' | 'ci' | ('me'|'ce') ('lo'|'la'|'li'|'le')",
    cmd_PRE_FARE: "'far' |'farmi' | 'farci' |'farmelo' | 'farmela' | 'farmeli' | 'farmele' | 'farcelo' |'farcela' | 'farceli' | 'farcele'",
    cmd_FARE: "('fai'|'faresti'|'fammi'|'facci'|'facessi')",

    posizioneTempo: "'primo' $FIRST$ | 'secondo' $SECOND$ | 'terzo' $THIRD$ | 'quarto' $FOURTH$ | 'ultimo' $LAST$ ",
    intervallo: "('dalle' $OP:>$ | ('tra' $OP:btw$ | 'fra' $OP:btw$ | 'dopo' $OP:>$) 'le'  | ('prima' $OP:<$| 'dopo' $OP:>$)('delle' | 'di') | 'da') $StartDate$ timeValue $EndDate$ [('alle' | 'e' 'le' | 'a') $StartDate$ timeValue $EndDate$ ]"
  };

  var fullGrammars = {
    help: {
      main: gc.MakeGrammar(grammars.help)
    },
    saluti: {
      saluti: gc.MakeGrammar(grammars.saluti)
    },
    cortesia: {
      cortesia: gc.MakeGrammar(grammars.cortesia)
    },
    verbo: {
      verbo: gc.MakeGrammar('(cmd_potere|cmd_volere|cmd_chiedere)'),
      cmd_potere: gc.MakeGrammar(grammars.cmd_potere),
      cmd_volere: gc.MakeGrammar(grammars.cmd_volere),
      cmd_chiedere: gc.MakeGrammar(grammars.cmd_chiedere),
      PRE_FARE: gc.MakeGrammar(grammars.cmd_PRE_FARE),
      PRE_RIFL: gc.MakeGrammar(grammars.cmd_PRE_RIFL),
      FARE: gc.MakeGrammar(grammars.cmd_FARE)
    },
    intervallo: {
      intervallo: gc.MakeGrammar(grammars.intervallo)
    },
    posizioneTempo: {
      posizioneTempo: gc.MakeGrammar(grammars.posizioneTempo)
    },
    timeValue: {
      timeValue: gc.MakeGrammar("( oreDelGiorno [['del'|'di'] giorni ] | giorni ['a'|'alle'] [oreDelGiorno] | annoEsatto | meseEsatto| mesiAnno ['di'] annoEsatto| settimanaEsatta| quantitaPeriodo )"),
      giorni: gc.MakeGrammar('(giorniMeseAnno|giorniMeseNoAnno|giorniNoMeseAnno'), // qualunque tipo di giorno
      settimanaEsatta: gc.MakeGrammar("(['di'] parseNum  $SpWEEK-$ 'settimane' 'fa' | ('tra'|'fra') parseNum $SpWEEK+$  'settimane'| 'la' 'settimana' tempoRelativo $SpWEEK$ | 'la' tempoRelativo 'settimana' $SpWEEK$ | 'la' posizioneTempo 'settimana' $WEEK$ (['del'|'di'] meseEsatto ['del'|'di'] [annoEsatto] | 'del' 'mese' $OfMONTH$| 'dell' 'anno' $OfYEAR$)  )"),
      meseEsatto: gc.MakeGrammar("(mesiAnno| ['di'] parseNum $SpMONTH-$ 'mesi' 'fa' | ('tra'|'fra') parseNum $SpMONTH+$ 'mesi'| 'il' 'mese' tempoRelativo $SpMONTH$ | 'il' tempoRelativo 'mese' $SpMONTH$ | 'il' posizioneTempo 'mese' $SpMONTH$ ('dell' 'anno' $OfYEAR$ |['dell' 'anno'] ['del'|'di'] annoEsatto) )"),
      annoEsatto: gc.MakeGrammar("(parseYear| ['di'] parseNum $SpYEAR-$ 'anni' 'fa' | ('tra'|'fra') parseNum $SpYEAR+$ 'anni' | 'lo' 'anno' tempoRelativo $SpYEAR$ | 'il' tempoRelativo 'anno' $SpYEAR$)"),
      giorniMeseAnno: gc.MakeGrammar("( ['il'|'lo'|'di'] giorniMeseNoAnno (annoEsatto|tempoRelativo) | giorniNoMeseAnno  (meseRelativo|settimanaRelativa|tempoRelativo) | ['del'|'lo'|'il'] tempoRelativo (giorniNoMeseAnno|giorniMeseNoAnno) | dataEsatta | giorniSpecifici|porzioneDiOggi)"),

      quantitaPeriodo: gc.MakeGrammar("(parseNum ('ore' $HOURS$ | 'giorni' $DAYS$ | 'settimane' $WEEKS$ | 'mesi' $MONTHS$ | 'anni' $YEARS$))"),
      giorniMeseNoAnno: gc.MakeGrammar("( [giorniSettimana] parseDay ['del' 'mese'] ['di'] mesiAnno | namedDays )"),
      giorniNoMeseAnno: gc.MakeGrammar(" ['il'] (posizioneTempo giorniSettimana | giorniSettimana [parseDay] |parseDay|posizioneTempo) ['del' 'mese' $Prob:0.98$]"),
      dataEsatta: gc.MakeGrammar('( [giorniSettimana] parseDate | (namedDays|giorniMeseNoAnno) (parseYear|annoRelativo))'),
      settimanaRelativa: gc.MakeGrammar(" 'della' (tempoRelativo 'settimana' | 'settimana' tempoRelativo) $SpWEEK$ "),
      meseRelativo: gc.MakeGrammar("('del'|'dello'|'di') (tempoRelativo 'mese' | 'mese' tempoRelativo ) $SpMONTH$ "),
      annoRelativo: gc.MakeGrammar("('del'|'dello'|'di') (tempoRelativo 'anno' | 'anno' tempoRelativo) $SpYEAR$ "),
      oreDelGiorno: gc.MakeGrammar('$StartHour$ ( oraEsatta  [porzioneGiornata]  |  porzioneGiornata [oraEsatta] ) $EndHour$'),
      oraEsatta: gc.MakeGrammar("(['le'] ['ore'] ora [minutiDiOraDopo] |  minutiDiOraPrima ['ore'] ora)  "),
      minutiDiOra: gc.MakeGrammar("( 'un' 'quarto' $MINUTE:15$ |'mezza' $MINUTE:30$ |'tre' 'quarti' $MINUTE:45$ |parseMinute ['minuti'])"),
      minutiDiOraDopo: gc.MakeGrammar("(('meno' $SpHOUR:-$ |'e' $SpHOUR:+$) minutiDiOra | 'in' 'punto' $MINUTE:0$)"),
      minutiDiOraPrima: gc.MakeGrammar("minutiDiOra ('alle'|'a') $SpHOUR:-$"),

      posizioneTempo: gc.MakeGrammar(grammars.posizioneTempo),
      porzioneDiOggi: gc.MakeGrammar(" ['di'] (('stamattina'|'questa' 'mattina') $PoD:mat$ |('stasera'|'questa' 'sera') $PoD:ser$|('stanotte'|'questa' 'notte') $PoD:not$ | 'questo' 'pomeriggio' $PoD:pom$ ) $SpDAY:0$ "),
      porzioneGiornata: gc.MakeGrammar("(['di'|'della'] ('mattina' $PoD:mat$ |'sera' $PoD:ser$ |'notte' $PoD:not$) | ['di'|'del'] ('mattino' $PoD:mat$|'pomeriggio' $PoD:pom$))"),
      giorniSettimana: gc.MakeGrammar("'lunedì' $DOW:lun$ | 'martedì' $DOW:mar$ | 'mercoledì' $DOW:mer$ | 'giovedì' $DOW:gio$ | 'venerdì' $DOW:ven$ | 'sabato' $DOW:sab$ | 'domenica' $DOW:dom$"),
      mesiAnno: gc.MakeGrammar("('gennaio' $MONTH:1$| 'febbraio' $MONTH:2$| 'marzo' $MONTH:3$| 'aprile' $MONTH:4$| 'maggio' $MONTH:5$| 'giugno' $MONTH:6$| 'luglio' $MONTH:7$| 'agosto' $MONTH:8$ | 'settembre' $MONTH:9$| 'ottobre' $MONTH:10$| 'novembre' $MONTH:11$| 'dicembre' $MONTH:12$)"),
      giorniSpecifici: gc.MakeGrammar("'ieri' $SpDAY:-1$ | 'oggi' $SpDAY:+0$ | 'domani' $SpDAY:+1$ | 'dopodomani' $SpDAY:+2$ | ('altroieri' | 'ieri' 'lo' 'altro'| 'lo' 'altro' ('ieri' | 'giorno') ) $SpDAY:-2$ | ('tra'|'fra') parseNum $SpDAY+$ 'giorni' | ['di']  parseNum $SpDAY-$ 'giorni' 'fa' "),
      ora: gc.MakeGrammar("'mezzogiorno' $HOUR:12$ |'mezzanotte' $HOUR:24$ |parseHour "),
      namedDays: gc.MakeGrammar(" ('Capodanno' $DAYMONTH:01/01$ | 'Natale' $DAYMONTH:25/12$  | 'Pasqua' $EASTER$ | 'Ferragosto' $DAYMONTH:15/08$ )"),
      tempoRelativo: gc.MakeGrammar("(('scorso'|'passato'|'precedente') $PREVTIME$ | ('corrente'|'attuale'|'questo') $CURRTIME$ | ('prossimo'|'successivo') $NEXTTIME$)"),
      parseMinute: gc.MakeFunc('parseMinute', GrammarParseFunctions.parseMinute),
      parseHour: gc.MakeFunc('parseHour', GrammarParseFunctions.parseHour),
      giorniMese: gc.MakeGrammar("'primo' | 'secondo' | 'ultimo' | parseDay"),
      parseDay: gc.MakeFunc('parseDay', GrammarParseFunctions.parseDay),
      parseDate: gc.MakeFunc('parseDate', GrammarParseFunctions.parseDate),
      parseYear: gc.MakeFunc('parseYear', GrammarParseFunctions.parseYear)
    },
    valore: {
      valore: gc.MakeGrammar('(parseNum $TYPE:N$ | $StartDate$ timeValue $EndDate$ $TYPE:D$ | parseStr $TYPE:C$ )'),
      parseStr: gc.MakeFunc('parseStr', GrammarParseFunctions.parseMultiStr, 4),
      parseNum: gc.MakeFunc('parseNum', GrammarParseFunctions.parseNum)
    }
  };

  function getGrammar(g) {
    if (fullGrammars[g] == undefined) {
      throw '[speechGrammar] ' + g + ': grammar not found.';
    }
    return fullGrammars[g];
  }


  var mic = {
    main: gc.MakeGrammar("[cortesia] ('interrompi' | 'stop' | 'ferma' | 'spegni' | 'silenzia') [['il'] 'microfono'] $stopmic$ )"),
    cortesia: gc.MakeGrammar(grammars.cortesia)
  };

  var learn = {
    main: gc.MakeGrammar("[cortesia] ((( ['vai' ['in']] 'modalità' ('teach' | 'learn' | 'apprendimento') ) | ('insegna' | 'impara' | 'aggiungi' | 'inserisci') ['la' ('parola' | 'frase') | 'il' ('termine' | 'vocabolo')] ) $learn$)"),
    cortesia: gc.MakeGrammar(grammars.cortesia)
  };

  var save = {
    main: gc.MakeGrammar("[cortesia] ('salva' | 'ricorda' | 'memorizza' | 'aggiungi') ('posizione' | 'pagina' | 'url' | 'sezione' | 'programma' | 'schermata' | 'procedura' | 'videata') ['ai' 'preferiti'] $action:savepos$"),
    cortesia: gc.MakeGrammar(grammars.cortesia)
  };

  var select_row = {
    main: gc.MakeGrammar("(  ( 'seleziona' | 'scegli') $action:selectpopupresult$ [['risultato' | 'voce'] parseNum | ['il'] posizione 'risultato'])"),
    posizione: gc.MakeGrammar("( 'primo' $values:1$ | 'secondo' $values:2$ | 'terzo' $values:3$ | 'quarto' $values:4$ | 'quinto' $values:5$)"),
    parseNum: gc.MakeFunc('parseNum', GrammarParseFunctions.parseNum)
  };

  var external_help = {
    main: gc.MakeGrammar("[cortesia] (('come' 'faccio' 'a')| ((((['mi'] ( ('aiuti' | 'aiuteresti'|'aiutami') 'a' ['capire'] | 'dici' | 'diresti' |'mostrami' | ('fai' | 'faresti'|'fammi') 'vedere'))| (['ti'] 'posso' 'chiedere') | (('posso' | 'potrei') ('chiederti' | 'vedere'))) ['come' (['posso'] | 'si' 'fa')] | ( ('dove' | 'dov') ['è'] ['si' 'trova' | 'trovo'] 'la' )) ) ) parseStrHelp $action:mainhelp$"),
    cortesia: gc.MakeGrammar(grammars.cortesia),
    parseStrHelp: gc.MakeFunc('parseStrHelp', GrammarParseFunctions.parseMultiStr, 6)
  };

  function getMainGrammar() {
    return [learn, mic, save, select_row, external_help];
  }

  function getMinorGrammar() {
    return [];
  }

  global.BaseGrammar = {
    getMinorGrammar: getMinorGrammar,
    getMainGrammar: getMainGrammar,
    getGrammar: getGrammar
  };
})(this);
