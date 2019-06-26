$(document).ready(function(){
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
	{
		if(request.cmd == 'fbOn'){ 
		console.log(request.value);
		sendResponse('我收到了你的消息！');
		
		var isTj = $("#js-submit").val();
		if(isTj=="提交订单"){
			var addHtmlT = '<div class="row"><div class="button-wrap small-button"><button id="checkOk" type="button" class="disable-button purple-button darkblue-button">批量信息确认</button></div></div>';
			$("#m-passenger div:first").html(addHtmlT+"<h2>乘机人信息</h2>");
			$("#checkOk").click(function(){
				$("input").focus();
			});
		}
		}
	});

});



