from circuit import *
from nodal_analysis import *

def simulate(edges, nodeCount):
    circuit = Circuit()
    nodes = [Node(i) for i in range(nodeCount)]
    edgesToAdd = []
    for edge in edges:
        #string manipulation to read in data from react
        type_node0, node1_value = edge.split('and')
        typeOfEdge, node0 = type_node0[0], int(type_node0[1::])
        node1, value = node1_value.split('v')
        node1 = int(node1)

        #probably okay to remove but keep just incase
        #typeOfEdge, node0, node1, value = edge[0], int(edge[1]), int(edge[2]), edge[3::]

        if value:
            value = int(value)
        if typeOfEdge == 'R':
            edgesToAdd.append(Resistor(value, nodes[node0], nodes[node1]))
        elif typeOfEdge == 'W':
            edgesToAdd.append(Wire(nodes[node0], nodes[node1]))
        elif typeOfEdge == 'P':
            edgesToAdd.append(PowerSupply(value, nodes[node0], nodes[node1]))
    
    for edge in edgesToAdd:
        circuit.addEdge(edge)

    try:
        voltage, current = circuit.nodalAnalysis()
        circuit = '' #dereference object
        #convert everything to strings and numbers for internet transport
        voltage = {str(node.getID()): str(voltage[node]) for node in voltage.keys()}
        current = {str(component.getFirstNode().getID()) + 'and' + str(component.getSecondNode().getID()): str(current[component]) for component in current.keys()}

        return {**voltage, **current}
    except:
        print('error simulating circuit below')
        print(circuit)
        return {}

        
        