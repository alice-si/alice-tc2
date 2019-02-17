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
        address[] voters;
        address challenger;
    }

    Project[] public projects;
    RegistryToken public token;
    uint256 public minDeposit;

    event ProjectAdded();
    event ProjectApproved(uint index);
    event ProjectChallenged(uint index);
    event ProjectRejected(uint index);
    event Vote(uint256 projectId);


    constructor(uint256 _minDeposit) public {
      token = new RegistryToken();
      minDeposit = _minDeposit;
    }

    function getProject(uint index) public view returns (bytes32 name, State state, uint256 yesTotal, uint256 noTotal) {
        require(projects.length > index, "Index out of bounds");
        return (projects[index].name, projects[index].state, projects[index].yesTotal, projects[index].noTotal);
    }

    function getVotes(uint _projectId, address _voter) public view returns (uint256 yes, uint256 no) {
        return (projects[_projectId].yesVotes[_voter], projects[_projectId].noVotes[_voter]);
    }

    function getProjectsLength() public view returns (uint) {
        return projects.length;
    }

    function mintTokens(uint256 _value) public {
        token.mint(msg.sender, _value);
    }

    function applyWithProject(bytes32 name) public {
        require(token.transferFrom(msg.sender, address(this), minDeposit));
        projects.push(Project({name: name, state: State.APPLICATION, yesTotal: 0, noTotal: 0, challenger: address(0), voters: new address[](0)}));

        emit ProjectAdded();
    }

    function challengeProject(uint256 _projectId) public {
      require(projects[_projectId].state == State.ACTIVE);
      require(token.transferFrom(msg.sender, address(this), minDeposit));

      projects[_projectId].state = State.CHALLENGE;
      projects[_projectId].yesTotal = 0;
      projects[_projectId].noTotal = 0;
      for(uint i=0; i<projects[_projectId].voters.length; i++) {
        projects[_projectId].yesVotes[projects[_projectId].voters[i]] = 0;
        projects[_projectId].noVotes[projects[_projectId].voters[i]] = 0;
      }
      projects[_projectId].voters.length = 0;
      projects[_projectId].challenger = msg.sender;
      emit ProjectChallenged(_projectId);
    }

    function vote(uint256 _projectId, uint256 _value, bool yes) public {
        require(projects[_projectId].state == State.APPLICATION || projects[_projectId].state == State.CHALLENGE);
        require(projects[_projectId].yesVotes[msg.sender] == 0 && projects[_projectId].noVotes[msg.sender] == 0);
        require(_value <= token.balanceOf(msg.sender));

        if (yes) {
          projects[_projectId].yesTotal += _value;
          projects[_projectId].yesVotes[msg.sender] += _value;
        } else {
          projects[_projectId].noTotal += _value;
          projects[_projectId].noVotes[msg.sender] += _value;
        }
        projects[_projectId].voters.push(msg.sender);
        resolveApplication(_projectId);
        emit Vote(_projectId);
    }


    function resolveApplication(uint256 _projectId) public {
        require(projects[_projectId].state == State.APPLICATION || projects[_projectId].state == State.CHALLENGE);
        uint256 quorum = projects[_projectId].yesTotal + projects[_projectId].noTotal;
        if (quorum >= token.totalSupply() / 2) {
          if (projects[_projectId].yesTotal > projects[_projectId].noTotal) {
            projects[_projectId].state = State.ACTIVE;
            emit ProjectApproved(_projectId);
          } else if (projects[_projectId].yesTotal < projects[_projectId].noTotal) {
            if (projects[_projectId].state == State.CHALLENGE) {
              token.transfer(projects[_projectId].challenger, minDeposit*2);
              projects[_projectId].challenger = address(0);
            }
            projects[_projectId].state = State.REJECTED;
            emit ProjectRejected(_projectId);
          }
        }
    }


    function collectApplicationReward(uint256 _projectId) public {
      require(projects[_projectId].state == State.REJECTED);
      uint256 reward = minDeposit * projects[_projectId].noTotal / projects[_projectId].noVotes[msg.sender];
      token.transfer(msg.sender, reward);
      projects[_projectId].noVotes[msg.sender] = 0;
    }


//    function removeProject(uint index) public {
//        require(projects.length > index, "Index out of bounds");
//        delete projects[index];
//        uint i = index;
//        while (i < projects.length - 1) {
//            projects[i] = projects[i + 1];
//            i++;
//        }
//        projects.length--;
//
//        emit ProjectRemoved(index);
//    }
}
