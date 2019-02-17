const ProjectRegistry = artifacts.require("./ProjectRegistry.sol");
const Token = artifacts.require("./RegistryToken.sol");

contract('ProjectRegistry', function([main, applicant, voter1, voter2, challenger]) {
    let projectRegistry, token;

    let deposit = web3.utils.toWei('10', 'ether');
    let deposit2 = web3.utils.toWei('20', 'ether');
    let deposit3 = web3.utils.toWei('30', 'ether');

    it("Should create empty projectRegistry", async function () {
        projectRegistry = await ProjectRegistry.new(deposit, {from: main, gas: 5000000});
        let length = await projectRegistry.getProjectsLength.call();
        assert.equal(length, 0);

        let tokenAddress = await projectRegistry.token();
        token = await Token.at(tokenAddress);
    });




    it("Should get tokens", async function () {
      await projectRegistry.mintTokens(deposit, {from: applicant});

      let total = await token.totalSupply();
      let balance = await token.balanceOf(applicant);

      assert(total, deposit);
      assert(balance, deposit);
    });

    it("Should apply", async function() {
      await token.approve(projectRegistry.address, deposit, {from: applicant});

      const projectName = "Test project 1";
      await projectRegistry.applyWithProject(web3.utils.fromAscii(projectName), {from: applicant});
      let project = await projectRegistry.getProject.call(0);
      let registeredName = web3.utils.toAscii(project[0]).split("\u0000").join("");
      let registeredState = project[1].valueOf();


      assert.equal(registeredName, projectName);
      assert.equal(registeredState, 0);
      assert.equal(await projectRegistry.getProjectsLength.call(), 1);
    });

    it("Should vote", async function() {
      await projectRegistry.mintTokens(deposit, {from: voter1});
      await projectRegistry.mintTokens(deposit, {from: voter2});

      await projectRegistry.vote(0, deposit, true, {from: voter1});

      let project = await projectRegistry.getProject(0);

      assert.equal(project[1], 0); //status APPLICATION
      assert.equal(project[2], deposit); //yesTotal
      assert.equal(project[3], 0); //noTtotal

    });


  it("Should vote", async function() {
    await projectRegistry.vote(0, deposit, true, {from: voter2});

    let project = await projectRegistry.getProject(0);

    assert.equal(project[1], 1); //status ACTIVE
    assert.equal(project[2], deposit * 2); //yesTotal
    assert.equal(project[3], 0); //noTtotal
  });

  it("Should apply second time", async function() {
    await projectRegistry.mintTokens(deposit, {from: applicant});
    await token.approve(projectRegistry.address, deposit, {from: applicant});

    const projectName = "Test project 2";
    await projectRegistry.applyWithProject(web3.utils.fromAscii(projectName), {from: applicant});
    let project = await projectRegistry.getProject.call(1);
    let registeredName = web3.utils.toAscii(project[0]).split("\u0000").join("");
    let registeredState = project[1].valueOf();


    assert.equal(registeredName, projectName);
    assert.equal(registeredState, 0);
    assert.equal(await projectRegistry.getProjectsLength.call(), 2);
  });


  it("Should vote", async function() {
    await projectRegistry.vote(1, deposit, true, {from: voter1});

    let project = await projectRegistry.getProject(1);

    assert.equal(project[1], 0); //status APPLICATION
    assert.equal(project[2], deposit); //yesTotal
    assert.equal(project[3], 0); //noTotal

  });


  it("Should vote", async function() {
    await projectRegistry.mintTokens(deposit, {from: voter2});
    await projectRegistry.vote(1, deposit2, false, {from: voter2});

    let project = await projectRegistry.getProject(1);

    assert.equal(project[1], 3); //status REJECTED
    assert.equal(project[2], deposit); //yesTotal
    assert.equal(project[3], deposit2); //noTotal

    await projectRegistry.collectApplicationReward(1, {from: voter2});
    let balance = await token.balanceOf(voter2);
    assert.equal(balance, deposit3); //initial balance + full applicant deposit
  });


  it("Should challenge", async function() {
    await projectRegistry.mintTokens(deposit, {from: challenger});
    await token.approve(projectRegistry.address, deposit, {from: challenger});

    await projectRegistry.challengeProject(0, {from: challenger});

    let project = await projectRegistry.getProject(0);
    let votes = await projectRegistry.getVotes(0, voter1);

    assert.equal(project[1], 2); //status CHALLENGE
    assert.equal(project[2], 0); //yesTotal
    assert.equal(project[3], 0); //noTotal
    assert.equal(votes[0], 0); //yesTotal
    assert.equal(votes[1], 0); //noTotal
  });

  it("Should vote for challenge", async function() {
    await projectRegistry.vote(0, deposit, true, {from: voter1});

    let project = await projectRegistry.getProject(0);
    let votes = await projectRegistry.getVotes(0, voter1);

    assert.equal(project[1], 2); //status CHALLENGE
    assert.equal(project[2], deposit); //yesTotal
    assert.equal(project[3], 0); //noTotal
    assert.equal(votes[0], deposit); //yesTotal
    assert.equal(votes[1], 0); //noTotal

  });


  it("Should vote", async function() {
    await projectRegistry.vote(0, deposit2, false, {from: voter2});

    let project = await projectRegistry.getProject(0);

    assert.equal(project[1], 3); //status REJECTED
    assert.equal(project[2], deposit); //yesTotal
    assert.equal(project[3], deposit2); //noTotal

    let balance = await token.balanceOf(challenger);
    assert.equal(balance, deposit2); //initial balance + full applicant deposit
  });

});
