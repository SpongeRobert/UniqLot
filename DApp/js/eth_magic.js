window.addEventListener('load', function() {
            if (typeof web3 !== 'undefined') 
            {
            startApp(web3);
            } 
            else 
            { 
              $('#metamask_alert_message').html(gametext.error[0]);
              $('#metamask_alert').modal('show');
            }
            });
   // WEB3 INIT DONE!
  
      const contract1_address = "0x8B1A8FfbA36D5D985FAB608a91ACE6925233162E";
      const contract3_address = "0x6C6e5CE2FE5FA52681812348da935284504Cb060";
      const contract4_address = "0xBd90DFb22363077791A054b3A3Fe74AEB8828BbF";

      var account =  web3.eth.accounts[0];

      game = [];
      game1 = [];
      game3 = [];
      game4 = [];
      game1.default_gas_price = web3.toHex(5000000000);
      game3.default_gas_price = web3.toHex(5000000000);
      game4.default_gas_price = web3.toHex(5000000000);
//      game.time = 0;
//      game.expiretime = 0;
//      game.price = 0;
//      game.ethbalance = 0;

//      game.referee = referre_manager();

      window.windowage = 0;
//      game.ethpot = 0;
      game1.ethclickprice = 0;
      game3.ethclickprice = 0;
      game4.ethclickprice = 0;
//      game.your_click = 0;
//      game.your_time = 0;
//      game.reffered_count = 0;
//      game.reffer_pot = 0;
//      game.loaded = 0;
      game1.leaderboard = [];
      game1.winning = [];
      game3.leaderboard = [];
      game3.winning = [];
      game4.leaderboard = [];
      game4.winning = [];
