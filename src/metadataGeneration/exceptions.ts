import { Node } from 'typescript';

export class GenerateMetadataError extends Error {
  constructor(message?: string, node?: Node, onlyCurrent = false) {
    super(message);
    if (node) {
      this.message = `${message}\n${prettyLocationOfNode(node)}\n${prettyTroubleCause(node, onlyCurrent)}`;
    }
  }
}

export function prettyLocationOfNode(node: Node) {
  const sourceFile = node.getSourceFile();
  const token = node.getFirstToken() || node.parent.getFirstToken();
  const start = token ? `:${sourceFile.getLineAndCharacterOfPosition(token.getStart()).line + 1}` : '';
  const end = token ? `:${sourceFile.getLineAndCharacterOfPosition(token.getEnd()).line + 1}` : '';
  return `At: ${sourceFile.fileName}${start}${end}.`;
}

export function prettyTroubleCause(node: Node, onlyCurrent = false) {
  let name: string;
  if (onlyCurrent || !node.parent) {
    name = node.pos !== -1 ? node.getText() : (node as any).name.text;
  } else {
    name = node.parent.pos !== -1 ? node.parent.getText() : (node as any).parent.name.text;
  }
  return `This was caused by '${name}'`;
}
