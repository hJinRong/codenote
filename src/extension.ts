import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getDirPointTo } from './current_dir';
import { v4 as uuidv4 } from 'uuid';

export function activate(context: vscode.ExtensionContext) {
  let { root, conoco, ns } = getDirPointTo();
  vscode.workspace.onDidChangeWorkspaceFolders((e) => {
    const obj = getDirPointTo();
    root = obj.root;
    conoco = obj.conoco;
    ns = obj.ns;
  });

  let createCodenoteConfig = vscode.commands.registerCommand(
    'codenote.createCodenoteConfig',
    () => {
      if (typeof root !== 'undefined') {
        vscode.workspace.fs
          .createDirectory(vscode.Uri.file(conoco))
          .then(() => {
            vscode.workspace.fs.createDirectory(vscode.Uri.file(ns));
          });
      } else {
        vscode.window.showErrorMessage(
          'Failed to create the codenote configuration file.'
        );
      }
    }
  );

  let newNote = vscode.commands.registerCommand('codenote.newNote', () => {
    if (typeof currentEditor !== 'undefined') {
      const selection = currentEditor.selection;
      const anchor = selection.anchor;
      const end = selection.end;
      if (!selection.isEmpty) {
        currentEditor.setDecorations(getDecorationTypeFromConfig(), [
          new vscode.Range(anchor, end),
        ]);
      }
      const openedFileAbsPath = currentEditor.document.fileName;
      console.log(openedFileAbsPath);
      //remainingPath contain '\' at begin, eg: '\text.js', '\folder1\text.js', '\folder1\folder\text.js'.
      const remainingPath = openedFileAbsPath.slice(root?.length);
      const destination = ns.concat(remainingPath);
      console.log(destination);

      const record = `
-
  startLine: ${anchor.line}
  endLine: ${end.line}
  startCharacter: ${anchor.character}
  endCharacter: ${end.character}
  branch: ''
  id: ${uuidv4()}
  note: ''
      `;
      //concat result, eg: 'c:\abc\projRoot\.conoco\ns\deep\openedFilename.js.yaml', 'ns' is the folder that store the note histroy.
      const yamlFile = destination.concat('.yaml');
      fs.appendFile(yamlFile, record, 'utf8', (err) => {
        if (err) {
          vscode.workspace.fs
            .createDirectory(vscode.Uri.file(path.dirname(yamlFile)))
            .then(() => {
              fs.appendFile(yamlFile, record, 'utf8', () => {});
            });
        }
      });
    } else {
      vscode.window.showErrorMessage(
        "You can't new note when no active editor."
      );
    }
  });

  let currentEditor = vscode.window.activeTextEditor;
  vscode.window.onDidChangeActiveTextEditor(() => {
    currentEditor = vscode.window.activeTextEditor;
  });

  function getDecorationTypeFromConfig() {
    const config = vscode.workspace.getConfiguration('codenote');
    const backgroundColor: string = config.get('backgroundColor') ?? 'none';
    const color: string = config.get('color') ?? 'none';
    const borderStyle: string = config.get('borderStyle') ?? 'none none dotted';
    const decorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: backgroundColor,
      color: color,
      borderStyle: borderStyle,
      isWholeLine: false,
    });
    return decorationType;
  }

  context.subscriptions.push(createCodenoteConfig, newNote);
}

export function deactivate() {}
