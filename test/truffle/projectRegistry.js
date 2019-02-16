const ProjectRegistry = artifacts.require("./ProjectRegistry.sol");

contract('ProjectRegistry', function(accounts) {
    let projectRegistry;

    it("Should create empty projectRegistry", async function () {
        projectRegistry = await ProjectRegistry.new();
        let length = await projectRegistry.getProjectsLength.call();
        assert.equal(length, 0);
    });

    it("Should apply", async function() {
        const projectName = "Test project 1";
        await projectRegistry.apply(projectName);
        let project = await projectRegistry.getProject.call(0);
        let registeredName = web3.toAscii(project[0]).split("\u0000").join("");
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
