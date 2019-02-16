pragma solidity >=0.4.22 <0.6.0;

contract ProjectRegistry {

    enum State {APPLICATION, ACTIVE, CHALLENGE, REJECTED}

    struct Project {
        bytes32 name;
        State state;
    }

    Project[] public projects;

    event ProjectAdded();
    event ProjectRemoved(uint index);


    constructor() public {}

    function getProject(uint index) public view returns (bytes32 name, State state) {
        require(projects.length > index, "Index out of bounds");
        return (projects[index].name, projects[index].state);
    }

    function getProjectsLength() public view returns (uint) {
        return projects.length;
    }

    function apply(bytes32 name) public {
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
