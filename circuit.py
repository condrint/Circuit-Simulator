class Node():
    def __init__(self, x, y):
        self.x = x
        self.y = y

class Component():
    """
    parent component class
    type is a string of content
    'wire', 'resistor'
    """
    def __init__(self, type, node1, node2):
        self.type = type
        self.node1 = node1
        self.node2 = node2

class Wire(Component):
    def __init__(self, node1, node2):
        Component.__init__(self, 'Wire', node1, node2)
    
class Resistor(Component):
    def __init__(self, resistance, node1, node2):
        Component.__init__(self, 'Resistor', node1, node2)
        self.resistance = resistance
    
    def getResistance(self):
        return self.resistance

class PowerSupply(Component):
    def __init__(self, volts, node1, node2):
        Component.__init__(self, 'PowerSupply', node1, node2)
        self.volts = volts

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
    
    def addEdge(self, Component):
        self.edges.append(Component)
        print('Added edge {}'.format(len(self.edges) - 1))
        return True

    def removeEdge(self, edgeNumber):
        try:
            del self.edges[edgeNumber]
            print('Deleted edge {}'.format(edgeNumber))
            return True
        except IndexError:
            print('Edge does not exist')
            return False

    def getVoltages(self):
        pass
    
    def getCurrents(self):
        pass