const path = require("path");
const BrowserGrammarLoader = require("./BrowserGrammarLoader");

class GrammarEngine {
  constructor({ fields, grammarDirectory = path.join(process.cwd(), "grammar") }) {
    this.fields = fields;
    this.context = new BrowserGrammarLoader(grammarDirectory).load();
    this.configureBusinessObjectGrammar();
  }

  parse(query) {
    const result = this.context.CustomSpeechTest.findResult(query);
    if (!result || !result.result || !result.result.ok) {
      return {
        ok: false,
        query,
        source: "grammar",
      };
    }

    const transformedCommand = this.context.GrammarParseFunctions.transformCmd(
      result.result.cmd,
    );

    return {
      ok: true,
      query,
      source: "grammar",
      grammarIndex: result.index,
      confidence: result.result.prob,
      command: transformedCommand,
      fields: this.extractFields(transformedCommand),
      rawCommand: result.result.cmd,
    };
  }

  configureBusinessObjectGrammar() {
    const termini = {
      campo: [],
      campo_V: [],
      campo_T: [],
      campo_ID: [],
    };

    this.fields.forEach((field) => {
      termini.campo.push(field.name);
      termini.campo_V.push(field.name);
      termini.campo_T.push(field.type);
      termini.campo_ID.push(field.id);
    });

    this.context.CustomSpeechTest.populateColsName(
      termini,
      this.context.BoGrammar.getMinorGrammar(),
    );
    this.context.CustomSpeechTest.populateColsName(
      termini,
      this.context.BoGrammar.getMainGrammar(),
    );

    this.context.CustomSpeechTest.addGrammarConfig({
      containerName: "main",
      modal: false,
      type: "bo",
      grammar: this.context.BoGrammar,
      termini,
    });
  }

  extractFields(command) {
    const compileCommands = command.compile || [
      {
        fld: command.fld || [],
        values: command.values || [],
      },
    ];

    return compileCommands.reduce((formFields, compileCommand) => {
      const fieldNames = compileCommand.fld || [];
      const values = compileCommand.values || [];

      fieldNames.forEach((fieldName, index) => {
        formFields[fieldName] = values[index] || values[0] || "";
      });

      return formFields;
    }, {});
  }
}

module.exports = GrammarEngine;
