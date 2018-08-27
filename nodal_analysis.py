import circuit
from numpy import *
from sympy import *

def analyzeNodes(graph, relations):
    """
    utilizes nodal analysis to find the voltages at each node
    returns a dictionary with key value pairs {node: voltage, ...}
    """
    #create an index of nodes, where the index serves as the subscript denoting different nodal voltages
    nodes = sorted(list(graph))

    #nodeVariables will contain each nodes respective sympy variable name
    nodeVariables = []
    for node in nodes:
        nodeID = node.getUniqueID()
        newVariable = symbols(str(nodeID))
        nodeVariables.append(newVariable)
    print(graph)

    rows = []
    for node in graph:
        row = []
        for value in graph[node]:
            neighboringNode, component = value[0], value[1]
            componentType = neighboringNode.getType()
            if componentType == 'Resistor':
                #modify both nodal voltages by 1/resistor
                #"other" node gets negative sign assigned to it
                coefficient = component

    return 0