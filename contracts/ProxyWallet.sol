pragma solidity ^0.5.0;

import './RegistryToken.sol';
import './ProjectRegistry.sol';

contract ProxyWallet {

  ProjectRegistry public projectRegistry;
  RegistryToken public token;

  mapping(address => uint256) balances;

  constructor() public {
    token = new RegistryToken();
  }

  function setProjectRegistry(ProjectRegistry _projectRegistry) public {
    projectRegistry = _projectRegistry;
  }

  function mintTokens(uint256 _value) public {
    token.mint(address(this), _value);
    balances[msg.sender] += _value;
  }

  function deposit(uint256 _value, address _target) public {
    token.transferFrom(msg.sender, address(this), _value);
    balances[_target] += _value;
  }

  function balanceOf(address _owner) view public returns(uint256) {
    return balances[_owner];
  }

  function applyAndPay(bytes32 _name) public {
    uint256 val = projectRegistry.minDeposit();
    require(balances[msg.sender] >= val);
    token.approve(address(projectRegistry), val);
    projectRegistry.applyWithProject(_name);
    balances[msg.sender] -= val;
  }

  function challengeAndPay(uint256 _projectId) public {
    uint256 val = projectRegistry.minDeposit();
    require(balances[msg.sender] >= val);
    token.approve(address(projectRegistry), val);
    projectRegistry.challengeProject(_projectId, msg.sender);
    balances[msg.sender] -= val;
  }


  function getToken() public view returns(RegistryToken) {
    return token;
  }

}
