/* global BaseGrammar RailroadProbabilisticParser GrammarParseFunctions */
var gc = RailroadProbabilisticParser.GrammarCreator();

(function (global) {
  var boGrammar = {};
  var help_bo = 'Con l\'assistente Business Object puoi interagire in modo rapido con un liguaggio naturale con un BO eseguendo la compilazione del form, la navigazione fra i campi e il cambio di tab.<br>Alcuni esempi di comandi utilizzabili sono:<br><ul><li>vai al tab 2</li><li>spostati al tab successivo</li><li>nome Andrea cognome Rossi fatturato 1000</li><li>vai al cognome</li></ul>';
  var help = BaseGrammar.getGrammar('help');

  boGrammar.direzione = "( ('precedente' | 'seguente') $ACTION:prev$ | 'successivo' $ACTION:next$ )";
  boGrammar.box_actions = "( ('apri' | 'espandi') $ACTION:expand$ | ('chiudi' | 'riduci' | 'collassa') $ACTION:reduce$ ) ['il'] ('box' | 'sezione')";
  boGrammar.naviga = "($StartNavigation$ [('vai' | 'procedi' | 'naviga' | 'spostati') ('a' | 'al' | 'alla') [posizioneTempo] ] ( ( ( 'tab' | 'sezione' | 'pagina') [ direzione | parseNum | parseStr ] $NAVTYPE:tab$ | (['campo'] ( direzione | #campo ) $NAVTYPE:campo$ ) ) $EndNavigation$ )";
  boGrammar.campovalore = "$StartCompile$ ['e'] ( ['il' ['campo']] #campo ['con' 'il' ['valore'] | 'è'] valore | valore ['nel' | 'in'] #campo ) $EndCompile$";
  boGrammar.bo_verbo = "('compila' | 'compilami' | 'metti' | 'mettimi' | 'scrivi' | 'scrivimi' | 'riempi' | 'riempimi' | #verbo )";
  var bog = Object.assign({},
    BaseGrammar.getGrammar('verbo'),
    BaseGrammar.getGrammar('timeValue'),
    BaseGrammar.getGrammar('valore'),
    BaseGrammar.getGrammar('cortesia'),
    BaseGrammar.getGrammar('saluti')
  );
  bog.main = gc.MakeGrammar('[{saluti}][{($Decr:cortesia$ | $Decr:verbo$ | $Decr:naviga$ | $Decr:box_actions$ | campovalore)}]');
  bog.campovalore = gc.MakeGrammar(boGrammar.campovalore);
  bog.direzione = gc.MakeGrammar(boGrammar.direzione);
  bog.naviga = gc.MakeGrammar(boGrammar.naviga);
  bog.box_actions = gc.MakeGrammar(boGrammar.box_actions);
  bog.CMD = gc.MakeGrammar(boGrammar.bo_verbo);

  boGrammar.actions_md = "( (('vai' | 'procedi' | 'naviga' | 'spostati') $ACTTYPE:nav$ | ('elimina' | 'rimuovi' | 'togli' | 'cancella') $ACTTYPE:remove$ )  (['alla' | 'la' | 'a'] (posizioneTempo  'riga' | 'riga' ( parseNum | ['corrente'] $CURRENT$) )  ) )";
  boGrammar.add_md = "( ('aggiungi' | 'inserisci') $ACTTYPE:add$ ['una'] 'riga' )";
  var mdg = Object.assign({},
    BaseGrammar.getGrammar('posizioneTempo'),
    BaseGrammar.getGrammar('cortesia'),
    BaseGrammar.getGrammar('saluti')
  );
  mdg.main = gc.MakeGrammar(' $StartMD$ [{saluti}][{($Decr:cortesia$ | $Decr:actions$ | $Decr:add$ )}] $EndMD$ ');
  mdg.actions = gc.MakeGrammar(boGrammar.actions_md);
  mdg.add = gc.MakeGrammar(boGrammar.add_md);
  mdg.parseNum = gc.MakeFunc('parseNum', GrammarParseFunctions.parseNum);
  mdg.parseStr = gc.MakeFunc('parseStr', GrammarParseFunctions.parseMultiStr, 4);

  var onlyvalue = Object.assign({},
    BaseGrammar.getGrammar('timeValue'),
    BaseGrammar.getGrammar('valore')
  );
  onlyvalue.main = gc.MakeGrammar('$StartOnlyValue$ { ( $Decr:valore$ ) } $EndOnlyValue$');

  var linkzoom = {
    main: gc.MakeGrammar("(('apri' | 'aprimi' | 'mostra' | 'mostrami' | 'visualizza') ['lo'] ('zoom' | 'link' 'zoom' | 'linkzoom') $action:linkzoom$ [['per'] ['il' | 'la' | 'lo'] #campo])")
  };

  var actions = Object.assign({},
    BaseGrammar.getGrammar('verbo'),
    BaseGrammar.getGrammar('cortesia'),
    BaseGrammar.getGrammar('saluti')
  );
  actions.main = gc.MakeGrammar('[{saluti}][{($Decr:cortesia$ | $Decr:verbo$)}]');
  actions.CMD = gc.MakeGrammar('(close $action:close$ | save $action:save$ )');
  actions.save = gc.MakeGrammar("('salva' | 'salvare' | 'aggiungi' | 'aggiungere' | 'salva' 'e' 'chiudi' | 'salvare' 'e' 'chiudere')");
  actions.close = gc.MakeGrammar("('chiudi' | 'chiudere' | 'annulla' | 'annullare' | 'cancella' | 'cancellare' | 'esci' | 'uscire' | 'abbandona' | 'abbandonare')");

  function getFullGrammar() {
    return boGrammar;
  }

  function getMainGrammar() {
    return [bog];
  }

  function getMinorGrammar() {
    return [mdg, actions, linkzoom, help, onlyvalue];
  }

  global.BoGrammar = {
    getMinorGrammar: getMinorGrammar,
    getMainGrammar: getMainGrammar,
    getFullGrammar: getFullGrammar,
    HELP: help_bo
  };
})(this);
