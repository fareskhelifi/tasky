const fs = require("fs");
const path = require("path");
const vm = require("vm");

class BrowserGrammarLoader {
  constructor(grammarDirectory) {
    this.grammarDirectory = grammarDirectory;
  }

  load() {
    const context = {
      console,
      setTimeout,
      clearTimeout,
    };

    context.global = context;
    context.window = context;
    context.self = context;

    vm.createContext(context);

    [
      "railroadgrammar.es5.js",
      "parse_functions.js",
      "base.js",
      "menu.js",
      "bo.js",
      "customSpeechTest.js",
    ].forEach((fileName) => this.runScript(context, fileName));

    return context;
  }

  runScript(context, fileName) {
    const filePath = path.join(this.grammarDirectory, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    vm.runInContext(source, context, { filename: filePath });
  }
}

module.exports = BrowserGrammarLoader;
