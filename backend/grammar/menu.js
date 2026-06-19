/* global BaseGrammar RailroadProbabilisticParser GrammarParseFunctions */
var gc = RailroadProbabilisticParser.GrammarCreator();

(function (global) {
  var help_menu = 'Con l\'assistente puoi interagire in modo rapido con un liguaggio naturale con l\'applicativo eseguendo azioni di navigazione in varie sezioni.<br>Alcuni esempi di comandi utilizzabili sono:<br><ul><li>vai alle fatture</li><li>apri lo zoom dei clienti in un nuovo tab</li><li>crea un nuovo cliente</li><li>vai allo zoom dei clienti</li></ul>';
  var help = BaseGrammar.getGrammar('help');

  var menu = Object.assign({},
    BaseGrammar.getGrammar('cortesia'),
    BaseGrammar.getGrammar('valore'),
    BaseGrammar.getGrammar('timeValue'),
    BaseGrammar.getGrammar('saluti'),
    BaseGrammar.getGrammar('verbo')
  );
  menu.main = gc.MakeGrammar('$StartMenu$ [{saluti}] [{($Decr:cortesia$ | $Decr:verbo$ |  $Decr:position$ )}] $EndMenu$');
  menu.CMD = gc.MakeGrammar('(new_action | nav_action)');
  menu.position = gc.MakeGrammar("('in' | 'su') ('una' ['nuova'] 'finestra' | 'un' ['nuovo'] 'tab' | 'un' ['nuovo'] 'layer') $position:newtab$");
  menu.new_action = gc.MakeGrammar("(('crea' | 'creare' | 'aggiungi' | 'aggiungere' | 'inserisci' | 'inserire' | 'carica' | 'caricare' ) ['un'] ['nuovo']  | 'nuovo') parseStr $TYPE:C$ $action:new$");
  menu.nav_action = gc.MakeGrammar("((('vai' | 'andare' | 'portami' | 'portare' | 'procedi' | 'procedere' | 'naviga' | 'navigare' | 'spostati' | 'spostami' | 'spostare' | 'apri' | 'aprire' | 'aprirmi' | 'aprimi' | 'fammi' 'lavorare') ('a' | 'di' | 'con' | 'gli' | 'lo' | 'le' | 'su' | 'verso' | 'in') [(('zoom' | 'gestione' | 'maschera' | 'procedura' | 'videata' | 'programma') ('dei' | 'delle') ) | app_area]) | (app_area)) parseStr $TYPE:C$ $action:nav$");
  menu.app_area = gc.MakeGrammar("('area'|'zona') 'applicativa' ['di' | 'dei' | 'del' | 'della']");
  menu.parseStr = gc.MakeFunc('parseStr', GrammarParseFunctions.parseMultiStr, 4);

  function getMainGrammar() {
    return [menu];
  }

  function getMinorGrammar() {
    return [help];
  }

  global.MenuGrammar = {
    getMinorGrammar: getMinorGrammar,
    getMainGrammar: getMainGrammar,
    HELP: help_menu
  };
})(this);
