# Circuit-Simulator
React and Flask - Simulate a simple DC circuit

Check it out on [Heroku](https://circuit-simulator.herokuapp.com/) - Note: it will probably take a few seconds to load, the free tier of Heroku takes the app out of memory after some time

## Usage
* Try placing a power supply and some resistors and wires that connect from the plus to the minus sign
* Any nodes connected directly (i.e. by wire only) to the negative terminal of a power supply with always be at zero volts
* If you have wires connecting the positive and negative terminals of a powersupply directly you will short the battery! (and the results will be mostly meaningless)
* Power supplies / Resistors / Wires can only be placed between horizontally or vertically connected neighbors.

## Issues/Todo
* The python scripts on the backend will break if you start making weird circuits, working on this atm 
