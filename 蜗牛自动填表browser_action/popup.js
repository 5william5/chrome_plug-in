$(document).ready(function(){
	if(localStorage.getItem("lxName") != null && localStorage.getItem("lxPhone") != null){
		$("#lxname").val(localStorage.getItem("lxName"));
		$("#lxphone").val(localStorage.getItem("lxPhone"));
	}
	$("#lxsave").click(function(){
		localStorage.setItem("lxName",$("#lxname").val());
		localStorage.setItem("lxPhone",$("#lxphone").val());
	});
	$("#format").click(function(){
		var inText = $("#inText").val();
		var inTextArr = inText.trim().split('\n');
		var nameList = new Array();
		var idNumList = new Array();
		for(var i=0;i<inTextArr.length;i++){
			inTextArr[i]=inTextArr[i].replace(/[&\|\\\*^%$#@：:，,;；、。./\-\s*]/g,"");//去除多余字符
			
			//inTextArr[i]=inTextArr[i].replace(/[&\|\\\*^%$#@：:，,;；、。./\-\s*]/g,"");//去除多余字符
		}
		for(var i=0;i<inTextArr.length;i++){
			if (inTextArr[i]==""){
				inTextArr.splice(i,1);
				i=i-1;
			}
		}
		if(inTextArr.length>9){
			alert("每次最多能订9位");
		}
		else{
			//alert(inTextArr);
			for(var j=0;j<inTextArr.length;j++){
				var idNum = inTextArr[j].match(/[0-9]{17}[0-9,x,X]/g);//身份证号码
				//判断位数是否足够
				if (idNum==null){
					alert("第"+(j+1).toString()+"个名单身份证号码位数错误");
				}
				else{
					//验证身份证号码是否正确
					var isIdNum = checkIDCard(idNum[0]);
					if(isIdNum===false){
						alert("第"+(j+1).toString()+"个名单身份证号码错误");
					}
					else{
						var name = inTextArr[j].substring(0,inTextArr[j].search(idNum[0]));//获取名字
						
						nameList[j]=name;
						idNumList[j]=idNum[0];
						//alert(nameList[j]+idNumList[j]);
					}
				}
				
			}
			//满足解析后的名单和原始名单数量相同，自动填入到乘机人信息框内
			if(nameList.length==inTextArr.length){
				//alert(nameList);
				for(var c=1;c<nameList.length;c++){
					
					chrome.tabs.executeScript(null,{code:"$('.js-addPassenger').click()",allFrames:true});
				}
				for(var t=0;t<nameList.length;t++){
					//alert(nameList[t]);
					var nameTextCode = "$(\"input[data-userinput='passengerName']:eq("+t+")\").val('"+nameList[t]+"')";
					var idTextCode = "$(\"input[data-userinput='certNumber']:eq("+t+")\").val('"+idNumList[t]+"')";
					var lxPhoneCode = "$(\"input[name='passenger_phone']:eq("+t+")\").val('"+$("#lxphone").val()+"')";
					
					
					
					chrome.tabs.executeScript(null,{code:nameTextCode,allFrames:true});
					chrome.tabs.executeScript(null,{code:idTextCode,allFrames:true});
					chrome.tabs.executeScript(null,{code:lxPhoneCode,allFrames:true});
					
				}
				var lxNameT = "$(\"input[data-userinput='name']\").val('"+$("#lxname").val()+"')";
				var lxPhoneT = "$(\"input[name='contacter_mobile']\").val('"+$("#lxphone").val()+"')";
				
				chrome.tabs.executeScript(null,{code:lxNameT,allFrames:true});
				chrome.tabs.executeScript(null,{code:lxPhoneT,allFrames:true});				
			}
			
		}
		
		sendMessageToContentScript({cmd:'fbOn',value:'你好，我是popup！'}, function(response)
					{
						console.log('来自content的回复：'+response);
					});
					
		});
	});
	

function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}	
//身份证号码验证函数	
// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
function checkIDCard(idcode){
    // 加权因子
    var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
    // 校验码
    var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

    var code = idcode + "";
    var last = idcode[17];//最后一个

    var seventeen = code.substring(0,17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for(var i = 0; i < len; i++){
        num = num + arr[i] * weight_factor[i];
    }
    
    // 获取余数
    var resisue = num%11;
    var last_no = check_code[resisue];

    // 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    var format = idcard_patter.test(idcode);

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format ? true : false;
}

