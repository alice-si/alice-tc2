# Impact Curator

The Alice protocol helps donors track what impact their money makes when they give to charity. We built the Impact Curator to help vet projects before they can fundraise on Alice, and ensure that they are of a high quality. The Impact Curator provides users with amazing UX: intuitive UI, responsive data rendering with Vuex state manager, minimised gas costs and faster confirmation times thanks to the Skale sidechain, which also avoids clogging the mainnet with a high number of TCR-related voting transactions.

### Project running
```bash
npm install # will install required dependencies
npm install -g truffle # will install truffle
truffle migrate # will compile contracts and paste artefacts into build folder
npm run dev # will run application locally
```

### Networks connection
You can deploy our contracts
- locally (don't forget to run ganache)
- on poa network (```truffle migrate --network poa```)
- on skale network  (```truffle migrate --network skale```)

### Tests
```bash
npm run test/truffle # will run smart contracts tests
```
