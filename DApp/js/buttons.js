
// START GAME BUTTON
$(function(){
    $("#eth_button1").click(function(event){
        event.preventDefault();
        click_the_button1();
    });
});

$(function(){
    $("#eth_button3").click(function(event){
        event.preventDefault();
        click_the_button3();
    });
});

$(function(){
    $("#eth_button4").click(function(event){
        event.preventDefault();
        click_the_button4();
    });
});

$(function(){
    $("#copy_button1").click(function(event){
        event.preventDefault();
	navigator.clipboard.writeText(contract1_address).then(function() {
	    console.log("Copied to clipboard successfully!");
	}, function() {
	    console.error("Unable to write to clipboard. :-(");
	});
 });
});

$(function(){
    $("#copy_button3").click(function(event){
        event.preventDefault();
	navigator.clipboard.writeText(contract3_address).then(function() {
	    console.log("Copied to clipboard successfully!");
	}, function() {
	    console.error("Unable to write to clipboard. :-(");
	});
 });
});

$(function(){
    $("#copy_button4").click(function(event){
        event.preventDefault();
	navigator.clipboard.writeText(contract4_address).then(function() {
	    console.log("Copied to clipboard successfully!");
	}, function() {
	    console.error("Unable to write to clipboard. :-(");
	});
 });
});

$(function(){
    $("#debug_gameover").click(function(event){
        event.preventDefault();
        game_over();
    });
});


$(function(){
    $("#debug_devfund").click(function(event){
        event.preventDefault();
        debug_devfund();
    });
});