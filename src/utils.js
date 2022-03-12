// privateKey: pk of the sender
// contract: contract object
// contract_data: bytecode of the data we want to send to the contract
async function writeContract(privateKey, contract, contract_data, gasSlippage = 0){
    let _gasPrice = await web3.eth.getGasPrice();
    let sender_adr = web3.eth.accounts.privateKeyToAccount(privateKey).address; // address of the sender

    let txCount = await web3.eth.getTransactionCount(sender_adr);
    let txObject = {
        nonce: web3.utils.toHex(txCount.toString()),
        gasPrice: web3.utils.toHex(_gasPrice.toString()),
        from: sender_adr,
        to: contract.options.address,
        data: contract_data,
        chainId: 43114 // for avax
    }

    let _gasLim = await web3.eth.estimateGas(txObject);
    console.log("estimated gas:" +_gasLim, "paid gas:" + (_gasLim + gasSlippage) );
    txObject.gasLimit = web3.utils.toHex( (_gasLim + gasSlippage).toString());

    return sendTransaction(privateKey, txObject)
}

// txObject: transaction object to be signed and sent to the blockchain
// privateKey: -
async function sendTransaction(privateKey, txObject){
    // Sign the transaction
    let tx = new Tx(txObject)
    tx.sign( ethereumjs.Buffer.Buffer.from(privateKey.substr(2, privateKey.length), "hex"))
    
    // Serialize the transaction
    let serializedTransaction = tx.serialize()
    let raw = '0x' + serializedTransaction.toString('hex')
    
    // Broadcast the transaction

    let res = await web3.eth.sendSignedTransaction(raw);
    console.log(res.transactionHash)
    return res.transactionHash;
}

// _TxObj: A transaction object
async function calculateGasFee(_TxObj){
    try{
        if (_TxObj.nonce == undefined){
            let txCount = await web3.eth.getTransactionCount(_TxObj.from);
            _TxObj.nonce = txCount;
        }

        let gasfee = await web3.eth.estimateGas(_TxObj);
        let gasPrice = await web3.eth.getGasPrice();
        cost = Number( web3.utils.fromWei( (gasfee * gasPrice).toString(), 'ether'));
        return cost;
    } catch(err){
        // console.log(err);
        return NaN;
    }
}

// checks whether a string is numeric or not
function isNumeric(num){
    return !isNaN(num);
}