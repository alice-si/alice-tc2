import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract RegistryToken is ERC20Mintable {

  string public constant name = "RegistryToken";
  string public constant symbol = "TC2";
  uint8 public constant decimals = 18;

}
