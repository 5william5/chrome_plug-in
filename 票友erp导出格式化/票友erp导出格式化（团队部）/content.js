$(document).ready(function(){
	
		  
	var titleStr = $('head').find('title').text().trim();
	if(titleStr == '汇总明细'){
		$('#Button1').parents('div').append('<input id="outFormatExcel" type="button" value="格式化导出Excel" style="background-color:#008000;">');
		$('#outFormatExcel').on('click',function(){
			var tableData = [];
			var tableTr = $('table').find('tr');
			if(tableTr.length>0){
				tableTr.each(function(trIndex){
					var tableTd = $(this).find('td');
					tableData[trIndex]= {};
					tableTd.each(function(tdIndex){
						switch (tdIndex) 
						{ 
							case 0:tableData[trIndex]['id']= $(this).text();
							break;
							case 1:tableData[trIndex]['kahao']= $(this).text();
							break;
							case 2:tableData[trIndex]['pnr']= $(this).text();
							break;
							case 3:tableData[trIndex]['piaohao']= $(this).text();
							break;
							case 4:tableData[trIndex]['hangcheng']= $(this).text();
							break;
							case 5:tableData[trIndex]['hangban']= $(this).text();
							break;
							case 6:tableData[trIndex]['cangwei']= $(this).text();
							break;
							case 7:tableData[trIndex]['qifeishijian']= $(this).text();
							break;
							case 8:tableData[trIndex]['lvke']= $(this).text();
							break;
							case 9:tableData[trIndex]['piaojia']= $(this).text();
							break;
							case 10:tableData[trIndex]['shui']= $(this).text();
							break;
							case 11:tableData[trIndex]['fuwufei']= $(this).text();
							break;
							case 12:tableData[trIndex]['zherang']= $(this).text();
							break;
							case 13:tableData[trIndex]['yingshou']= $(this).text();
							break;
							case 14:tableData[trIndex]['shishou']= $(this).text();
							break;
							case 15:tableData[trIndex]['qiankuan']= $(this).text();
							break;
							case 16:tableData[trIndex]['jiesuanjia']= $(this).text();
							break;
							case 17:tableData[trIndex]['jiesuanshui']= $(this).text();
							break;
							case 18:tableData[trIndex]['dailijiang']= $(this).text();
							break;
							case 19:tableData[trIndex]['yingfu']= $(this).text();
							break;
							case 20:tableData[trIndex]['shifu']= $(this).text();
							break;
							case 21:tableData[trIndex]['lirui']= $(this).text();
							break;
							case 22:tableData[trIndex]['gongyingshang']= $(this).text();
							break;
							case 23:tableData[trIndex]['chupiaoriqi']= $(this).text();
							break;
							case 24:tableData[trIndex]['kefu']= $(this).text();
							break;
						}
					});
				});
			}
			tableData.splice(0,1);//删除表头行
			var BHtableD = {};//编号相同的放入同一个对象下面
			$.each(tableData, function(index, value) {
				BHtableD[value['id']] = tableData.filter(function(val){
					return val['id'] == value['id'];
				});
			});
			//重新排列出数组
			var tableFData = [];
			var r = 0;
			$.each(BHtableD, function(index,BHtableDItme){
				tableFData[r] = {};
				var piaohao = '';
				var lvke = '';
				var yingshou = 0;
				var yingfu = 0;
				var renshu = 0;
				$.each(BHtableDItme,function(index,value){
					piaohao = piaohao+value['piaohao']+'/';
					lvke = lvke+value['lvke']+'/';
					yingshou = yingshou+parseFloat(value['yingshou']);
					yingfu = yingfu+parseFloat(value['yingfu']);
					renshu = renshu+1;
				});
				tableFData[r]['id'] = BHtableDItme[0]['id'];
				tableFData[r]['kahao'] = BHtableDItme[0]['kahao'];
				tableFData[r]['pnr'] = BHtableDItme[0]['pnr'];
				tableFData[r]['piaohao'] = piaohao;
				tableFData[r]['hangcheng'] = BHtableDItme[0]['hangcheng'];
				tableFData[r]['hangban'] = BHtableDItme[0]['hangban'];
				tableFData[r]['cangwei'] = BHtableDItme[0]['cangwei'];
				tableFData[r]['qifeishijian'] = BHtableDItme[0]['qifeishijian'].replace(/\d{2}:\d{2}/g,'');
				tableFData[r]['lvke'] = lvke;
				tableFData[r]['renshu'] = renshu;
				tableFData[r]['yingshou'] = yingshou;
				tableFData[r]['yingfu'] = yingfu;
				tableFData[r]['gongyingshang'] = BHtableDItme[0]['gongyingshang'];
				tableFData[r]['chupiaoriqi'] = BHtableDItme[0]['chupiaoriqi'];
				tableFData[r]['kefu'] = BHtableDItme[0]['kefu'];
				r = r+1;
				
			});
			//添加表头
			tableFData.unshift({'id':'编号','kahao':'卡号','pnr':'PNR','piaohao':'票号','hangcheng':'航程','hangban':'航班','cangwei':'舱位','qifeishijian':'起飞日期','lvke':'旅客','renshu':'人数','yingshou':'应收','yingfu':'应付','gongyingshang':'供应商','chupiaoriqi':'出票日期','kefu':'客服'});
			//console.log(tableFData);
			/*
			
			var data = excel.filterExportData(sdata, [
					'id',
					'kahao',
					'pnr',
				]);
			*/
			
			excel.exportExcel({
					sheet1: tableFData
				}, '导出数据.xlsx', 'xlsx');
				
				
		});
	}
		

});



