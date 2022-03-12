class Platform{
    constructor(_token){
        this.token = _token;
        this.name = _token.token_name;
        this.farms = [];
    }

    addFarm(_name, _contract_address){
        let farm = new Farm(_name, _contract_address, this.token);
        this.farms.push( farm);
    }

    getContracts(){
        let arr = [];
        for(let i = 0; i < this.farms.length; i++){
            arr.push( this.farms[i].contract );
        }
        return arr;
    }
}


class Farm{
    constructor(_name, _contract_address, _token){
        this.name = _name;
        this.contract_address = _contract_address;
        this.token = _token;

        this.contract = new web3.eth.Contract( yak_contract_abi, this.contract_address);
    }
}