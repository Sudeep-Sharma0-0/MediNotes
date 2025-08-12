import CustomTableNodeViewComponent from "./nodeViews/NodeView.svelte";

export function CustomTableNodeView() {
  return ({ node, getPos, editor }) => {
    return {
      dom: document.createElement("div"),
      contentDOM: null,
      update(updatedNode) {
        if (updatedNode.type !== node.type) {
          return false;
        }
        // handle updates if needed
        return true;
      },
      destroy() {
        // cleanup
      },
      mount(container) {
        const component = new CustomTableNodeViewComponent({
          target: container,
          props: { node, getPos, editor },
        });
        return {
          destroy() {
            component.$destroy();
          },
        };
      },
    };
  };
}
