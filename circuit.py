class Node():
    def __init__(self, x, y, idOfNode):
        self.x = x
        self.y = y
        self.id = idOfNode
        self._id = id(self)
    
    def __repr__(self):
        return 'Node' + str(self.id)

    def __hash__(self):
        return hash(self.getUniqueID())

    def __eq__(self, other):
        return self.getUniqueID == other.getUniqueID
    
    def __lt__(self, other):
        return self.id < other.id
    
    def __gt__(self, other):
        return self.id > other.id

    def getUniqueID(self):
        return self._id

    def getID(self):
        return self.id


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
        return 'Wire' + str(id(self))
    
class Resistor(Component):
    def __init__(self, resistance, node1, node2):
        Component.__init__(self, 'Resistor', node1, node2)
        self.resistance = resistance
    
    def __repr__(self):
        return 'Resistor{0} with value {1} ohms'.format(id(self), self.getResistance())

    def getResistance(self):
        return self.resistance

class PowerSupply(Component):
    def __init__(self, volts, positive, negative):
        Component.__init__(self, 'PowerSupply', positive, negative)
        self.volts = volts
    
    def __repr__(self):
        return 'Powersupply{0} with value {1} volts'.format(id(self), self.getVoltage())
        
    def getVoltage(self):
        return self.volts

    def getPolarity(self, node):
        return '+' if node is self.node1 else '-'

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
        compiledEdges = self._compileEdges()
        displayList = [(key, value) for key, value in compiledEdges.items()]
        displayString = ''
        for node in sorted(displayList, key=lambda edge: edge[0].getID()):
            displayString += '{0}:'.format(node[0])

            for edge in sorted(node[1], key=lambda neighbor: neighbor[0]):
                displayString += ' (Node: {0}, Connected by: {1}),'.format(edge[0], str(edge[1]))
            displayString = displayString[0:len(displayString) - 1:1] #cut off extra comma
            displayString += '\n'
        return str(displayString)

    def addEdge(self, *args):
        tempGraph = self.edges
        for component in args:
            if not issubclass(type(component), Component):
                print('Component {0} is not an instance of component'.format(component))
                self.edges = tempGraph
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

    def _compileEdges(self):
        nodes = {}
        #add both edges going both ways
        for edge in self.edges:
            node = edge.getFirstNode()
            if node and node in nodes:
                nodes[node].append([edge.getSecondNode(), edge])
            else:
                nodes[node] = [[edge.getSecondNode(), edge]]

        for edge in self.edges:
            node = edge.getSecondNode()
            if node and node in nodes:
                nodes[node].append([edge.getFirstNode(), edge])
            else:
                nodes[node] = [[edge.getFirstNode(), edge]]
        return nodes

    def simplifyEdges(self):
        graph = self._compileEdges()
        #search through neighbors, if wire found, remove that edge, and add that guys neighbors
        #repeat until no wires remain
        graphKeys = list(graph.keys())
        for node in graphKeys:
            #make sure node was not removed in prior operation
            if node not in graph.keys():
                continue
            wiresRemain = True
            simplifiedNeighbors = []
            newNeighbors = graph[node]
            visited = set()
            visited.add(node)
            while wiresRemain:
                currentNeighbors = newNeighbors
                newNeighbors = []
                for edge in currentNeighbors:
                    if isinstance(edge[1], Wire):
                        try:
                            #do not add edges in visited to avoid infinite loop
                            newNeighbors += [edge for edge in graph[edge[0]] if edge[0] not in visited]
                            visited.add(edge[0])
                            graph.pop(edge[0], None)
                                
                        except KeyError:
                            print('edge {0} of node {1} not found in graph'.format(edge, node))
                            return
                    else:
                        #if component is not a wire we cannot simplify so readd to graph
                        simplifiedNeighbors.append(edge)
                wiresRemain = len(newNeighbors) > 0
                
            graph[node] = simplifiedNeighbors
        
        return graph



    def getVoltages(self):
        #nodal analysis
        simplifiedNodes = self.simplifyEdges()
        
    
    def getCurrents(self):
        pass


node0 = Node(0,0,0)
node1 = Node(0,0,1)
node2 = Node(0,0,2)
node3 = Node(0,0,3)
node4 = Node(0,0,4)
node5 = Node(0,0,5)
edge0 = PowerSupply(5, node5, node0)
edge1 = Wire(node0, node1)
edge2 = Wire(node1, node2)
edge3 = Resistor(10000, node1, node4)
edge4 = Resistor(20000, node2, node3)
edge5 = Wire(node3, node4)
edge6 = Wire(node4, node5)

testCircuit = Circuit()
testCircuit.addEdge(edge0, edge1, edge2, edge3, edge4, edge5, edge6)
print(testCircuit.simplifyEdges())