pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegistryToken.sol';

contract ProjectRegistry is Ownable {

    enum State {APPLICATION, ACTIVE, CHALLENGE, REJECTED}

    struct Project {
        bytes32 name;
        State state;
    }

    Project[] public projects;
    RegistryToken public token;
    uint256 public minDeposit;

    event ProjectAdded();
    event ProjectRemoved(uint index);


    constructor(uint256 _minDeposit) public {
      token = new RegistryToken();
      minDeposit = _minDeposit;
    }

    function getProject(uint index) public view returns (bytes32 name, State state) {
        require(projects.length > index, "Index out of bounds");
        return (projects[index].name, projects[index].state);
    }

    function getProjectsLength() public view returns (uint) {
        return projects.length;
    }

    function mintTokens(uint256 _value) public {
        token.mint(msg.sender, _value);
    }

    function applyWithProject(bytes32 name) public {
        require(token.transferFrom(msg.sender, address(this), minDeposit));
        projects.push(Project({name: name, state: State.APPLICATION}));

        emit ProjectAdded();
    }

    function removeProject(uint index) public {
        require(projects.length > index, "Index out of bounds");
        delete projects[index];
        uint i = index;
        while (i < projects.length - 1) {
            projects[i] = projects[i + 1];
            i++;
        }
        projects.length--;

        emit ProjectRemoved(index);
    }
}
