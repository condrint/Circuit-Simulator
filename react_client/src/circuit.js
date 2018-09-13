import React, { Component } from 'react';

class Circuit extends Component{
    constructor(props){
        super(props)
    }

    render() {
        //rows and columns
        //total trs (rows) = rows + (rows - 1) and same for td and columns

        //make data structure before hand and iterate over it creating rows/columns

        //values will be \t\t\t\n\t *DOT OR EDGE TYPE* \t\n\t\t\t

        //algo for making shit

        //1. place nodes
        //  a. gonna create an array of arrays
        //  b. outside loop is rows + rows - 1
        //  c. if i % 2 == 1, make row blank
        //  d. otherwise inside loops is col + col - 1 and place nodes every other spot using %2


        //2. place edges
        //  a. node 1 and node2
        //  b. if node1 and node2 are in the same row (node1 / col == node2 / col)
        //      -place at [ col, row (node/col)] find col by (node1%col + node2%col)
        //  c. ok so were in the same column them (placement is not legal otherwise)
        //      -find column by %col
        //      -find both rows and place in [col, row in between (add up and div by 2)] node/col * 2 to find row
        let nodes = this.props.nodes;
        let rows = 0;
        let cols = 0;
        if (nodes){
            rows = nodes[0];
            cols = nodes[1];
        }
        let circuit = [];
        const blankSpot = '\t\t\t\n\t\t\t\n\t\t\t'
        const nodeSpot = '\t\t\t\n\t·\t\n\t\t\t'

        //create blank circuit and place nodes
        for(let i = 0; i < 2 * rows - 1; i++){
            let newRow = []
            if (i % 2 == 0){
                for(let j = 0; j < 2 * cols - 1; j++){
                    if (j % 2 == 0){
                        newRow.push(nodeSpot);
                    }
                    else{
                        newRow.push(blankSpot);
                    }
                }
            }
            else{
                for(let j = 0; j < 2 * cols - 1; j++){
                    newRow.push(blankSpot);
                }
            }
            circuit.push(newRow);
        }

        //place edges
        for (let edge of edges){
            
        }




        return(
            <div>
                {nodes &&
                    <table id="Circuit">

                    </table>
                }
            </div>
        )
    }
}

export {Circuit}
