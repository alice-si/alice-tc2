const ProjectRegistry = artifacts.require("./ProjectRegistry.sol");

contract('ProjectRegistry', function(accounts) {
    let projectRegistry;
    const numberOfProjects = 5;

    it("Should create empty projectRegistry", async function () {
        projectRegistry = await ProjectRegistry.new();
        let length = await projectRegistry.getProjectsLength.call();
        assert.equal(length, 0);
    });

    it("Should add new projects", async function() {
        for (let i = 0; i < numberOfProjects; i++) {
            const projectName = "Test project nr" + i;
            await projectRegistry.addProject(projectName);
            const nameFromProjectregistry = await projectRegistry.getProjectName.call(i);
            const length = await projectRegistry.getProjectsLength.call();
            assert(web3.toAscii(nameFromProjectregistry).includes(projectName));
            assert.equal(length, i + 1);
        }
    });

    it("Should remove the first project", async function () {
        await projectRegistry.removeProject(0);
        const length = await projectRegistry.getProjectsLength.call();
        assert.equal(length.toNumber(), numberOfProjects - 1);
    });
});