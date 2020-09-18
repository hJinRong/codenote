import * as vscode from 'vscode';

export function getDirPointTo() {
  const folders = vscode.workspace.workspaceFolders;
  //'c:\abc\projRoot
  let root = folders?.[0].uri.fsPath;
  //'c:\abc\projRoot\.conoco
  let conoco = `${root}\\.conoco`;
  //'c:\abc\projRoot\.conoco\ns
  let ns = `${conoco}\\ns`;
  console.log(root,conoco,ns);
  return {
    root: folders?.[0].uri.fsPath,
    conoco: conoco,
    ns: ns
  };
}