class FarmView{
    constructor(farm_name, controller){
        this.farm_name = farm_name;
        this.controller = controller;
        this.farmer = controller.farmers[farm_name];

        this.dom_element = document.createElement("div");
        this.dom_element.className = "outerbox";
        document.getElementById("outerdiv").appendChild(this.dom_element);

        this.limit_input;
        this.checkbox;

        this.addLeftBoxInto(this.dom_element);
        this.addRightBoxInto(this.dom_element);        
    }

    // creates the left box
    addLeftBoxInto(parent){
        let view_element = document.createElement("div");
        view_element.id = this.farm_name;
        view_element.className = "leftbox";
        view_element.innerHTML = "<p>"+ this.farm_name + "</p>";

        parent.appendChild(view_element);
    }

    // creates the right box
    addRightBoxInto(parent){
        let control_element = document.createElement("div");
        control_element.className = "rightbox";

        this.addProfitInputAreaInto(control_element);
        this.addCheckBoxInto(control_element);
        this.addButtonInto(control_element);

        parent.appendChild(control_element);
    }

    addCheckBoxInto(parent){
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = this.farm_name+"_checkbox";

        let that = this;
        checkbox.addEventListener("change", function(){
            if(this.checked){
                // check whether a number is entered
                let lim = that.limit_input.value;
                if( isNumeric(lim) ){
                    lim = Number(lim);
                    if( lim > 0){
                        console.log(that.farm_name, " has been updated")
                        that.farmer.auto_mode = true;
                        that.farmer.updateProfitLim(lim);
                    } else{
                        console.log("profit limit should be positive.")
                    }
                }
            } else{
                that.farmer.auto_mode = false;
            }
        })
        
        let linebreak = document.createElement("br");
        parent.appendChild( checkbox);
        let p = document.createElement("text");
        p.innerHTML = "Activate bot <br> <br>";
        parent.appendChild(linebreak);
        parent.appendChild(checkbox)
        parent.appendChild(p);

        this.checkbox = checkbox;
    }

    addButtonInto(parent){
        let reinvest_button = document.createElement("button");
        reinvest_button.textContent = "reinvest";

        // EVENT-HANDLERS
        let that = this;
        reinvest_button.addEventListener("click", function(){
            console.log(that.controller.private_key);
            that.controller.farmers[that.farm_name].reinvest("0x"+that.controller.private_key).then( (result) => {
                console.log(result);
                alert("Transaction successfull, txHash is in the console!")
            }).catch( err => {
                console.log(err);
                alert("Could not transfer, error is in the console!")
            })
        })

        parent.appendChild(reinvest_button)
    }

    addProfitInputAreaInto(parent){
        let profit_limit_label = document.createElement("label");
        profit_limit_label.innerHTML = "Profit limit: ";

        let limit_input = document.createElement("input");
        limit_input.id = this.farm_name+"_limit";
        limit_input.setAttribute("size", "4");

        parent.appendChild(profit_limit_label);
        parent.appendChild(limit_input);

        let that = this;
        limit_input.addEventListener("input", function(){
            that.checkbox.checked = false;
        })

        this.limit_input = limit_input;
    }

    async update(){
        let farm_info = await this.controller.farmers[this.farm_name].calculateReward();
        let lastProfit = this.controller.farmers[this.farm_name].lastProfit;
        if( isNumeric(lastProfit))
            lastProfit = lastProfit.toFixed(6);
        let reinvestedByUs = this.controller.address.toLowerCase() == this.farmer.last_reinvestor.toLowerCase();

        let dom_element = document.getElementById(this.farm_name);
        let title_font = (farm_info.reward > farm_info.reinvest_cost) ? '<b> <font color="#008000">' : '<b> <font color="red">';
        let lastprofit_font = reinvestedByUs ? '<font color="#008000">' : '<font color="black">';
        let last_sender = reinvestedByUs ? "" : ' <a href="https://cchain.explorer.avax.network/address/' + this.farmer.last_reinvestor +'/transactions" target="_blank">(?)</a> ';
        let update_html = title_font + this.farm_name + "</font> </b> </br>";
        update_html += "reward: " + (farm_info.reward).toFixed(6) + "</br>";
        update_html += "cost   : " + farm_info.reinvest_cost.toFixed(6) + "</br>";
        update_html += "profit: " + (farm_info.reward - farm_info.reinvest_cost).toFixed(6) + "</br> </br>";
        update_html += "last p: " + lastprofit_font  + lastProfit + last_sender + "</font> </br>";
        dom_element.innerHTML = update_html;
    }
}