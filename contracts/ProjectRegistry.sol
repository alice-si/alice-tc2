pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './RegistryToken.sol';

contract ProjectRegistry is Ownable {

    enum State {APPLICATION, ACTIVE, CHALLENGE, REJECTED}

    struct Project {
        bytes32 name;
        State state;
        uint256 yesTotal;
        uint256 noTotal;
        mapping(address => uint256) yesVotes;
        mapping(address => uint256) noVotes;
    }

    Project[] public projects;
    RegistryToken public token;
    uint256 public minDeposit;

    event ProjectAdded();
    event ProjectRemoved(uint index);
    event Vote(uint256 projectId);


    constructor(uint256 _minDeposit) public {
      token = new RegistryToken();
      minDeposit = _minDeposit;
    }

    function getProject(uint index) public view returns (bytes32 name, State state, uint256 yesTotal, uint256 noTotal) {
        require(projects.length > index, "Index out of bounds");
        return (projects[index].name, projects[index].state, projects[index].yesTotal, projects[index].noTotal);
    }

    function getProjectsLength() public view returns (uint) {
        return projects.length;
    }

    function mintTokens(uint256 _value) public {
        token.mint(msg.sender, _value);
    }

    function applyWithProject(bytes32 name) public {
        require(token.transferFrom(msg.sender, address(this), minDeposit));
        projects.push(Project({name: name, state: State.APPLICATION, yesTotal: 0, noTotal: 0}));

        emit ProjectAdded();
    }

    function vote(uint256 _projectId, uint256 _value, bool yes) public {
        require(projects[_projectId].yesVotes[msg.sender] == 0 && projects[_projectId].noVotes[msg.sender] == 0);
        require(_value <= token.balanceOf(msg.sender));

        if (yes) {
          projects[_projectId].yesTotal += _value;
          projects[_projectId].yesVotes[msg.sender] += _value;
        } else {
          projects[_projectId].noTotal += _value;
          projects[_projectId].noVotes[msg.sender] += _value;
        }
        resolveApplication(_projectId);
        emit Vote(_projectId);
    }

    function resolveApplication(uint256 _projectId) public {
        require(projects[_projectId].state == State.APPLICATION);
        uint256 quorum = projects[_projectId].yesTotal + projects[_projectId].noTotal;
        if (quorum > token.totalSupply() / 2) {
          if (projects[_projectId].yesTotal > projects[_projectId].noTotal) {
            projects[_projectId].state = State.ACTIVE;
          } else if (projects[_projectId].yesTotal < projects[_projectId].noTotal) {
            projects[_projectId].state = State.REJECTED;
          }
        }
    }


    function collectApplicationReward(uint256 _projectId) public {
      require(projects[_projectId].state == State.REJECTED);
      uint256 reward = minDeposit * projects[_projectId].noTotal / projects[_projectId].noVotes[msg.sender];
      token.transfer(msg.sender, reward);
      projects[_projectId].noVotes[msg.sender] = 0;
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
