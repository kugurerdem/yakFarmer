class Account{
    constructor(private_key = null){
        this.private_key = private_key;
        this.address = private_key == null ? null : web3.eth.accounts.privateKeyToAccount(this.private_key).address;

        this.tokens = {
            "WAVAX" : new WavaxToken()
        }

        this.avax_balance = 0;
        this.wavax_balance = 0;
        this.token_balance = 0;
        this.total_balance = 0;
    }

    setPrivateKey(private_key){
        this.private_key = private_key;
        this.address = web3.eth.accounts.privateKeyToAccount(this.private_key).address;
        document.getElementById("accountID").innerHTML = this.address;
    }

    addToken(token){
        let token_name = token.token_name;
        this.tokens[token_name] = token;
    }

    async getBalance(){
        this.avax_balance = Number(web3.utils.fromWei( (await web3.eth.getBalance( this.address) ).toString(), "ether")); 
        // this.wavax_balance = await this.tokens["WAVAX"].getBalance( this.address)
        return this.avax_balance + this.wavax_balance;
    }

    async getTokenBalance(){
        let balances = []

        let keys = Object.keys(this.tokens);
        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            let token_balance = this.tokens[key].getBalanceInAVAX(this.address);
            balances.push( token_balance) 
        }

        balances = await Promise.all( balances);
        let sum = 0;
        for(let i = 0; i < balances.length; i++){
            sum += balances[i];
        }

        return sum;
    }

    async getTotalBalance(){
        let promises = await Promise.all([
            this.getBalance(), this.getTokenBalance()
        ]);

        this.total_balance = promises[0] + promises[1];
        return this.total_balance;
    }

    // returns the updates list of automated tokens
    async updateBalances(){
        let promises = [];
        let keys = Object.keys(this.tokens);
        for(let i = 0; i < keys.length; i++){
            let token = this.tokens[ keys[i]];
            if( token.auto_swap){
                promises.push( token.update(this.address));
            }
        }

        return Promise.all( promises);
    }

    // returns the token with maximum absolute_limit
    async tokenMaxAbsolute(){
        let tokens = await this.updateBalances(); 
        if( tokens.length > 0){
            tokens = tokens.sort( function(a, b){ return b.absolute_limit - a.absolute_limit})
            return tokens[0];
        }
        return null;
    }
}