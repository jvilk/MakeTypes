import * as CodeMirror from 'codemirror';
import {Emitter, CbWriter} from 'maketypes';
require('codemirror/mode/javascript/javascript');

function createDiagnosticError(cm: CodeMirror.Editor, pos: {row: number, col: number} | number, msg: string): void {
  const errorDiv = document.createElement('div');
  // <a href="#" data-toggle="tooltip" title="Some tooltip text!">Hover over me</a>
  const glyphiconDiv = document.createElement('span');
  glyphiconDiv.classList.add('glyphicon', 'glyphicon-remove-sign');
  const tooltipAnchor = document.createElement('a');
  tooltipAnchor.setAttribute('data-toggle', 'tooltip');
  // Place over editor so it can be seen.
  tooltipAnchor.setAttribute('data-placement', 'top');
  tooltipAnchor.setAttribute('title', msg);
  tooltipAnchor.setAttribute('data-container', 'body');
  tooltipAnchor.appendChild(glyphiconDiv);
  errorDiv.appendChild(tooltipAnchor);
  let line: number;
  if (typeof(pos) === 'number') {
    line = cm.getDoc().posFromIndex(pos).line;
  } else {
    line = pos.row;
  }
  cm.setGutterMarker(line, "error-gutter", errorDiv);
  $(tooltipAnchor).tooltip();
}

function clearErrorGutter(cm: CodeMirror.Editor) {
  cm.clearGutter("error-gutter");
}

const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const nameInput = document.getElementById('type-name') as HTMLInputElement;

const jsonEditor = CodeMirror.fromTextArea(document.getElementById('json-examples') as HTMLTextAreaElement, {
  lineNumbers: true,
  mode: "application/json",
  readOnly: false,
  gutters: ['error-gutter'],
  viewportMargin: 20
});
jsonEditor.setSize("100%", 620);

const tsInterface = CodeMirror.fromTextArea(document.getElementById('ts-interfaces') as HTMLTextAreaElement, {
  lineNumbers: true,
  mode: "text/typescript",
  readOnly: 'nocursor',
  viewportMargin: 10
});

const tsProxy = CodeMirror.fromTextArea(document.getElementById('ts-proxies') as HTMLTextAreaElement, {
  lineNumbers: true,
  mode: "text/typescript",
  readOnly: 'nocursor',
  viewportMargin: 10
});

generateBtn.addEventListener('click', () => {
  clearErrorGutter(jsonEditor);
  tsInterface.setValue("");
  tsProxy.setValue("");
  const jsonTxt = jsonEditor.getDoc().getValue();
  let jsonObj: any;
  try {
    jsonObj = JSON.parse(jsonTxt);
  } catch (e) {
    const err = e as SyntaxError;
    // Invalid JSON. Given example '[1, 2, 3,\n 4,]', browsers display the following:
    // Chrome:
    // SyntaxError: Unexpected token ] in JSON at position 13
    // Firefox:
    // SyntaxError: JSON.parse: unexpected character at line 2 column 4 of the JSON data
    // Safari:
    // SyntaxError: JSON Parse error: Unexpected comma at the end of array expression
    // Error gutter.
    const msg = err.message;
    const posIdx = msg.indexOf('position');
    let pos: {row: number, col: number} | number;
    if (posIdx !== -1) {
      // Chrome.
      pos = parseInt(msg.slice(posIdx + 9), 10);
    } else {
      const lineIdx = msg.indexOf('line');
      if (lineIdx !== -1) {
        // Firefox
        const line = parseInt(msg.slice(lineIdx + 5), 10) - 1;
        const colIdx = msg.indexOf('column');
        const col = parseInt(msg.slice(colIdx + 7), 10) - 1;
        pos = { row: line, col: col };
      } else {
        // Safari or other.
        pos = 0;
      }
    }
    createDiagnosticError(jsonEditor, pos, msg);
    return;
  }
  let proxy = "";
  const proxyWriter = new CbWriter((s) => {
    proxy += s;
  }, () => {});
  let iface = "";
  const ifaceWriter = new CbWriter((s) => {
    iface += s;
  }, () => {});
  const emitter = new Emitter(ifaceWriter, proxyWriter);
  try {
    let typeName = nameInput.value.replace(/ /g, "");
    if (typeName.length === 0) {
      typeName = "Root";
    }
    emitter.emit(jsonObj, typeName);
  } catch (e) {
    createDiagnosticError(jsonEditor, 0, "" + e);
    return;
  }
  tsInterface.setValue(iface);
  tsProxy.setValue(proxy);
});

const weatherSample = `{
  "coord": {
    "lon": 14.42,
    "lat": 50.09
  },
  "weather": [
    {
      "id": 802,
      "main": "Clouds",
      "description": "scattered clouds",
      "icon": "03d"
    }
  ],
  "base": "cmc stations",
  "main": {
    "temp": 5,
    "pressure": 1010,
    "humidity": 100,
    "temp_min": 5,
    "temp_max": 5
  },
  "wind": { "speed": 1.5, "deg": 150 },
  "clouds": { "all": 32 },
  "dt": 1460700000,
  "sys": {
    "type": 1,
    "id": 5889,
    "message": 0.0033,
    "country": "CZ",
    "sunrise": 1460693287,
    "sunset": 1460743037
  },
  "id": 3067696,
  "name": "Prague",
  "cod": 200
}`;
jsonEditor.setValue(weatherSample);
nameInput.value = "Weather";
generateBtn.click();
