import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let createCodenoteConfig = vscode.commands.registerCommand(
    'codenote.createCodenoteConfig',
    () => {
      const folders = vscode.workspace.workspaceFolders;
      const root = folders?.[0].uri.fsPath;
      if (typeof root !== 'undefined') {
        vscode.workspace.fs.createDirectory(
          vscode.Uri.file(`${root}\\.conoco`)
        );
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
