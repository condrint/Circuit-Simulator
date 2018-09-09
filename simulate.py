from circuit import *
from nodal_analysis import *

def simulate(edges, nodeCount):
    circuit = Circuit()
    nodes = [Node(i) for i in range(nodeCount)]
    edgesToAdd = []

    for edge in edges:
        typeOfEdge, node0, node1, value = edge[0], edge[1], edge[2], edge[3::]
        if typeOfEdge == 'R':
            edgesToAdd.append(Resistor(value, nodes[node0], nodes[node1]))
        elif typeOfEdge == 'W':
            edgesToAdd.append(Wire(nodes[node0], nodes[node1]))
        elif typeOfEdge == 'P':
            edgesToAdd.append(PowerSupply(value, nodes[node0], nodes[node1]))
    
    for edge in edgesToAdd:
        circuit.addEdge(edge)
    
    voltage, current = circuit.nodalAnalysis()
    circuit = '' #dereference object

    return {'voltages': voltage, 'currents': current}

        
        