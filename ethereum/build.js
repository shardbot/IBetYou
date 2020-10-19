const solc = require('solc')
const fs = require('fs-extra')
const path = require('path')

const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)

const betPath = path.resolve(__dirname, 'bet', 'Bet.sol')
const source = fs.readFileSync(betPath, 'utf8')

var input = {
    language: 'Solidity',
    sources: {
      './bet/Bet.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output)

fs.ensureDirSync(buildPath)

for (var contractName in output.contracts['./bet/Bet.sol']) {
    console.log();
    console.log(
      contractName +
        ': ' +
        output.contracts['./bet/Bet.sol'][contractName].abi
    );
  }
