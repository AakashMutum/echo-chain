const fs = require('fs');
const solc = require('solc');

const content = fs.readFileSync('contracts/DecisionRegistry.sol', 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'DecisionRegistry.sol': {
            content: content,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    let hasError = false;
    output.errors.forEach((err) => {
        if (err.severity === 'error') {
            hasError = true;
            console.error(err.formattedMessage);
        } else {
            console.log(err.formattedMessage);
        }
    });
    if (hasError) process.exit(1);
}

const contract = output.contracts['DecisionRegistry.sol']['DecisionRegistry'];
fs.writeFileSync('lib/web3/bytecode.ts', `export const DECISION_REGISTRY_BYTECODE = "${contract.evm.bytecode.object}";\n`);
console.log('Bytecode written to lib/web3/bytecode.ts');
