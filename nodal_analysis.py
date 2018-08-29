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
    print(nodes)
    matrix = [[0 for _ in range(len(nodeVariables) + 1)] for _ in range(len(nodeVariables))]
    for matrixPosition, node in enumerate(nodes):
        if isinstance(graph[node], int):
                #set node value to voltage present at node from connected power supplies
                matrix[matrixPosition][matrixPosition] = 1
                matrix[matrixPosition][-1] = graph[node]
                continue
        for value in graph[node]:  
                #start here
                neighboringNode, component = value[0], value[1]
                componentType = neighboringNode.getType()
                if componentType == 'Resistor':
                    #modify both nodal voltages by 1/resistor
                    #"other" node gets negative sign assigned to it
                    coefficient = component
    print(matrix)
    return 0