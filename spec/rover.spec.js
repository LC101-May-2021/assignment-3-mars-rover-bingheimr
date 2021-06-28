const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function() {
    let rover = new Rover(98382);
    expect(rover.position).toEqual(98382);
  });

  it("response returned by receiveMessage contains name of message", function() {
    const rover = new Rover("000");
    const message = new Message(
      "Hello", 
      [new Command('MODE_CHANGE', 'LOW_POWER')]);
    let roverAnswer = rover.receiveMessage(message);
    expect(roverAnswer.name).toEqual(message.name);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    const rover = new Rover("123")
    const message = new Message("Hello",
                              [new Command("MODE_CHANGE", "LOW_POWER"),
                              new Command("STATUS_CHECK")]);
    let roverAnswer = rover.receiveMessage(message);
    expect(roverAnswer.results.length).toEqual(message.commands.length);
  });

  it("should respond correctly to a status check command", function () {
    const rover = new Rover("456", "MODE_CHANGE");
    const message = new Message("Hello", [new Command('STATUS_CHECK')]);
    let roverAnswer = rover.receiveMessage(message);
    let status = {completed: true,
                  mode: rover.mode,
                  generatorWatts: rover.generatorWatts,
                  position: rover.position
                  };
    let ref;
    for (let i in message.commands) {
      if (message.commands[i].commandType === "STATUS_CHECK") {
        ref = i;
        break;
      }
    }
       
    expect(roverAnswer.results[ref]).toEqual(status);      
  });

  it ("should respond correctly to mode change command", function () {
    const rover = new Rover("789");
    const message = new Message("Hello", [new Command('MODE_CHANGE', 'LOW_POWER')]);
    let roverAnswer = rover.receiveMessage(message);

    expect(roverAnswer.results[0].completed).toEqual(true);
    expect(rover.mode).toEqual("LOW_POWER");
  });

  it ("should respond with false completed value when attempting to move in LOW_POWER mode", function () {
    const rover = new Rover("010");
    const message = new Message("Hello", [new Command("MODE_CHANGE", "LOW_POWER"), 
                                          new Command("MOVE", '55555')]);
    let roverAnswer = rover.receiveMessage(message);
    expect(roverAnswer.results[1].completed).toEqual(false);                                      
  });

  it ("should respond with position for move command", function (){
    const rover = new Rover("999");
    const message = new Message("Hello", [new Command("MOVE", "55555")]);
    let roverAnswer = rover.receiveMessage(message);
    console.log(roverAnswer);
    expect(rover.position).toEqual("55555");
  });

});
