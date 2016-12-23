$(function() {
	
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {setPseudo()});
   // $("#send").click(function() {sentMessage();});
	$( "#messageInput" ).keyup(function() {
	TypingDetected();
});   
		// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

});
var socket = io.connect();
var sessionId = socket.io.engine.id;
//alert(sessionId);

socket.on('message', function(data) {
    addMessage(data['message'], data['pseudo']);
	console.log(data);
	//drawText(data.pseudo + ":" + data.message);
});



socket.on('users', function(data) {
    let html = "";
	data.forEach(function(value, index){
		if (value.sessid != sessionId) html+="<span id="+ value.sessid+">"+value.name+"</span>,";
		
	 });
	html+="<span id="+ sessionId +">YOU</span>";
	$("#whoisonline").html(html);
	console.log(data);// addMessage(data['message'], data['pseudo']);
});

socket.on('connect', function() {
	console.log('connected');
	//$("#chatEntries").append('<h3>Добро пожаловать в чат, пожалуйста, представтесь!</h3>');
	sessionId = socket.io.engine.id;
   

});

function addMessage(msg, pseudo) {
    $("#chatEntries").html('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
    }
}

function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
}

function TypingDetected(){
	
	socket.emit('typing',$('#messageInput').val());
	
}



