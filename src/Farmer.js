class Farmer{
    // Constructor
    constructor(_farm_name, _yak_contract, _token){
        // Contract and address informations
        this.farm_name = _farm_name;
        this.yak_contract = _yak_contract;

        this.token = _token;

        // To prevent double spends
        this.lastActiveBlock = 0; 

        // Automode variables
        this.auto_mode = false;
        this.profit_lim = Number.MAX_SAFE_INTEGER;

        //
        this.absolute_profit = 0; // supposed to be (profit - profit_lim)

        // 
        this.tokenReward;
        this.lastProfit; 
        this.last_reinvestor = "_";
        
        let that = this;
        this.getLastProfit().then( (val) => {
            that.lastProfit = val;
        })

        this.getTokenRewardAmount().then( (val) => {
            that.tokenReward = val;
        })

        // Event subscription
    }

    updateProfitLim(lim){
        this.profit_lim = lim;
    }

    // reinvests using the privateKey to the given contract
    async reinvest(privateKey, auto_mode = false){
        let currentBlockNum = await web3.eth.getBlockNumber();
        if( currentBlockNum - this.lastActiveBlock < 3){
            // alert("Already made transaction in this block!");
            throw new Error("Already made transaction recently");
        } else{
            let r = await this.calculateReward();
            let profit = r.reward - r.reinvest_cost;
            let limit = auto_mode ? this.profit_lim : 0;
            if( profit < limit){
                throw new Error("You cannot make a transaction with negative profit!");
            } else if( profit >= limit){
                let that = this;
                // this.lastActiveBlock = currentBlockNum;
                let gasSlippage = 20000;
                let txHash = writeContract(privateKey, this.yak_contract, this.yak_contract.methods.reinvest().encodeABI(), gasSlippage);
                txHash.then( async (val) => {
                    that.lastActiveBlock = await web3.eth.getBlockNumber();
                    that.updateProfitLim(that.profit_lim);
                })

                return txHash;
            }
        }
    }

    // reinvesting function for automode
    async autoReinvest(privateKey){
        if( this.auto_mode)
            return this.reinvest(privateKey, true);
        throw new Error("Automod is not activated.");
    }

    
    // returns an object which contains reward, reinvest cost and swap cost
    async calculateReward(){
        // Make parallel requests
        let promises = await Promise.all([
            this.getReward(),
            this.getReinvestCost()
        ])
        
        // Get the finished requests
        let reward = promises[0];
        let reinvest_cost = promises[1];

        // Calculation
        let profit = reward - reinvest_cost;
        this.absolute_profit = profit - this.profit_lim;

        return {
            reward: reward,
            reinvest_cost: reinvest_cost
        }
    }

    async getTokenRewardAmount(){
        return web3.utils.fromWei(await this.yak_contract.methods.checkReward().call(), 'ether');
    }

    async getReward(){
        // Make parallel requests
        let promises = await Promise.all([
            this.yak_contract.methods.estimateReinvestReward().call(), 
            this.token.getTokenPrice()
        ]);
        
        // Get the finished requests
        let reward = promises[0];
        let token_price = promises[1];
        // console.log(reward);
        // Calculation
        let amount =  web3.utils.fromWei(reward, 'ether');
        if( this.tokenReward > amount){
            this.getLastProfit().then( (val) => {
                console.log("The new last profit from", this.farm_name, "is:", val);
            }).catch( (err) => {
                console.log("Could not calculate last profit for", this.farm_name)
            })
        }

        this.tokenReward = amount;
        return amount * token_price;
    }

    // returns the cost of reinvesting price in terms of avax
    async getReinvestCost(){
        return await calculateGasFee({
            to: this.yak_contract.options.address,
            from: "0x34B097802286D9F0e0f6F0f19E1CA67Ac75B4Da2", // this part does not matter
            data: this.yak_contract.methods.reinvest().encodeABI()
        });
    }

    async getLastProfit(){
        // Make parallel requests
        let promises = await Promise.all([
            this.getLastRewardInAVAX(), 
            this.getReinvestCost()
        ]);

        // Get the finished requests
        let reward = promises[0];
        let fee = promises[1];

        // Calculation
        this.lastProfit = reward - fee;
        return this.lastProfit;
    }

    async getLastReward(){
        let last_reinvest = await this.getLastReinvest();
        let txHash = last_reinvest.transactionHash;
        let Tx = await web3.eth.getTransactionReceipt(txHash);
        let from = Tx.from; // creator of the transaction
        this.last_reinvestor = from;

        let profit = NaN;
        let TRANSFER_EVENT = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
        for(let i = 0; i < Tx.logs.length; i++){
            if( Tx.logs[i].topics.length > 2){
                let event = Tx.logs[i].topics[0];
                
                if( event == TRANSFER_EVENT){
                    let _reciever = Tx.logs[i].topics[2];
                    let reciever = "0x"+_reciever.substr(_reciever.length - from.length + 2, _reciever.length)

                    if( reciever == from){
                        profit = Number( web3.utils.fromWei(Tx.logs[i].data, "ether"));   
                    }
                }
            }
        }

        return profit;
    }

    async getLastRewardInAVAX(){
        // Make parallel requests
        let promises = await Promise.all([
            this.getLastReward(), 
            this.token.getTokenPrice()
        ]);

        // Get the finished requests
        let token_profit = promises[0];
        let token_price = promises[1];

        // Calculation
        return token_profit * token_price
    }

    async getLastReinvest(){
        let lastBlock = await web3.eth.getBlockNumber();
        let reinvest = await this._getLastReinvest(lastBlock);
        return reinvest;
    }

    // 
    async _getLastReinvest(_lastBlock){
        let _fromBlock = _lastBlock - 500;
        let reinvests = await this.yak_contract.getPastEvents("Reinvest", {fromBlock: _fromBlock , toBlock: _lastBlock});
        if( reinvests.length > 0)
            return reinvests[reinvests.length - 1];
        return this._getLastReinvest(_fromBlock);
    }
}