//      game.over = 0;
      

      function referre_manager()
      {
        let refferal =  getParameterByName('reff');

        if(refferal)
        {
          Cookies.remove("referral_cookie", { path: '/' });
          Cookies.set("referral_cookie", refferal, { expires: 7, path: '/' });
          return refferal;
        }

        if(Cookies.get('referral_cookie'))
        {
          return Cookies.get('referral_cookie');
        }

        return "0x0000000000000000000000000000000000000000";
      }      




      function startApp(web3) 
      {
         web3 = new Web3(web3.currentProvider);

          contract_init(); // GAME LOAD!
      }    

      function contract_init()
      {

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {
          $('#user_address').html(web3.eth.accounts[0]);

          game.user_address = web3.eth.accounts[0];

          // CALLBACK IN GAME.JS!!!!
          ethbutton1_contract = web3.eth.contract(abi1).at(contract1_address);
          ethbutton3_contract = web3.eth.contract(abi3).at(contract3_address);
          ethbutton4_contract = web3.eth.contract(abi4).at(contract4_address);


            ethbutton1_contract.player_count.call({},function(err,ress)
            {
              if(!err)
                  {
                    game1.totalclick = ress.toNumber();
                    console.log("Total Click1: "+ress); 
                  } 
            });

            ethbutton3_contract.player_count.call({},function(err,ress)
            {
              if(!err)
                  {
                    game3.totalclick = ress.toNumber();
                    console.log("Total Click3: "+ress); 
                  } 
            });

            ethbutton4_contract.player_count.call({},function(err,ress)
            {
              if(!err)
                  {
                    game4.totalclick = ress.toNumber();
                    console.log("Total Click4: "+ress); 
                  } 
            });

            ethbutton1_contract.bet.call({},function(err,ress)
            {
              if(!err)
                  {
                    game1.clickprice = ress;
                    game1.ethclickprice = web3.fromWei(ress,'ether');
                    console.log("Click Price: "+ress); 
                  } 
            });

            ethbutton3_contract.bet.call({},function(err,ress)
            {
              if(!err)
                  {
                    game3.clickprice = ress;
                    game3.ethclickprice = web3.fromWei(ress,'ether');
                    console.log("Click Price: "+ress); 
                  } 
            });

            ethbutton4_contract.bet.call({},function(err,ress)
            {
              if(!err)
                  {
                    game4.clickprice = ress;
                    game4.ethclickprice = web3.fromWei(ress,'ether');
                    console.log("Click Price: "+ress); 
                  } 
            });

	    for (let i = 1; i <=10; i++){
		ethbutton1_contract.last_winners.call(i,function(err,ress)
		{
		 game1.leaderboard[i] = ress[0].toString();
		 game1.winning[i] = ((ress[1]["c"][0])/10000).toString();
//	    	 console.log ('Gamblers '+i+' '+ress);
//	    	 console.log ((ress[1]["c"][0])/10000);
		});
	    };
	    
	    for (let i = 1; i <=10; i++){
		ethbutton3_contract.last_winners.call(i,function(err,ress)
		{
		 game3.leaderboard[i] = ress[0].toString();
		 game3.winning[i] = ((ress[1]["c"][0])/10000).toString();
//	    	 console.log ('Gamblers '+i+' '+ress);
//	    	 console.log ((ress[1]["c"][0])/10000);
		});
	    };

	    for (let i = 1; i <=10; i++){
		ethbutton4_contract.last_winners.call(i,function(err,ress)
		{
		 game4.leaderboard[i] = ress[0].toString();
		 game4.winning[i] = ((ress[1]["c"][0])/10000).toString();
//	    	 console.log ('Gamblers '+i+' '+ress);
//	    	 console.log ((ress[1]["c"][0])/10000);
		});
	    };


          // GET ETH BALANCE OF USER
          web3.eth.getBalance(game.user_address,function(err,ress){
           if(!err)
           {
             game.ethbalance = web3.fromWei(ress,'ether'); ;
             console.log("ETH balance: "+game.ethbalance+" Ether"); 
           } 
          });


          // WHY IT IS SO UGLY JS WHY?!
         (async ()=> { await web3.eth.getBlockNumber(
           function(err,ress)
           {
            web3.eth.getBlock(ress,function(err,ress){

              if(!ress)
              {
                setTimeout(function () {contract_init()}, 2000);
              }
              else
              {
              game.time = ress.timestamp;
              }

            });
           }
         ) })();

        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }


      function click_the_button1()
      {

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton1_contract = web3.eth.contract(abi1).at(contract1_address);

/*          if( parseInt(game.referee) == parseInt(account))
          {
            game.referee = "0x0000000000000000000000000000000000000000";
          }

          console.log("Referral: "+game.referee);

          ethbutton_contract.ButtonClicked.sendTransaction(account,{from:account,value: game.clickprice,gasPrice: game.default_gas_price},function(err,ress)
          {
            waitForReceipt(ress, function (receipt) 
            {
              console.log('Force!');
              contract_init();
            });  
          }
        );
*/
	web3.eth.sendTransaction({from: account, to: contract1_address, value: game1.clickprice, gas: 2000000}, function(err, transactionHash){
	    if (!err)
	    console.log(transactionHash);
	});
        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }

      function click_the_button3()
      {

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton3_contract = web3.eth.contract(abi3).at(contract3_address);

/*          if( parseInt(game.referee) == parseInt(account))
          {
            game.referee = "0x0000000000000000000000000000000000000000";
          }

          console.log("Referral: "+game.referee);

          ethbutton_contract.ButtonClicked.sendTransaction(account,{from:account,value: game.clickprice,gasPrice: game.default_gas_price},function(err,ress)
          {
            waitForReceipt(ress, function (receipt) 
            {
              console.log('Force!');
              contract_init();
            });  
          }
        );
*/
	web3.eth.sendTransaction({from: account, to: contract3_address, value: game3.clickprice, gas: 2000000}, function(err, transactionHash){
	    if (!err)
	    console.log(transactionHash);
	});
        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }

      function click_the_button4()
      {

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton4_contract = web3.eth.contract(abi4).at(contract4_address);

/*          if( parseInt(game.referee) == parseInt(account))
          {
            game.referee = "0x0000000000000000000000000000000000000000";
          }

          console.log("Referral: "+game.referee);

          ethbutton_contract.ButtonClicked.sendTransaction(account,{from:account,value: game.clickprice,gasPrice: game.default_gas_price},function(err,ress)
          {
            waitForReceipt(ress, function (receipt) 
            {
              console.log('Force!');
              contract_init();
            });  
          }
        );
*/
	web3.eth.sendTransaction({from: account, to: contract4_address, value: game4.clickprice, gas: 2000000}, function(err, transactionHash){
	    if (!err)
	    console.log(transactionHash);
	});
        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }

      function game_over(){

        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton1_contract = web3.eth.contract(abi).at(contract1_address);

          ethbutton1_contract.DistributeButtonIncome.sendTransaction({from:account,gasPrice: game.default_gas_price},function(err,ress)
          {
            waitForReceipt(ress, function (receipt) 
            {
              console.log('Force!');
              contract_init();
            });  
          }
        );


        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  

      }

       function GetPlayerAt(id)
       {

         ethbutton1_contract.GetPlayerAt.call(id, {from:account},function(err,ress)
           {
             if(!err)
             {
                 return ress.toString();

             } 
             else
             {
                 console.log(err);
             }
           });
 
       }

    
      function debug_devfund()
      {
        if(typeof web3.eth.accounts[0]  != 'undefined')
        {

          ethbutton_contract = web3.eth.contract(abi).at(contract_address);

          ethbutton_contract.WithdrawDevFunds.sendTransaction({from:account,gasPrice: game.default_gas_price},callback);
        }
        else // No Metamask Address Found!
        {
          $('#metamask_alert_message').html(gametext.error[1]);
          $('#metamask_alert').modal('show');
        }  
      }
  



function callback (error, result)
{
        if(!error)
        {
          console.log(result);
        } 
        else
        {
            console.log(error);
        }
};


function waitForReceipt(hash, callback) {
  web3.eth.getTransactionReceipt(hash, function (err, receipt) {
    if (err) {
      error(err);
    }

    if (receipt !== null) {
      // Transaction went through
      if (callback) {
        callback(receipt);
      }
    } else {
      // Try again in 1 second
      window.setTimeout(function () {
        waitForReceipt(hash, callback);
      }, 1000);
    }
  });
}

function toETH(number)
{
  return web3.fromWei(number,'ether');
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results === null) {
      return "";
  } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}
