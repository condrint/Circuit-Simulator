import circuit

def analyzeNodes(graph):
    """
    utilizes nodal analysis to find the voltages at each node
    returns a dictionary with pairs {node: voltage, ...}
    """
    #create an index of nodes, where the index serves as the subscript denoting different nodal voltages
    nodes = sorted(list(graph))