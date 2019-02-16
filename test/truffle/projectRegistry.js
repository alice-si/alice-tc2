const ProjectRegistry = artifacts.require("./ProjectRegistry.sol");
const Token = artifacts.require("./RegistryToken.sol");

contract('ProjectRegistry', function([main, applicant]) {
    let projectRegistry, token;

    let deposit = web3.utils.toWei('10', 'ether');

    it("Should create empty projectRegistry", async function () {
        projectRegistry = await ProjectRegistry.new(deposit, {from: main, gas: 3000000});
        let length = await projectRegistry.getProjectsLength.call();
        assert.equal(length, 0);

        let tokenAddress = await projectRegistry.token();
        token = await Token.at(tokenAddress);
    });




    it("Should get tokens", async function () {
      await projectRegistry.mintTokens(deposit);

      let total = await token.totalSupply();
      let balance = await token.balanceOf(main);

      assert(total, deposit);
      assert(balance, deposit);
    });

    it("Should apply", async function() {
        await token.approve(projectRegistry.address, deposit);

        const projectName = "Test project 1";
        await projectRegistry.applyWithProject(web3.utils.fromAscii(projectName));
        let project = await projectRegistry.getProject.call(0);
        let registeredName = web3.utils.toAscii(project[0]).split("\u0000").join("");
        let registeredState = project[1].valueOf();


        assert.equal(registeredName, projectName);
        assert.equal(registeredState, 0);
        assert.equal(await projectRegistry.getProjectsLength.call(), 1);
    });

    // it("Should remove the first project", async function () {
    //     await projectRegistry.removeProject(0);
    //     const length = await projectRegistry.getProjectsLength.call();
    //     assert.equal(length.toNumber(), numberOfProjects - 1);
    // });
});
