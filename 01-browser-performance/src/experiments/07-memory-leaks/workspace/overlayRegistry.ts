const workspaceLayerRegistry: HTMLElement[] = [];

export function registerWorkspaceLayer(node: HTMLElement) {
  workspaceLayerRegistry.push(node);
}
