addLoadEvent(displaySubProject);
addLoadEvent(waitForButton);
addLoadEvent(getFriend);

var isPlanUndonePlay = false;
var isInvitPendingPlay = false;

//获取好友信息
function getFriend() {	
	new Ajax.Request('/getFriendList', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		showFriendlist( response );
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

//显示好友列表
function showFriendlist( data ) {
	if ( !document.createElement ) return false;
	if ( !document.createTextNode ) return false;
	
	if ( !data.length ) {
		$('I_people').disabled = 'disabled';
	}
	else {
		buildFriendForm(data);
	}
}

function buildFriendForm( data ) {
	var friend = $('frd_form');
	var invitees = $('I_people');
	for ( var i = 0; i < data.length; i++ ) {
		var str = data[i].id + ':' + data[i].name;
		var check = document.createElement('input');
		check.setAttribute('type', 'checkbox');
		check.setAttribute('name', 'friend');
		check.setAttribute('value', data[i].id);
		friend.appendChild(check);
		var txt = document.createTextNode(str);
		friend.appendChild(txt);
		var br = document.createElement('br');
		friend.appendChild(br);
		
		var op = document.createElement('option');
		var opTxt = document.createTextNode(str);
		op.setAttribute('value', str);
		op.setAttribute('id', data[i].id);
		op.appendChild(opTxt);
		invitees.appendChild(op);
	}
}

//监听button并对button对应的内容进行展收
function displaySubProject() {
	if ( !document.getElementsByClassName ) return false;
	
	var disp = document.getElementsByClassName("outList");
	for ( var i = 0; i < disp.length; i++ ) {
		var bnt = disp[i].getElementsByTagName("input")[0];
		bnt.onclick = function() {
			var ulist = this.nextSibling.nextSibling;
			if ( ulist.getAttribute('id') == 'invitation' && 
			$('I_people').disabled ) {
				alert('You have no friend!');
				return false;
			}
			else {
				if ( ulist.style.display == "block" )
					ulist.style.display = "none";
				else
					ulist.style.display = "block";
			}		
		};
	}
}

//监听各个button
function waitForButton() {
	$("plan_done").observe("click", planDone);
	$("plan_undone").observe("click", planUndone);
	$("record_month").observe("click", recordMonth);
	$("record_week").observe("click", recordWeek);
	$("invit_pro").observe("click", invitPro);
	$("invit_pend").observe("click", invitPend);
	
	$("create_plan").observe("click", createPlan);
	$("new_invit").observe("click", invitSend);
	
	$('addFriend').observe("click", addFriend);
	$('delFriend').observe('click', delFriend);
}

//运动计划表头
function createPlanHeader() {
	var tb = document.createElement('table');
	tb.setAttribute('border', 1);
	var trHeader = document.createElement('tr');
	var thH1 = document.createElement('th');
	var txt1 = document.createTextNode('起始时间');
	var thH2 = document.createElement('th');
	var txt2 = document.createTextNode('结束时间');
	var thH3 = document.createElement('th');
	var txt3 = document.createTextNode('运动地点');
	var thH4 = document.createElement('th');
	var txt4 = document.createTextNode('运动类型');
	thH1.appendChild(txt1);
	thH2.appendChild(txt2);
	thH3.appendChild(txt3);
	thH4.appendChild(txt4);
	trHeader.appendChild(thH1);
	trHeader.appendChild(thH2);
	trHeader.appendChild(thH3);
	trHeader.appendChild(thH4);
	tb.appendChild(trHeader);
	return tb;
}

//运动记录表头
function createRecordHeader() {
	var tb = document.createElement('table');
	tb.setAttribute('border', 1);
	var trHeader = document.createElement('tr');
	var thH1 = document.createElement('th');
	var txt1 = document.createTextNode('起始时间');
	var thH2 = document.createElement('th');
	var txt2 = document.createTextNode('结束时间');
	var thH3 = document.createElement('th');
	var txt3 = document.createTextNode('运动地点');
	var thH4 = document.createElement('th');
	var txt4 = document.createTextNode('运动距离');
	var thH5 = document.createElement('th');
	var txt5 = document.createTextNode('运动时长');
	var thH6 = document.createElement('th');
	var txt6 = document.createTextNode('卡路里消耗');
	thH1.appendChild(txt1);
	thH2.appendChild(txt2);
	thH3.appendChild(txt3);
	thH4.appendChild(txt4);
	thH5.appendChild(txt5);
	thH6.appendChild(txt6);
	trHeader.appendChild(thH1);
	trHeader.appendChild(thH2);
	trHeader.appendChild(thH3);
	trHeader.appendChild(thH4);
	trHeader.appendChild(thH5);
	trHeader.appendChild(thH6);
	tb.appendChild(trHeader);
	return tb;
}

//邀请记录表头
function createInvitationHeader() {
	var tb = document.createElement('table');
	tb.setAttribute('border', 1);
	var trHeader = document.createElement('tr');
	var thH1 = document.createElement('th');
	var txt1 = document.createTextNode('时间');
	var thH2 = document.createElement('th');
	var txt2 = document.createTextNode('地点');
	var thH3 = document.createElement('th');
	var txt3 = document.createTextNode('运动类型');
	var thH4 = document.createElement('th');
	var txt4 = document.createTextNode('发出邀请者');
	var thH5 = document.createElement('th');
	var txt5 = document.createTextNode('受邀者');
	thH1.appendChild(txt1);
	thH2.appendChild(txt2);
	thH3.appendChild(txt3);
	thH4.appendChild(txt4);
	thH5.appendChild(txt5);
	trHeader.appendChild(thH1);
	trHeader.appendChild(thH2);
	trHeader.appendChild(thH3);
	trHeader.appendChild(thH4);
	trHeader.appendChild(thH5);
	tb.appendChild(trHeader);
	return tb;
}

//生成对应的表格
function createTable( bnt, id, response ) {
	if ( !document.createElement ) return false;
	if ( !document.createTextNode ) return false;
	
	$(bnt).setAttribute("disabled", "disabled");
	
	var div_done = $(id);
		if (!response) {
			alert("There has no data!");
		}
		else {
			var tb;
			if ( id === "plan_d" || id === "plan_u") {
				tb = createPlanHeader();
				if ( id === "plan_u" ) {
					isPlanUndonePlay = true;
					tb.setAttribute('id', 'planUndone_table');
				}
			}
			else if ( id === "record_M" || id === "record_W") 
				tb = createRecordHeader();
			else {
				tb = createInvitationHeader();
				if ( id === 'invit_pe' ) {
					isInvitPendingPlay = true;
					tb.setAttribute('id', 'invitPend_table');
				}
			}
			//alert(response.length);
			for ( var i = 0; i < response.length; i++ ){
				var tr = document.createElement('tr');
				for ( var j = 0; j < response[i].length; j++ ) {
					var td = document.createElement('td');
					var txtData = document.createTextNode(response[i][j]);
					td.appendChild(txtData);
					tr.appendChild(td);
				}
				tb.appendChild(tr);
			}
			div_done.appendChild(tb);
		}
		//alert(response);
}

//显示已完成的计划
function planDone() {
	new Ajax.Request('/planDone', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		createTable( "plan_done", 'plan_d', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

//显示未完成的计划
function planUndone() {
	new Ajax.Request('/planUndone', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		createTable( "plan_undone", 'plan_u', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

//显示一个星期内的运动记录
function recordWeek() {
	new Ajax.Request('/recordWeek', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		createTable( "record_week", 'record_W', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

//显示一个月内的运动记录
function recordMonth() {
	new Ajax.Request('/recordMonth', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		createTable( "record_month", 'record_M', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

//显示已接受的约跑
function invitPro() {
	new Ajax.Request('/invitPro', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		createTable( "invit_pro", 'invit_pr', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

//显示待接受的约跑
function invitPend() {
	new Ajax.Request('/invitPend', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		createTable( "invit_pend", 'invit_pe', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

//判断两个时间的前后s-start，e-end
function judgeTime( sy, sm, sd, sh, sM, ey, em, ed, eh, eM ) {
	if ( sy > ey ) return false;
	else if ( sy < ey ) return true;
	else {
		if ( sm > em ) return false;
		else if ( sm < em ) return true;
		else {
			if ( sd > ed ) return false; 
			else if ( sd < ed ) return true;
			else {
				if ( sh > eh ) return false;
				else if ( sh < eh ) return true;
				else {
					if ( sM >= eM ) return false;
					else return true;
				}
			}
		}
	}
}

//创建新的运动计划
function createPlan() {
	var begin = $F("p_begin");
	var end = $F("p_end");
	var addr = $F("p_addr");
	var type = $F("p_type");
	
	if ( !begin || !end || !addr || !type ) {
		alert("不能留空！");
		return false;
	}
	
	var result ;
	
	var beginStr = begin.split('-');
	var beginHour = $F("pbhour");
	var beginMin = $F("pbminute");
	
	var current = new Date;
	var curYear = current.getFullYear();
	var curMonth = current.getMonth() + 1;
	var curDay = current.getDate();
	var curHour = current.getHours();
	var curMinute = current.getMinutes();
	
	//判断运动开始时间是否早于当前时间
	result = judgeTime(curYear,curMonth,curDay,curHour,curMinute,
	parseInt(beginStr[0]),parseInt(beginStr[1]),parseInt(beginStr[2]),beginHour,beginMin);

	if ( !result ) {
		alert( '开始时间早于当前时间！');
		return false;
	}
	
	var endStr = end.split('-');
	var endHour = $F("pehour");
	var endMin = $F("peminute");
	
	//判断运动结束时间是否早于当前时间
	result = judgeTime(parseInt(beginStr[0]),parseInt(beginStr[1]),parseInt(beginStr[2]),beginHour,beginMin,
	parseInt(endStr[0]),parseInt(endStr[1]),parseInt(endStr[2]),endHour,endMin);
	
	if ( !result ) {
		alert( '开始时间晚于结束时间！');
		return false;
	}
	
	//将日期和时间组成一个字符串，如2014-06-11 20:11
	var beginTime = begin + ' ' + beginHour + ':' + beginMin;
	var endTime = end + ' ' + endHour + ':' + endMin;
	
	//将新数据发给服务器
	new Ajax.Request('/createPlan', {
	method:'get', parameters: {begin: beginTime, end: endTime, address: addr, type: type},
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		alert(response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
	
	if ( isPlanUndonePlay )  {
		var tb = $('planUndone_table');
		var tr = document.createElement('tr');
		var	td, txtData;
		
		td = document.createElement('td');
		txtData = document.createTextNode(beginTime);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(endTime);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(addr);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(type);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		tb.appendChild(tr);
	}
}

//发送邀请
function invitSend() {	
	var time = $F('i_begin');
	var addr = $F('I_addr');
	var type = $F('I_type');
	var people = $F('I_people');
	
	if ( !time || !addr || !type || !people.length ) {
		alert("不能留空！");
		return false;
	}
	
	var result ;
	
	var tStr = time.split('-');
	var tHour = $F("ihour");
	var tMin = $F("iminute");
	
	var current = new Date;
	var curYear = current.getFullYear();
	var curMonth = current.getMonth() + 1;
	var curDay = current.getDate();
	var curHour = current.getHours();
	var curMinute = current.getMinutes();
	
	//判断预约的时间是否早于当前的时间
	result = judgeTime(curYear,curMonth,curDay,curHour,curMinute,
	parseInt(tStr[0]),parseInt(tStr[1]),parseInt(tStr[2]),tHour,tMin);

	if ( !result ) {
		alert( '时间早于当前时间！');
		return false;
	}
	
	//将日期和时间组成一个字符串，如2014-06-11 20:11
	var Time = time + ' ' + tHour + ':' + tMin;
	var inviteesId = ''; //用于获取好友的id，并且用逗号隔开
	var inviteesName = '';
	for ( var i = 0; i < people.length; i++ ) {
		var peopleArray =  people[i].split(':');
		inviteesId+=peopleArray[0] + ',';
		inviteesName += peopleArray[1] + ',';
	}
	
	//将新数据发给服务器
	new Ajax.Request('/sentInvit', {
	method:'get', parameters: {time: Time, address: addr, type: type, invitees: inviteesId},
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		alert(response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
	
	if ( isInvitPendingPlay ) {
		var tb = $('invitPend_table');
		var tr = document.createElement('tr');
		var	td, txtData;
		
		td = document.createElement('td');
		txtData = document.createTextNode(Time);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(addr);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(type);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode("me");
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(inviteesName);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		tb.appendChild(tr);
	}
}

function addFriend() {
	var txt = $F('friend_id');
	if (!txt) 
		alert("请输入你想添加的好友的id");
	else if ( isNaN(txt) ) {
		alert('请输入数字');
	}
	else {
		new Ajax.Request('/addFriend', {
		method:'get', parameters: {id:txt},
		onSuccess: function(transport) {
			var response = transport.responseText.evalJSON() ;
			if ( response ) {
				buildFriendForm(response);
				alert("Add succeed!");
			}
			else 
				alert("你查找的好友不存在！");
		},
		onFailure:function() {
			alert('Something went wrong...');
		}
		});
	}
}

function delFriend() {
	var friends = document.getElementsByName('friend');
	if ( friends.length == 0 ) alert("You have no friend!");
	else {
		var ids = '';
		var formParent = $('frd_form');
		var inviteeParent = $('I_people');
		for ( var i = 0; i < friends.length; i++ ) {
			if ( friends[i].checked ) {
				ids += friends[i].value + ',';
				inviteeParent.removeChild($(friends[i].value));
				//$(friends[i].value).removeChild()
				formParent.removeChild(friends[i].nextSibling);
				formParent.removeChild(friends[i]);
			}
		}
		if ( !ids ) alert('请选取你想要删除的好友');
		else {
			new Ajax.Request('/delFriend', {
		method:'get', parameters: {id:ids},
		onSuccess: function(transport) {
			var response = transport.responseText.evalJSON() ;
			alert(response);
		},
		onFailure:function() {
			alert('Something went wrong...');
		}
		});
		}
	}
}
