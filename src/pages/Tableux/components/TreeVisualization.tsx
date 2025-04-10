import React from "react";
import Tree from "react-d3-tree";

interface Node {
  rule?: any;
  id: number;
  formula: string;
  parent: number | null;
  children: Node[];
}

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

// Recursivamente converte o nó em um formato compatível com react-d3-tree
const transformNode = (node: Node): TreeNode => {
  return {
    name: `${node.formula} ${node.rule ? `(${node.rule})` : ""}`,
    children: node.children.map(transformNode),
  };
};

interface Props {
  rootNode: Node;
}

const TreeVisualization: React.FC<Props> = ({ rootNode }) => {
  const data = transformNode(rootNode);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Tree data={data} orientation="vertical" />
    </div>
  );
};

export default TreeVisualization;
