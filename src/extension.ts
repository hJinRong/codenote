import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  let createCodenoteConfig = vscode.commands.registerCommand(
    'codenote.createCodenoteConfig',
    () => {
      const folders = vscode.workspace.workspaceFolders;
      const root = folders?.[0].uri.fsPath;
      const folder = `${root}\\.conoco`;
      if (typeof root !== 'undefined') {
        vscode.workspace.fs
          .createDirectory(vscode.Uri.file(folder))
          .then(() => {
            fs.writeFile(`${folder}\\history.yaml`, '', 'utf8', (err) => {
              if (err) {
                vscode.window.showErrorMessage(
                  err + '\nIt seem that can not create the history configuration file.'
                );
              }
            });
          });
      } else {
        vscode.window.showErrorMessage(
          'Failed to create the codenote configuration file.'
        );
      }
    }
  );

  context.subscriptions.push(createCodenoteConfig);
}

export function deactivate() {}
