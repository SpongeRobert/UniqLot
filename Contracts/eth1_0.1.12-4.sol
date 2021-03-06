pragma solidity ^0.4.8;

// Contract that:
//      Lets anyone bet with 2 ethers
//      When it reaches 10 bets, contract randomly meshes gamblers addresses and pays prizes according to table:
//      
//      2.11 for 9 of 10 participants
//
//      and then transfers 1 ether to lottery profit distribution contract.


contract Lottery {

   function deleteContract() public onlyOwner  
   {
        refund();
        selfdestruct(owner);
   }

    string public contract_ver;
    mapping(uint => address) public gamblers;// A mapping to store ethereum addresses of the gamblers
    mapping(uint => address) public gamblers2;// A mapping to store play field gamblers
    mapping(uint => address) public gamblers_mesh;//A mapping to store random meshed field
    struct lastWinner {
        address addr;
        uint amount;
    }
    mapping (uint8 => lastWinner) public last_winners;
    uint8 public player_count; //keep track of how many people are signed up.
    uint public bet; //how big is the bet per person (in ether)
    uint internal win_pay; //winning
    uint8 public required_number_players; //how many signups triggers the lottery
    address internal owner; // owner of the contract
    address internal operator;
    address internal gasCompensateTo; //Last player activates a contract. More gas will be taken and needs to be compensated.
    uint bet_blocknumber; //block number on the moment the required number of players signed up
    uint8 internal rnd; // random number of gamblers2 for create mesh
    bool ContractState;    // Enable\disable to place new bets
    uint256 internal profit; //Summarizes lottery fees till they will reach profit payout level
    uint256 internal profit_max; //Activates profit payout
    uint256 bet_sum; //Sum of bets till required_number_players not reached
    address public profitDistributionContract;
    address internal thisContractAddress = this;

    event EndGame(address player, bool result, uint256 winning);
    event ProfitPaid(uint256 paid, uint blocknumber);
    
    //constructor
    function Lottery() public {
        owner = msg.sender;
        operator = msg.sender;    
        player_count = 0;
        bet = 20 ether;
        required_number_players = 10;
        contract_ver = "0.1.12-4";
        ContractState = true;
        profit = 0;
        profitDistributionContract = msg.sender;
        bet_sum = 0;
        profit_max = 0 ether;
        win_pay = bet+(55*bet/1000);
    }

    //adjust the bet amount
    function changeBet(uint newBet) public onlyOwner {
         if (newBet != uint(0)) {
            refund();
            bet = newBet*1000000000000000000;
            win_pay = bet+(55*bet/1000);
         }
    }

    //adjust profit_max
    function changeProfit(uint new_profit_max) public onlyOwner {
         if (new_profit_max != uint(0)) {
            profit_max = new_profit_max*1000000000000000000;
         }
    }

    function refund() public onlyOwner {
         if (player_count > 0) {
            for (uint8 r = 1; r <= player_count; r++) {
                gamblers[r].transfer(bet);
            }
            player_count = 0;
         }
         else return();
    }

    function payProfit() public onlyOwnerOrOperator {
        if (profitDistributionContract > 0 && profit >= profit_max) {
            uint256 paid = address(this).balance-bet_sum;
            if (profitDistributionContract.send(paid) == false) revert();
            emit ProfitPaid(paid, bet_blocknumber);
            profit = 0;
        }
    }

    function setProfitDistributionContract(address contractAddress) public onlyOwner
    {
      if (profitDistributionContract > 0) revert();
      profitDistributionContract = contractAddress;
    }


    // function when someone gambles a.k.a sends ether to the contract
    function () payable public {

    // If the bet is not equal to the "bet", send the money back.
    if(msg.value != bet) revert(); // give it back, revert state changes, abnormal stop
    
    player_count +=1;
    bet_sum = bet_sum+msg.value;

    gamblers[player_count] = msg.sender;
    
    // When we have enough participants, we will mix their numbers at random order. 
    if (player_count == required_number_players) {
        bet_blocknumber = block.number;
        gasCompensateTo = msg.sender;

            for (uint8 i = 1; i < 11; i++) {
                gamblers2[i]=gamblers[i];
            }

            for (uint8 k = required_number_players; k > 1; k--) {
                //rnd=uint(block.blockhash(block.number-1))%k;
                rnd=(uint8(block.blockhash(block.number-k))%k)+1;
                gamblers_mesh[k]=gamblers2[rnd];
                gamblers2[rnd] = 0;
                for (uint8 j = 1; j < k; j++) {
                    if (gamblers2[j] == 0) {
                        gamblers2[j]=gamblers2[j+1];
                        gamblers2[j+1] = 0;
                    }
                }
            }
            
            //gamblers payout cycle 
            for (uint8 w = required_number_players; w > 1; w--) {
            if (gamblers_mesh[w].send(win_pay) == true) {
                bet_sum -= win_pay;
                last_winners[w-1] = lastWinner(gamblers_mesh[w], win_pay);
            }
            else
                 emit EndGame(gamblers_mesh[w], false, 0);
            }

            emit EndGame(gamblers2[1], false, 0);
            last_winners[10] = lastWinner(gamblers2[1], 0);
            profit += bet_sum;
            bet_sum = 0;
            player_count = 0;

//            // temporary profit payout function
//            if (owner.send(bet/2) == true) {
//                profit = 0;
//                 emit ProfitPaid(bet/2, bet_blocknumber);
//            }
            

        }
    }

    modifier onlyOwner() 
    {
       if (msg.sender != owner) revert();
       _;
    }

    modifier onlyOwnerOrOperator() 
    {
       if (msg.sender != owner && msg.sender != operator) revert();
       _;
    }

    function disableBetting_only_Dev() public onlyOwnerOrOperator
    {
        ContractState=false;
    }

    function enableBetting_only_Dev() public onlyOwnerOrOperator
    {
        ContractState=true;
    }

    function changeOperator(address newOperator) public onlyOwner
    {
       operator = newOperator;
    }

}
