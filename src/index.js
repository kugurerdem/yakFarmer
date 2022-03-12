init().then( (result) => {
    console.log("initialized.")
    main();
}).catch( (reason) => {
    console.log("Initialization failed.", reason)
})

let farm;

// THE BELOVE VARIABLES HAVE DUMMIE VALUES, IT IS NOT AN ACTUAL ACCOUNT
let address = "0xbb8fA01f25Cc169624154a85D668cF433e126d7c" // dummie value
let private_key = "9ca15f3890aada983e13bd79a7897b63c86bac7e8db7ce10e3c37d6f53dba493" // DO NOT GET HYPED, THIS is a dummie value :D

let controller = new Controller(private_key);

async function main(){
    // controller.addPlatform(OlivePlatform);
    // controller.addPlatform(ZeroPlatform);
    // controller.addPlatform(PangolinPlatform);
    // controller.addPlatform(YetiPlatform);
    // controller.addPlatform(PefiPlatform);
    // controller.addPlatform(LydiaPlatform);
    // controller.addPlatform(ElkPlatform);
    // controller.addPlatform(BagPlatform);
    // controller.addPlatform(GondolaPlatform);
    controller.addPlatform(BirdPlatform);
    controller.addPlatform(JoePlatform);
   
    controller.account.addToken(OLIVE_TOKEN)
    controller.account.addToken(ZERO_TOKEN)
    controller.account.addToken(PNG_TOKEN)
    controller.account.addToken(YTS_TOKEN)
    controller.account.addToken(PEFI_TOKEN)
    controller.account.addToken(LYD_TOKEN)
    controller.account.addToken(ELK_TOKEN)
    controller.account.addToken(BAG_TOKEN)
    controller.account.addToken(GDL_TOKEN)
    controller.account.addToken(BIRD_TOKEN)
    controller.account.addToken(XAVA_TOKEN)
    controller.accountView.init();

    // controller.addFarmer("SNOB-AVAX", avax_snob_contr, avax_snob_lp, pangolin_router, SNOB) // SNOB-AVAX
    // controller.addFarmer("S-AVAX-PNG", avax_png_contr, avax_snob_lp, pangolin_router, SNOB) // SNOB-AVAX
    
    // farm.showProfitableFarms();

    loop();
}

async function loop(){
    controller.update();
    setTimeout(loop, 3000); 
}
