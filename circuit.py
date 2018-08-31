
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
        return self is other
    
    def __lt__(self, other):
        return self.id < other.id
    
    def __gt__(self, other):
        return self.id > other.id

    def getUniqueID(self):
        #the unique ID is used for simulating the circuit and solving systems of equations
        return self._id

    def getID(self):
        #ideally, this ID would be unique as well, but shouldnt break anything if it is not
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

    def getOtherNode(self, node):
        if node is self.node1:
            return self.node2
        elif node is self.node2:
            return self.node1
        else:
            return None

    def getType(self):
        return self.type

    def getNodalAnalysisBehavior(self):
        raise NotImplementedError('Nodal analysis behavior not implemented for {0}'.format(self.type))
        
class Wire(Component):
    def __init__(self, node1, node2):
        Component.__init__(self, 'Wire', node1, node2)
    
    def __repr__(self):
        return 'Wire' + str(id(self))

    def getNodalAnalysisBehavior(self):
        raise NotImplementedError('Wire should not be in nodal analysis')
    
class Resistor(Component):
    def __init__(self, resistance, node1, node2):
        Component.__init__(self, 'Resistor', node1, node2)
        self.resistance = resistance
    
    def __repr__(self):
        return 'Resistor{0} with value {1} ohms'.format(id(self), self.getResistance())

    def getResistance(self):
        return self.resistance
    
    def getNodalAnalysisBehavior(self):
        return 1/self.resistance 

class PowerSupply(Component):
    def __init__(self, volts, positive, negative):
        Component.__init__(self, 'PowerSupply', positive, negative)
        self.volts = volts
    
    def __repr__(self):
        return 'Powersupply{0} with value {1} volts'.format(id(self), self.getVoltage())
        
    def getVoltage(self):
        return self.volts

    def getPolarity(self, node):
        if node is self.node1:
            return self.volts
        elif node is self.node2:
            return 0
        else:
            return None
    
    def getNodalAnalysisBehavior(self, nodes):
        for node in nodes:
            polarity = self.getPolarity(node)
            if polarity is not None:
                return polarity
        raise KeyError ('{0} are not connected to {1}'.format(nodes, self))

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
        #convert list of edges into dictionary of nodes for quicker navigation
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

    def _simplifyEdges(self):
        """
        search through neighbors, if wire found, remove that edge, and add that guys neighbors
        repeat until no wires remain
        returns tuple (dict, dict) where the first dict is the simplified graph and the second the nodes that were simplified
        """
        graph = self._compileEdges()
        unsimplifiedNodeRelationships = {}

        #we cant modify dictionary keys during iteration, so take a snapshot of them prior to algorithm
        graphKeys = list(graph.keys())

        for node in graphKeys:
            #make sure node was not removed in prior operation
            if node not in graph.keys():
                continue

            #set up variables for traversal
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

                            #remove node that can be simplified
                            nodeWasRemoved = graph.pop(edge[0], None) is not None
                            removedNode = edge[0]

                            #search through entire graph for removed node and update
                            #it with the node it was simplified "into"
                            #slow but necessary to fix, otherwise dictionary values will reference removed keys
                            for key in graph.keys():
                                for neighbor in graph[key]:
                                    if neighbor[0] == removedNode:
                                        neighbor[0] = node

                            if nodeWasRemoved:
                                if node in unsimplifiedNodeRelationships:
                                    unsimplifiedNodeRelationships[node].append(removedNode)
                                else:
                                    unsimplifiedNodeRelationships[node] = [removedNode]
                            else:
                                print('Error when simplifying {0} which is a neighbor of {1}'.format(edge[0], node))
                                return (None, None)
                                
                        except KeyError:
                            print('Edge {0} of node {1} not found in graph'.format(edge, node))
                            return (None, None)
                    else:
                        #if component is not a wire we cannot simplify so re-add to graph
                        simplifiedNeighbors.append(edge)
                wiresRemain = len(newNeighbors) > 0
                
            graph[node] = simplifiedNeighbors
        
        #simplify power supplies
        #if we find a power supply in a nodes neighbors, replace all neighbors with voltage
        for node in graph:
            voltage = None
            for value in graph[node]:
                component = value[1]
                if isinstance(component, PowerSupply):
                    #powersupply will be connected to either current node, or one of it's neighbor nodes that it was simplified with
                    nodesToCheckVoltage = unsimplifiedNodeRelationships[node] + [node] if node in unsimplifiedNodeRelationships else [node]
                    while not isinstance(component.getPolarity(nodesToCheckVoltage[-1]), int):
                        nodesToCheckVoltage.pop()
                    newVoltage = component.getPolarity(nodesToCheckVoltage[-1])
                    if newVoltage == 0:
                        graph[node] = newVoltage
                        break
                    elif not voltage:
                        voltage = newVoltage
                    elif newVoltage > voltage:
                        voltage = newVoltage
            if voltage:
                graph[node] = voltage
            
                        
        return (graph, unsimplifiedNodeRelationships)



    def _getVoltages(self):
        #nodal analysis
        simplifiedNodes, unsimplifiedNodeRelationships = self._simplifyEdges()
        voltages = analyzeNodes(simplifiedNodes, unsimplifiedNodeRelationships)
        for node in unsimplifiedNodeRelationships:
            for connectedNode in unsimplifiedNodeRelationships[node]:
                #find parent node's voltage and assign connectedNode that voltage
                voltage = [x[1] for x in voltages if x[0] == node]
                if not voltage:
                    raise KeyError('node not found in voltages')
                voltages.append((connectedNode, voltage[0]))

        #convert to a dictionary for faster lookups when assigning currents
        #a list was used earlier (instead of a dictionary) in nodal analysis because the order was important 
        #for the part of the algorithm that used linear algebra
        voltages = {x[0]:x[1] for x in voltages}
        return voltages
        
    
    def _getCurrents(self, voltages):
        #iterate through edges, and use ohm's law and provided voltages to solve for currents
        #only assign positive current with abs() (direction is arbitrary, only magnitude matters for this GUI)
        currents = []
        for component in self.edges:
            #calculate currents over nodes with differences in voltages first
            if component.getType() == 'Resistor':
                node1voltage = voltages[component.getFirstNode()]
                node2voltage = voltages[component.getSecondNode()]
                current = abs((node1voltage - node2voltage)/component.getResistance())
                currents.append(current)
            else:
                currents.append(0)
        print(self.edges)
        print(currents)
        #add up currents from lowest voltage upwards


        

    def nodalAnalysis(self):
        voltages = self._getVoltages()
        currents = self._getCurrents(voltages)

if __name__ == '__main__':
    #importing here avoids circular dependency loops
    from nodal_analysis import *
    node0 = Node(0,0,0)
    node1 = Node(0,0,1)
    node2 = Node(0,0,2)
    node3 = Node(0,0,3)
    node4 = Node(0,0,4)
    node5 = Node(0,0,5)
    edge0 = PowerSupply(10, node0, node5)
    edge1 = Resistor(5000, node0, node1)
    edge2 = Wire(node1, node2)
    edge3 = Resistor(10000, node1, node4)
    edge4 = Resistor(10000, node2, node3)
    edge5 = Wire(node3, node4)
    edge6 = Wire(node4, node5)

    testCircuit = Circuit()
    testCircuit.addEdge(edge0, edge1, edge2, edge3, edge4, edge5, edge6)
    print(testCircuit.nodalAnalysis())