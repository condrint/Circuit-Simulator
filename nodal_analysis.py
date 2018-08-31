import circuit
from numpy import *
from functools import reduce

#test
def analyzeNodes(graph, relations):
    """
    utilizes nodal analysis to find the voltages at each node
    returns a dictionary with key value pairs {node: voltage, ...}
    """
    #create an index of nodes, where the index serves as the subscript denoting different nodal voltages
    nodes = sorted(list(graph))

    #nodeVariables will contain each nodes respective sympy variable name
 
    print(graph)
    print(nodes)
    matrix = [[0 for _ in range(len(nodes) + 1)] for _ in range(len(nodes))]
    for matrixPosition, node in enumerate(nodes):
        newRow = [[] for _ in range(len(nodes))]
        #check if node is already connected to a powersupply, in that case it would be an integer
        if isinstance(graph[node], int):
                #set node value to voltage present at node from connected power supplies
                matrix[matrixPosition][matrixPosition] = 1
                matrix[matrixPosition][-1] = graph[node]
                continue
        for value in graph[node]: 
                neighboringNode, component = value[0], value[1]
                componentType = component.getType()
                if componentType == 'Resistor':
                    #modify both nodal voltages by 1/resistor
                    #"other" node gets negative sign assigned to it
                    coefficient = component.getNodalAnalysisBehavior();
                    posIndex = matrixPosition
                    negIndex = nodes.index(neighboringNode)
                    newRow[posIndex].append(coefficient)
                    newRow[negIndex].append(-1*coefficient)
        #combine coefficients
        simplifiedNewRow = [reduce((lambda x, y: x + y), coefs) for coefs in newRow]

        #add to matrix
        matrix[matrixPosition][0:len(matrix[matrixPosition])-1:1] = simplifiedNewRow

    #solve resulting matrix by seperating matrix in A, B where Ax=B and result will be x, our nodal voltages
    numpyMatrixA = asarray([row[0:len(row)-1:1] for row in matrix])
    numpyMatrixB = asarray([row[-1] for row in matrix])
    result = linalg.solve(numpyMatrixA, numpyMatrixB)
    nodalVoltages = list(zip(nodes, [float(x) for x in result]))
    print(nodalVoltages)
    return nodalVoltages