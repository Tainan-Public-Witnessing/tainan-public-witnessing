// CONFIG -----------------------------------------------------

const langDir = '../src/assets/i18n/'
const mainLang = 'zh';
const transLangs = ['en'];

// LOGIC -----------------------------------------------------
const fs = require('fs');
const path = require('path');

const mainFile = loadLanguageFile(mainLang);


for (const transLang of transLangs) {
  const transFile = loadLanguageFile(transLang);

  compareNode(mainFile, transFile)

  writeLanguageFile(transLang, transFile);
}

// FUNCTIONS -----------------------------------------------------
function loadLanguageFile(lang) {
  const filePath = path.resolve(langDir, lang + '.json');
  const file = fs.readFileSync(filePath);
  return JSON.parse(file);
}

function writeLanguageFile(lang, dictionary) {
  const content = JSON.stringify(dictionary, undefined, 2);
  const filePath = path.resolve(langDir, lang + '.json');

  fs.writeFileSync(filePath, content);
}


function compareNode(main, trans) {
  for (let key in main) {
    if (typeof (main[key]) !== typeof (trans[key])) {
      trans[key] = markTodo(main[key])
    } else if (typeof (main[key]) === 'object') {
      compareNode(main[key], trans[key]);
    }
  }
}

function markTodo(node) {
  if (typeof (node) === 'string') {
    return 'TODO:' + node;
  } else if (typeof (node) === 'object') {
    node = { ...node };
    for (let key in node) {
      node[key] = markTodo(node[key]);
    }
  }

  return node;
}
