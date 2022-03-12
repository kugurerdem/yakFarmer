let erc20_abi = [{"type":"constructor","stateMutability":"nonpayable","payable":false,"inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"spender","internalType":"address","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"DelegateChanged","inputs":[{"type":"address","name":"delegator","internalType":"address","indexed":true},{"type":"address","name":"fromDelegate","internalType":"address","indexed":true},{"type":"address","name":"toDelegate","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"DelegateVotesChanged","inputs":[{"type":"address","name":"delegate","internalType":"address","indexed":true},{"type":"uint256","name":"previousBalance","internalType":"uint256","indexed":false},{"type":"uint256","name":"newBalance","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"DELEGATION_TYPEHASH","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"DOMAIN_TYPEHASH","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"PERMIT_TYPEHASH","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowance","inputs":[{"type":"address","name":"account","internalType":"address"},{"type":"address","name":"spender","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"approve","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"rawAmount","internalType":"uint256"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"account","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint32","name":"fromBlock","internalType":"uint32"},{"type":"uint96","name":"votes","internalType":"uint96"}],"name":"checkpoints","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"uint32","name":"","internalType":"uint32"}],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"delegate","inputs":[{"type":"address","name":"delegatee","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"delegateBySig","inputs":[{"type":"address","name":"delegatee","internalType":"address"},{"type":"uint256","name":"nonce","internalType":"uint256"},{"type":"uint256","name":"expiry","internalType":"uint256"},{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"delegates","inputs":[{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint96","name":"","internalType":"uint96"}],"name":"getCurrentVotes","inputs":[{"type":"address","name":"account","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint96","name":"","internalType":"uint96"}],"name":"getPriorVotes","inputs":[{"type":"address","name":"account","internalType":"address"},{"type":"uint256","name":"blockNumber","internalType":"uint256"}],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nonces","inputs":[{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint32","name":"","internalType":"uint32"}],"name":"numCheckpoints","inputs":[{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"permit","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"rawAmount","internalType":"uint256"},{"type":"uint256","name":"deadline","internalType":"uint256"},{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transfer","inputs":[{"type":"address","name":"dst","internalType":"address"},{"type":"uint256","name":"rawAmount","internalType":"uint256"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transferFrom","inputs":[{"type":"address","name":"src","internalType":"address"},{"type":"address","name":"dst","internalType":"address"},{"type":"uint256","name":"rawAmount","internalType":"uint256"}],"constant":false}]

class Token{
    constructor(_token_name, _token_adr, _lp, _router){
        this.token_name = _token_name;
        this.token_adr = _token_adr;
        this.lp_contract = _lp;
        this.router = _router;

        this.auto_swap = false;
        this.swap_lim = Number.MAX_SAFE_INTEGER;

        this.avax_amount = 0;
        this.absolute_limit = this.avax_amount - this.swap_lim;

        this.contract = new web3.eth.Contract(erc20_abi, this.token_adr);
    }

    async getBalanceInAVAX(address){
        let promises = await Promise.all([
            this.getBalance(address),
            this.getTokenPrice()
        ])

        return promises[0] * promises[1];
    }

    async update(address){
        this.avax_amount = await this.getBalanceInAVAX(address);
        this.absolute_limit = this.avax_amount - this.swap_lim;
        return this;
    }

    async getBalance(address){
        return web3.utils.fromWei( (await this.contract.methods.balanceOf(address).call()).toString(), "ether");
    }

    async getTokenPrice(){
        // Make parallel requests
        let promises = await Promise.all([
            this.lp_contract.methods.getReserves().call(),
            this.lp_contract.methods.token1().call()
        ])

        // Get the finished requests
        let reserves = promises[0];
        let token1_adr = promises[1];

        // calculation
        let token_price = Number(reserves[1]) / Number(reserves[0]);
        if( token1_adr.toLowerCase() != WAVAX_ADDRESS)
            token_price = Number(reserves[0]) / Number(reserves[1]);

        return token_price;
    }

    async getAmountOut(amount){
        let send_amount = web3.utils.toWei(amount, "ether");
        let out = await this.router.methods.getAmountsOut(send_amount, [this.token_adr, WAVAX_ADDRESS]).call();
        return out[1];
    }

    async swapToAVAX(private_key, amount, slippage = 0){
        // generate address
        let address = web3.eth.accounts.privateKeyToAccount(private_key).address;

        // get the balance
        let send_amount = web3.utils.toWei(amount, "ether");
        let min_out = await this.getAmountOut(amount);
        console.log("3", min_out)

        // withdraw it
        let txHash = writeContract(private_key, this.router, this.router.methods.swapExactTokensForTokens(
                send_amount, 
                min_out, 
                [this.token_adr, WAVAX_ADDRESS], 
                address, 
                (new Date()).getTime() + 240 // TO-DO
            ).encodeABI(), 
            20000
        );
        
        console.log( txHash);
        return txHash;
    }

    async swapAllToAVAX(private_key){
        let address = web3.eth.accounts.privateKeyToAccount(private_key).address;
        console.log("1")
        await this.update(address);
        if( this.absolute_limit > 0){
            console.log("2")
            let amount = await this.getBalance(address); // get amount in Wei
            return this.swapToAVAX(private_key, amount, 0.005); // swap
        }
        throw new Error("absolute_limit should be positive");
    }
}