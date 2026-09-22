import type { LookupNode } from "./types";

export function findLookupNodeById(
  nodes: LookupNode[],
  id: string,
): LookupNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const result = findLookupNodeById(node.children, id);
      if (result) return result;
    }
  }
  return undefined;
}

export function resolveLookupLabel(nodes: LookupNode[], id: string) {
  return findLookupNodeById(nodes, id)?.name ?? "Not specified";
}
