import React from "react";
import PropTypes from "prop-types";
import Stage from "./components/Stage/Stage";
import Node from "./components/Node/Node";
import Connections from './components/Connections/Connections'
import Connection from "./components/Connection/Connection";
import {
  NodeTypesContext,
  InputTypesContext,
  NodeDispatchContext,
  ConnectionRecalculateContext
} from "./context";
import { createConnections } from "./connectionCalculator";
import nodesReducer from "./nodesReducer";

import styles from "./styles.css";

const NodeEditor = ({ nodes: initialNodes, nodeTypes, inputTypes }) => {
  const [nodes, dispatchNodes] = React.useReducer(nodesReducer, initialNodes);
  const stage = React.useRef();
  const [shouldRecalculateConnections, setShouldRecalculateConnections] = React.useState(true)

  const recalculateConnections = React.useCallback(() => {
    createConnections(nodes)
  }, [nodes]);

  React.useLayoutEffect(() => {
    if(shouldRecalculateConnections){
      recalculateConnections()
      setShouldRecalculateConnections(false)
    }
  }, [shouldRecalculateConnections, recalculateConnections])

  return (
    <InputTypesContext.Provider value={inputTypes}>
      <NodeTypesContext.Provider value={nodeTypes}>
        <NodeDispatchContext.Provider value={dispatchNodes}>
          <ConnectionRecalculateContext.Provider value={setShouldRecalculateConnections}>
            <Stage stageRef={stage}>
              {Object.values(nodes).map(node => (
                <Node
                  stageRef={stage}
                  onDragEnd={recalculateConnections}
                  {...node}
                  key={node.id}
                />
              ))}
              <Connections nodes={nodes} />
              <div
                className={styles.dragWrapper}
                id="__node_editor_drag_connection__"
              ></div>
            </Stage>
          </ConnectionRecalculateContext.Provider>
        </NodeDispatchContext.Provider>
      </NodeTypesContext.Provider>
    </InputTypesContext.Provider>
  );
};

export default NodeEditor;
