class Controller{
    private_key

    constructor(private_key = null){
        this.private_key = private_key;
        this.address = web3.eth.accounts.privateKeyToAccount(this.private_key).address;
        this.farmers = {}; // 
        this.views = {}; // DOM elements
        this.account = new Account(private_key);
        this.accountView = new AccountView( this.account);

        this.auto_mode = false;
        this.busy = false;

        this.wallet_lim = 1;

        // handler(s)
        let that = this;
        document.getElementById("connect").addEventListener("click", function(){
            let private_key = document.getElementById("privatekey").value;
            that.setPrivateKey(private_key);
            document.getElementById("privatekey").value = "";

            that.accountView.update();
        })

        document.getElementById("activateBot").addEventListener("click", function(){
            if( that.auto_mode){
                that.deactivateBot();
                this.textContent = "Activate bot!";
                that.auto_mode = false;

            } else{
                let success = that.activateBot();
                if( success){
                    // change button content
                    that.auto_mode = true;
                    this.textContent = "Deactivate bot!";
                }
            }
        })

        document.getElementById("fill_check").addEventListener("click", function(){
            let lim = document.getElementById("profit_limit").value;
            if( !isNumeric(lim) ){
                alert("Limit should be a number");
            } else{
                lim = Number( lim);

                let keys = Object.keys(that.farmers);
                for(let i = 0; i < keys.length; i++){
                    let farm_name = keys[i];
                    document.getElementById(farm_name+"_limit").value = lim;
                    document.getElementById(farm_name + "_checkbox").checked = true;
                }
            }
        })

        document.getElementById("reset_limit").addEventListener("click", function(){
            let keys = Object.keys(that.farmers);
            for(let i = 0; i < keys.length; i++){
                let farm_name = keys[i];
                document.getElementById(farm_name + "_checkbox").checked = false;
                document.getElementById(farm_name+"_limit").value = "";
            }
        })

        document.getElementById("update_wallet_lim").addEventListener("click", function(){
            let wallet_lim = document.getElementById("wallet_limit").value;
            if( !isNumeric(wallet_lim)){
                alert("Limit should be a number");
            } else{
                that.wallet_lim = Number( wallet_lim );
            }
        })

        document.getElementById("reloadProfit").addEventListener("click", function(){
            let keys = Object.keys(that.farmers);
            for(let i = 0; i < keys.length; i++){
                let farm_name = keys[i];
                that.farmers[farm_name].getLastProfit();
            }
        })
    }

    // Activates the bots for checked farms
    activateBot(){
        let success = true;

        let keys = Object.keys(this.farmers);
        for(let i = 0; i < keys.length; i++){
            // iterate all checkboxes
            let farm_name = keys[i];
            let check_box = document.getElementById(farm_name + "_checkbox");
            let limit = document.getElementById(farm_name+"_limit").value;
            
            if( !check_box.checked){
                this.farmers[farm_name].auto_mode = false;
            } else if(isNumeric(limit)){
                limit = Number(limit);
                if( limit > 0){
                    this.farmers[farm_name].auto_mode = true;
                    this.farmers[farm_name].updateProfitLim(limit);
                    this.farmers[farm_name].profit_lim = limit;
                } else{
                    alert("Limit can only be a positive number!");
                    this.deactivateBot();
                    success = false;
                    break;
                }
            }
        }

        return success;
    }

    // Deactivates the bots
    deactivateBot(){
        let keys = Object.keys(this.farmers);
            for(let i = 0; i < keys.length; i++){
                let farm_name = keys[i];
                this.farmers[farm_name].auto_mode = false;
            }
    }
    
    setPrivateKey(private_key){
        this.private_key = private_key;
        this.account.setPrivateKey(private_key);
        
        this.address = web3.eth.accounts.privateKeyToAccount(this.private_key).address;
        document.getElementById("accountID").innerHTML = this.address;
    }
    
    // adds the farmers in the platform to the controller
    addPlatform(platform){
        let token = platform.token;

        let farms = platform.farms;
        for(let i = 0; i < farms.length; i++){
            let farm = farms[i];
            this.addFarmer( farm.name, farm.contract, token);
        }
    }

    // adds a farmer both to the view and to the model
    addFarmer(farm_name, yak_contract, token){
        // add farmer
        let farmer = new Farmer(farm_name, yak_contract, token);
        this.farmers[farm_name] =  farmer;

        // add view
        this.views[farm_name] = new FarmView(farm_name, this);
    }

    async update(){
        let keys = Object.keys(this.farmers);  
        let automated_farmers = [];

        // update farms
        for(let i = 0; i < keys.length; i++){
            let farm_name = keys[i];
           
            this.updateDOM(farm_name);  // update the view
            if(this.farmers[farm_name].auto_mode){
                automated_farmers.push(this.farmers[farm_name] )
            }
        }

        // update balances
        this.updateAccount();

        // sort the automated farmers by absolute profit
        automated_farmers = automated_farmers.sort( function(a, b){ return b.absolute_profit - a.absolute_profit })
        if( automated_farmers.length > 0){
            this.updateFARM(automated_farmers[0].farm_name); // update the model
        }
    }

    async updateAccount(){
        if( this.auto_mode ){ 
            let token = await this.account.tokenMaxAbsolute();
            if( !this.busy & token != null){
                // check if the avax amount exceeds swap_limit
                if( token.absolute_limit > 0){
                    console.log("Swap request.. Automode suspended. (", token.token_name, ")");
                    this.busy = true;
                    
                    // swap
                    let that = this;
                    token.swapAllToAVAX("0x"+that.private_key)
                        .then( (txHash) => { console.log("Transaction", txHash, "is successfull. Automode reactivated.") })
                        .catch( (err) => {  console.log(err) })
                        .finally( () => { that.busy = false; });
                }
            }
        }
    }
    
    // TO-DO: Should be updated
    async updateFARM(farm_name){
        let avax_amount = Number( web3.utils.fromWei(await web3.eth.getBalance(this.address), 'ether'));
        let farmer = this.farmers[farm_name];

        if( this.auto_mode & farmer.auto_mode & avax_amount > this.wallet_lim){
            if( !this.busy){
                this.busy = true;
                console.log("Transaction request.. Automode suspended. (", farm_name, ")")
                
                let that = this;
                farmer.autoReinvest("0x"+that.private_key)
                    .then( (txHash) => { console.log("Transaction", txHash, "is successfull. Automode reactivated.") })
                    .catch( (err) => { console.log(err.message) })
                    .finally( () => { that.busy = false });
            }
        }
    }

    async updateDOM(farm_name){
        this.views[farm_name].update();
    }
}
