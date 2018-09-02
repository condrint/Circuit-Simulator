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
    return nodalVoltages

def analyzeEdges(currents, edges, graph, voltages):
    indexesOfWiresWithNoCurrent = []
    for i, current in enumerate(currents):
        if current == 0 and edges[i].getType() == 'Wire':
            indexesOfWiresWithNoCurrent.append(i)

    currentMatrix = []
    posDirections = [edge.getFirstNode() for edge in edges]

    for index in indexesOfWiresWithNoCurrent:
        
        #if edge is a resistor/powersupply with zero current, skip, this is as it should be
        componentWithZeroCurrent = edges[index]
        if componentWithZeroCurrent.getType == 'Resistor' or componentWithZeroCurrent.getType == 'PowerSupply':
            continue
        
        #iterate through neighbors and collect more unknown currents or known currents to add to rowEqualTo
        node1, node2 = componentWithZeroCurrent.getFirstNode(), componentWithZeroCurrent.getSecondNode()
        nodes = [node1, node2]
        for node in nodes:
            newRow = [0 for _ in range(len(currents) + 1)]
            rowEqualTo = 0
            newRow[index] = 1 if posDirections[index] == node else -1

            #if we find that we're connected to a powersupply, disregard this row because powersupplies will supply any level of current
            for neighbor in graph[node]:
                neighborNode, neighborComponent = neighbor[0], neighbor[1]

                #dont add the edge were trying to calculate for
                if neighborComponent.getType() == 'PowerSupply':
                    newRow = [0 for _ in range(len(currents) + 1)]
                    break
                #assign direction
                indexOfEdge = edges.index(neighborComponent)
                
                negative = 1 if posDirections[indexOfEdge] == node else -1

                indexOfNeighborComponent = edges.index(neighborComponent)
                if indexOfNeighborComponent in indexesOfWiresWithNoCurrent:
                    #unknown current, switch it to -1 in new row
                    newRow[indexOfNeighborComponent] = negative
                else:
                    rowEqualTo += currents[indexOfNeighborComponent] * negative


            newRow[-1] = rowEqualTo * -1
            currentMatrix.append(newRow)

            """ really helpful for debugging keep for now
            print(node)
            debugS = ''
            for c in edges:
                debugS += c.getType()[0] + str(c.getFirstNode().id) + str(c.getSecondNode().id) + ' '
            print(debugS)
            debugS1 = ''
            for c in newRow:
                debugS1 += str(c) + '   '
            print(debugS1)
            print('')
            """
    
    numpyMatrixA = asarray([row[0:len(row)-1:1] for row in currentMatrix])
    numpyMatrixB = asarray([row[-1] for row in currentMatrix])
    result = linalg.lstsq(numpyMatrixA, numpyMatrixB, rcond=None)
    newCurrents = result[0]
    currents = list(currents) #dereferrence or something
    
    for index in indexesOfWiresWithNoCurrent:
        if newCurrents[index] > 0.0000000000001: #arbitrary cutoff point
            currents[index] = newCurrents[index]
    
    return currents
                        






    
    