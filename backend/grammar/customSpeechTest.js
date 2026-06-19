(function (global) {

    var grammarsConfig = new Array();

    var DEFAULT_GRAMMAR = {
        containerName: 'main',
        type: 'base',
        grammar: BaseGrammar
    };
    var MENU_GRAMMAR = {
        containerName: 'main',
        type: 'menu',
        grammar: MenuGrammar
    };
    
    
    addGrammarConfig(DEFAULT_GRAMMAR);
    addGrammarConfig(MENU_GRAMMAR);

    function getGrammars() { return grammarsConfig[0].grammar.getFullGrammar(); }

    function addGrammarConfig(grammarConfig) { return grammarsConfig.unshift(grammarConfig); }

    function removeGrammarConfig(grammarContainer) { grammarsConfig = grammarsConfig.filter(item => item.containerName !== grammarContainer); }

    function getHelp() { return grammarsConfig[0].grammar.HELP; }


    function scanGrammar(speechInput, gram, oldRes) {
        var found = false;
        if (gram.length == 0) {
            return undefined;
        }

        var newRes = RailroadProbabilisticParser.NLPParse(gram[0], speechInput);
        // tengo newsRes se oldRes non esiste oppure se newRes ? ok e oldRes non ? ok oppure se newRes ha una probabilit? maggiore di oldRes a parit? di stato
        var res = oldRes == undefined || newRes.ok && !oldRes.ok || newRes.ok == oldRes.ok && newRes.prob > oldRes.prob ? newRes : oldRes;

        for (var i = 1; !found && i < gram.length; i++) {
            newRes = RailroadProbabilisticParser.NLPParse(gram[i], speechInput);
            if (newRes.ok) {
                if (newRes.prob == 1) { // da sistemare errore con ordine grammatiche
                    found = true;
                    res = newRes;
                } else if (newRes.prob > res.prob) {
                    res = newRes;
                }
            }
        }

        return res;
    }


    function findResult(userQuery) {
        for (var i = 0; i < grammarsConfig.length; i++) {
            var minorResult = scanGrammar(userQuery, grammarsConfig[i].grammar.getMinorGrammar());
            if (minorResult == undefined || !minorResult.ok || minorResult.prob < 1) {
                // se non ho risultati o se non è un risultato valito o se non ho il 100% di prob, testo anche la grammatica principale
                var mainResult = scanGrammar(userQuery, grammarsConfig[i].grammar.getMainGrammar(), minorResult);
                if (mainResult != minorResult) {
                    // se la grammatica principale ha trovato un risultato valido tengo quello
                    minorResult = mainResult;
                    if (mainResult.cmd.indexOf('tabella') > -1) {
                        // filtri e ordinamenti vengono resettati solo in caso di risultati con soggetto (quindi tabella)
                        // frasi senza soggetto non alterano l'oggetto dei risultati
                        result = {};
                        result.setOrderBy = new Array();
                    }
                }
            }

            if (minorResult.ok) {
                return { index: i, foundGrammar: grammarsConfig[i], result: minorResult };
            }

            if (i == 0 && grammarsConfig[i].modal && grammarsConfig[i].containerName != options.main) {
                    // se è il primo layer che analizzo verifico se è detach
                    // in caso negativo non devo controllare gli altri leyer in quanto non modificabili dall'utente
                    var idSpModalLayer = document.querySelector('[name="' + grammarsConfig[i].containerName + '"]').id;
                    var detached = document.querySelector('[data-sp-modal-layer-object-ref-id=' + idSpModalLayer + ']').getAttribute('detached');
                    if (detached == null) {
                    break;
                }
            }
        }
        
        return false;
    }

    function populateColsName(terminiObj, grammarArray) {
        // gc.Add è un metodo statico
        for (var j = 0; j < grammarArray.length; j++) {
            for (i = 0; i < terminiObj.campo.length; i++) {
                var fld = terminiObj.campo[i] ? terminiObj.campo[i] : terminiObj.campo_V[i];
                gc.Add(grammarArray[j], 'campo', fld, ['FLD:' + terminiObj.campo_V[i], 'TYPE:' + terminiObj.campo_T[i]]);
            }
            if (terminiObj.soggetto) {
                for (var i = 0; i < terminiObj.soggetto.length; i++) {
                    var tbl = terminiObj.soggetto[i] ? terminiObj.soggetto[i] : terminiObj.soggetto_V[i];
                    gc.Add(grammarArray[j], 'soggetto', tbl, ['TBL:' + terminiObj.soggetto_V[i]]);
                }
            }
        }
        return grammarArray;
    }
    
    
    global.CustomSpeechTest = {
        populateColsName: populateColsName,
        scanGrammar: scanGrammar,
        findResult: findResult,
        addGrammarConfig: addGrammarConfig,
        removeGrammarConfig: removeGrammarConfig,
        getGrammars: getGrammars,
        getHelp: getHelp
    };

})(this);
