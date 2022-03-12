class AccountView{
    constructor(account = null){
        this.account = account;

        this.dom = document.getElementById("account_div");

        // ADD TITLE
        let title = document.createElement("h3");
        title.innerText = "Balance";
        this.dom.appendChild(title);

        // SHOW TOTAL BALANCE
        this.total_balance = document.createElement("text")
        this.total_balance.innerText = "TOTAL: "
        this.dom.appendChild( this.total_balance)
        this.dom.appendChild( document.createElement('br') ) // linebreak

        // SHOW TOTAL AVAX BALANCE
        this.avax_balance = document.createElement("text");
        this.avax_balance.innerText = "AVAX: "
        this.dom.appendChild(this.avax_balance)
        this.dom.appendChild( document.createElement('br') ) // linebreak

        this.selector = document.createElement("select");
        this.dom.appendChild(this.selector);

        // 
        this.token_balance = document.createElement("text");
        this.token_balance.innerText = " : "
        this.dom.appendChild(this.token_balance);

        this.dom.appendChild( document.createElement('br') )
        this.dom.appendChild( document.createElement('br') )


        // add textarea
        this.token_amount = document.createElement("input")
        this.token_amount.setAttribute("size","3");
        this.dom.appendChild( this.token_amount)

        let text = document.createElement('text');
        text.innerText = "  ";
        this.dom.appendChild(text)

        this.convert_text = document.createElement("text")
        this.convert_text.innerText = "to AVAX."
        this.dom.appendChild( this.convert_text);
        
        text = document.createElement('text');
        text.innerText = "  ";
        this.dom.appendChild(text)

        this.convert_button = document.createElement("button")
        this.convert_button.textContent = "CONVERT"
        this.dom.appendChild( this.convert_button);

        // 
        this.dom.appendChild( document.createElement('br'))
        let swap_lim_label = document.createElement("text");
        swap_lim_label.innerText = "Swap limit : "
        this.swap_lim = document.createElement("input");
        this.swap_lim.setAttribute("size", "3")
        this.dom.appendChild(swap_lim_label)
        this.dom.appendChild(this.swap_lim)
        // CHECKBOX
        text = document.createElement('text');
        text.innerText = "  ";
        this.dom.appendChild(text)

        this.checkbox = document.createElement("input");
        this.checkbox.type = "checkbox";
        let textcheck = document.createElement("text");
        textcheck.innerText = "Auto swap";

        this.dom.appendChild(textcheck)
        this.dom.appendChild(this.checkbox)

        let that = this;
        this.selector.addEventListener("click", async function(){
            that.updateToken();

            // update checkbox
            let token_name = this.options[this.selectedIndex].text;
            let token = that.account.tokens[token_name];

            that.checkbox.checked = false;
            that.swap_lim.value = 0;
            if( token.auto_swap){
                that.checkbox.checked = true;
                that.swap_lim.value = token.swap_lim;
            }
        })

        this.dom.addEventListener("click", async function(){
            that.update();
        })

        this.token_amount.addEventListener("input", async function(){
            let val = this.value;
            let token_name = that.selector.options[that.selector.selectedIndex].text;
            let token = that.account.tokens[token_name];

            if( val == "" ){
                that.convert_text.innerText = token_name + " to 0 AVAX"; 
            } else if( isNumeric(val)){
                val = Number(val).toString();
                let avax_amount = Number( web3.utils.fromWei( await token.getAmountOut( val), "ether"));
                that.convert_text.innerText = token_name + " to " + Number(avax_amount.toFixed(4)) + " AVAX"; 
            }
        })
        
        this.convert_button.addEventListener("click", async function(){
            let token_name = that.selector.options[that.selector.selectedIndex].text;
            let pk = that.account.private_key;

            await that.account.tokens[token_name].swapToAVAX("0x"+pk, that.token_amount.value);      
        })

        this.checkbox.addEventListener("change", function(){
            let token_name = that.selector.options[that.selector.selectedIndex].text;
            let token = that.account.tokens[token_name];
            if( this.checked ){
                // get the data written in swap_lim
                let swap_lim = that.swap_lim.value;
                if( isNumeric(swap_lim)){
                    swap_lim = Number(swap_lim);
                    // change token's swap_lim
                    token.swap_lim = swap_lim;
                    token.auto_swap = true;
                }
                
            } else{
                // change token's auto_mode
                token.auto_swap = false;
            }
        })
    }

    async init(){
        if( this.account != null){
            let keys = Object.keys( this.account.tokens)
            for(let i = 0; i < keys.length; i++){
                let TOKEN_NAME = keys[i];
                let option = document.createElement("option");
                option.value = i;
                option.text = TOKEN_NAME;
                this.selector.add(option);
            }
        }
    }

    async updateToken(){
        let token_name = this.selector.options[this.selector.selectedIndex].text;
        let token = this.account.tokens[token_name];

        // calculate stuff
        let acc_addr = this.account.address;
        let balances = await Promise.all( [token.getBalance(acc_addr), token.getBalanceInAVAX(acc_addr)] ) ;
        let token_amount = Number(balances[0]).toFixed(4).toString();
        let avax_amount = Number(balances[1]).toFixed(4).toString();

        this.token_balance.innerText = " : " + token_amount + "(" + avax_amount + " AVAX)";
    }

    // TO-DO
    async update(){
        let promises = await Promise.all([
            this.account.getBalance(),
            this.account.getTotalBalance()
        ])

        let balance = promises[0];
        let total = promises[1];

        this.avax_balance.innerText = "AVAX: " + balance; 
        this.total_balance.innerText = "TOTAL: " + total; 

        this.updateToken();     
    }
}