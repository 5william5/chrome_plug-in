$(document).ready(function(){
	
		 var isOrderPage = $('.g-title').find('span.title').text();
		 //判断为国内订单页面
		 if(isOrderPage=='订单列表'){
			//MutationObserver的回调函数，判断页面加载后加入‘提取信息按钮’
			var callback = function(records) {
				records.map(function(record) {
					//console.log(record.addedNodes[0].className);
					if(record.addedNodes[0].className=='wrapperbox'){
						var addHtmlT = '<div class="row"><div class="button-wrap small-button"><button name="outInfo" type="button" class="disable-button purple-button darkblue-button">提取信息</button></div></div>';
						$('td[idx="9"]').append(addHtmlT);
					}
				});
			};

			var mo = new MutationObserver(callback);

			var element = document.getElementById('J_order_form');

			var option = {
				'childList':true
				// 'characterData': true,
				// 'characterDataOldValue': true
			};

			mo.observe(element, option);
		 }
		 //复制到剪切板
		 var clipboard = new ClipboardJS('button[name="outInfo"]',{
				text: function(dom) {
					var outData = {};
					var depArrAirport = $(dom).parents('td').siblings('td[idx="2"]').text();
					var passArr = $(dom).parents('td').siblings('td[idx="4"]').html().split('<br>');
					
					outData['airline_code'] = $(dom).parents('td').siblings('td[idx="1"]').text();
					outData['dep_airport'] = depArrAirport.split('--')[0];
					outData['arr_airport'] = depArrAirport.split('--')[1];
					outData['air_date'] = $(dom).parents('td').siblings('td[idx="3"]').text();
					outData['pay_price'] = $(dom).parents('td').siblings('td[idx="5"]').text().substr(1);
					outData['pass']=[];
					
					
					$.each(passArr,function(index, value){
						outData['pass'][index]={};
						var passInfoArr = value.split('/');
						var pattAirLine = /^9C.+/g;
						//判断是否是春秋航空
						if(pattAirLine.test(outData['airline_code'])){
							var pattTicket = /^TX.+/g;
							//是否有票号
							if(pattTicket.test(passInfoArr[passInfoArr.length-1])){
								outData['pass'][index]['ticket_number'] = '000-0000000000';
								var pattName = /[\u4e00-\u9fa5]/g;
								// 判断是否是中文名字
								if(pattName.test(value)){
									outData['pass'][index]['pass_name'] = passInfoArr[0];
								}else{
									if(passInfoArr.length==1){
									outData['pass'][index]['pass_name'] = passInfoArr[0];
									}else if(passInfoArr.length==2){
										outData['pass'][index]['pass_name'] = passInfoArr[0]+'/'+passInfoArr[1];
									}else if(passInfoArr.length==3){
										outData['pass'][index]['pass_name'] = passInfoArr[0]+'/'+passInfoArr[1];
									}
								}
							//没有票号
							}else{
								var pattName = /[\u4e00-\u9fa5]/g;
								// 判断是否是中文名字
								if(pattName.test(value)){
									outData['pass'][index]['pass_name'] = passInfoArr[0];
								}else{
									if(passInfoArr.length==1){
									outData['pass'][index]['pass_name'] = passInfoArr[0];
									}else if(passInfoArr.length==2){
										outData['pass'][index]['pass_name'] = passInfoArr[0]+'/'+passInfoArr[1];
									}else if(passInfoArr.length==3){
										outData['pass'][index]['pass_name'] = passInfoArr[0]+'/'+passInfoArr[1];
									}
								}
							}
						//非春秋
						}else{
							var pattName = /[\u4e00-\u9fa5]/g;
							// 判断是否是中文名字
							if(pattName.test(value)){
								if(passInfoArr.length==1){
									outData['pass'][index]['pass_name'] = passInfoArr[0];
								}else if(passInfoArr.length==2){
									outData['pass'][index]['pass_name'] = passInfoArr[0];
									var pattTicket = /-/g;//正则票号中是否有‘-’，没有加上
									//if(pattTicket.test(value.split('/')[1])){
									if(pattTicket.test(value.match(/\/.+$/)[0])){
										//票号中有“-”
										outData['pass'][index]['ticket_number'] = passInfoArr[1];
									}else{
										//票号中没有“-”
										outData['pass'][index]['ticket_number'] = passInfoArr[1].slice(0,3)+'-'+passInfoArr[1].slice(3);
									}
								}
							//非中文名字
							}else{
								if(passInfoArr.length==1){
									outData['pass'][index]['pass_name'] = passInfoArr[0];
								}else if(passInfoArr.length==2){
									outData['pass'][index]['pass_name'] = passInfoArr[0]+'/'+passInfoArr[1];
								}else if(passInfoArr.length==3){
									outData['pass'][index]['pass_name'] = passInfoArr[0]+'/'+passInfoArr[1];
									var pattTicket = /-/g;//正则票号中是否有‘-’，没有加上
									//if(pattTicket.test(value.split('/')[1])){
									if(pattTicket.test(value.match(/\/.+$/)[0])){
										//票号中有“-”
										outData['pass'][index]['ticket_number'] = passInfoArr[2];
									}else{
										//票号中没有“-”
										outData['pass'][index]['ticket_number'] = passInfoArr[2].slice(0,3)+'-'+passInfoArr[2].slice(3);
									}
								}
							}
						}
						
					});
					
					var outDataJson = JSON.stringify(outData);

					//console.log(outDataJson);
					return outDataJson;
				}
			 });
			clipboard.on('success', function(e) {
				layer.msg('复制成功');
				//alert('复制成功')
			});
			clipboard.on('error', function(e) {
				alert('失败')
			});
	
	

});



