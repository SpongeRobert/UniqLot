function update_dash()
{

    if(game1.totalclick >= 0)
    {
    $('#clicked1').html(game1.totalclick);

    $('#eth_button1').html('Bet '+game1.ethclickprice+' '+'<i class="fab fa-ethereum"></i>');     
    }

    if(game3.totalclick >= 0)
    {
    $('#clicked3').html(game3.totalclick);

    $('#eth_button3').html('Bet '+game3.ethclickprice+' '+'<i class="fab fa-ethereum"></i>');     
    }

    if(game4.totalclick >= 0)
    {
    $('#clicked4').html(game4.totalclick);

    $('#eth_button4').html('Bet '+game4.ethclickprice+' '+'<i class="fab fa-ethereum"></i>');     
    }


    if(game.your_click > 0 && game.loaded==0)
    {
        $('#personal_stat').html('You have been clicked the Button '+game.your_click+'x times. Best time: '+countdown(game.your_time)+url_generator(account)+reff_data(game.reffered_count,game.reffer_pot));
        game.loaded = 1;
    }


    if(game.over == 1)
    {
        $('#debug').show();

    }


}



function delay(fulltime,distance)
{
    return fulltime-distance;
}


function reff_data(count,pot)
{
        if(count > 0)
        {
            let pot_text = "";

            if(pot>=0.0001)
            {
            pot_text = "<br>Your referral share = "+pot+' <i class="fab fa-ethereum"></i>';
            }

        return "<br> You have "+count+" referrals. "+pot_text;
        }
    return "";
}

function url_generator(address)
{

  return '<br> Your referral link: <a href="'+location.protocol + '//' + location.host + location.pathname+'?reff='+address+'" target="_blank"> '+location.protocol + '//' + location.host + location.pathname+'?reff='+address+'</a>';

}


function update_leaderboard()
{      
       let counter = 10;

       $('#last_clickers1').html('');

       let content1 = "";

       for (let index = 1; index <= 10; index++)
       {
        number = index+1;  

        if( parseInt(game1.leaderboard[index]) == parseInt(account)){
            content1 += '<tr><th class="text-dark" scope="row">'+index+'<td> <b>Your account</b></td><td><b>'+game1.winning[index]+'</td></b></tr>';
        }
        else
        {
            content1 += '<tr><th class="text-dark" scope="row">'+index+'<td><div style="width: 220px; overflow: hidden;">'+game1.leaderboard[index]+'</div></td><td>'+game1.winning[index]+'</td></tr>';  
        }


       }  


       $('#last_clickers1').html(content1);
       $('#address1').html(contract1_address);


       $('#last_clickers3').html('');

       let content3 = "";

       for (let index = 1; index <= 10; index++)
       {
        number = index+1;  

        if( parseInt(game3.leaderboard[index]) == parseInt(account)){
            content3 += '<tr><th class="text-dark" scope="row">'+index+'<td> <b>Your account</b></td><td><b>'+game3.winning[index]+'</td></b></tr>';
        }
        else
        {
            content3 += '<tr><th class="text-dark" scope="row">'+index+'<td><div style="width: 220px; overflow: hidden;">'+game3.leaderboard[index]+'</div></td><td>'+game3.winning[index]+'</td></tr>';  
        }


       }  


       $('#last_clickers3').html(content3);
       $('#address3').html(contract3_address);



       $('#last_clickers4').html('');

       let content4 = "";

       for (let index = 1; index <= 10; index++)
       {
        number = index+1;  

        if( parseInt(game4.leaderboard[index]) == parseInt(account)){
            content4 += '<tr><th class="text-dark" scope="row">'+index+'<td> <b>Your account</b></td><td><b>'+game4.winning[index]+'</td></b></tr>';
        }
        else
        {
            content4 += '<tr><th class="text-dark" scope="row">'+index+'<td><div style="width: 220px; overflow: hidden;">'+game4.leaderboard[index]+'</div></td><td>'+game4.winning[index]+'</td></tr>';  
        }


       }  


       $('#last_clickers4').html(content4);
       $('#address4').html(contract4_address);

};


$( document ).ready(function() {

        function update(){

            update_dash();
            update_leaderboard();
        };


    

        setInterval(update, 3000); // Main Loop every 3000ms

        setInterval(startTime, 3000);

        function startTime() {
            window.windowage = window.windowage+1;
        }     
});