class Node():
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def NodeID(self):
        return id(self)

class Component():
    """
    parent component class
    type is a string denoting
    the subclass type
    """
    def __init__(self, type, node1, node2):
        self.type = type
        self.node1 = node1
        self.node2 = node2

    def getFirstNode(self):
        return self.node1
    
    def getSecondNode(self):
        return self.node2

    def getType(self):
        return self.type

class Wire(Component):
    def __init__(self, node1, node2):
        Component.__init__(self, 'Wire', node1, node2)
    
    def __repr__(self):
        print('Wire' + id(self))
    
class Resistor(Component):
    def __init__(self, resistance, node1, node2):
        Component.__init__(self, 'Resistor', node1, node2)
        self.resistance = resistance
    
    def __repr__(self):
        print('Resistor{0} with value {1} ohms'.format(str(id(self)), self.getResistance()))

    def getResistance(self):
        return self.resistance

class PowerSupply(Component):
    def __init__(self, volts, node1, node2):
        Component.__init__(self, 'PowerSupply', node1, node2)
        self.volts = volts
    
    def __repr__(self):
        print('Powersupply{0} with value {1} volts'.format(id(self), self.getVoltage()))
    
    def getVoltage(self):
        return self.volts

class Circuit():
    """
    stores edges of wires/components
    """
    def __init__(self, savedGraph=[]):
        """
        edges is a list of wires/components between
        that is formatted as follows [edge 0, edge 1, ... edge n-1]
        where each edge is a component
        """
        #self.rawGraph = True if savedGraph else False
        self.edges = savedGraph
    
    def __repr__(self):
        return self.compileEdges()

    def addEdge(self, *args):
        for component in args:
            if not issubclass(type(component), Component):
                print('Component {0} is not an instance of component'.format(component))
                return
            self.edges.append(component)
            print('Added edge {0}'.format(len(self.edges) - 1))
        return True

    def removeEdge(self, edgeNumber):
        try:
            del self.edges[edgeNumber]
            print('Deleted edge {0}'.format(edgeNumber))
            return True
        except IndexError:
            print('Edge does not exist')
            return False

    def compileEdges(self):
        nodes = {}
        for edge in self.edges:
            node = edge.getFirstNode()
            if node and node in nodes:
                nodes[node].append([edge.getSecondNode(), edge.getType()])
            else:
                nodes[node] = [[edge.getSecondNode(), edge.getType()]]

        return nodes

    def getVoltages(self):
        pass
    
    def getCurrents(self):
        pass


node0 = Node(0,0)
node1 = Node(0,0)
node2 = Node(0,0)
node3 = Node(0,0)
node4 = Node(0,0)
node5 = Node(0,0)
edge0 = PowerSupply(5, node5, node0)
edge1 = Wire(node0, node1)
edge2 = Wire(node1, node2)
edge3 = Resistor(10000, node1, node4)
edge4 = Resistor(20000, node2, node3)
edge5 = Wire(node3, node4)
edge6 = Wire(node4, node5)

testCircuit = Circuit()
testCircuit.addEdge(edge0, edge1, edge2, edge3, edge4, edge5)