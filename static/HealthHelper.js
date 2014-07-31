addLoadEvent(displaySubProject);
addLoadEvent(waitForButton);
addLoadEvent(getFriend);

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

//显示已完成的计划
function planDone() {
	new Ajax.Request('/planDone', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		$('plan_done').setAttribute('disabled', 'disabled');
		if (!response) alert('There has no data');
		else planTable('plan_d', response);
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
		$('plan_undone').setAttribute('disabled', 'disabled');
		if (!response) alert('There has no data');
		else planTable('plan_u', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

function planTable( id, response ) {
	var tb = $(id);
	tb.style.display = 'block';
	var td, txtData;
	for ( var i = 0; i < response.length; i++ ){
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		var txtData = document.createTextNode(response[i].st);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		var td = document.createElement('td');
		var txtData = document.createTextNode(response[i].et);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		var td = document.createElement('td');
		var txtData = document.createTextNode(response[i].place);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		var td = document.createElement('td');
		var txtData = document.createTextNode(response[i].sportType);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		tb.appendChild(tr);
	}
}

//显示一个星期内的运动记录
function recordWeek() {
	new Ajax.Request('/recordWeek', {
	method:'get',
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		$('record_week').setAttribute('disabled', 'disabled');
		if (!response) alert('There has no data');
		else recordTable('record_W', response);
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
		$('record_month').setAttribute('disabled', 'disabled');
		if (!response) alert('There has no data');
		else recordTable('record_M', response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

function recordTable( id, response ) {
	var tb = $(id);
	tb.style.display = 'block';
	var td, txtData;
	for ( var i = 0; i < response.length; i++ ){
		var tr = document.createElement('tr');
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].st);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].et);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].place);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].distance);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].sportTime);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].calorie);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		tb.appendChild(tr);
	}
}

//显示已接受的约跑
function invitPro() {
	new Ajax.Request('/invitPro', {
	method:'get', 
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;

		$('invit_pro').setAttribute('disabled', 'disabled');
		if (!response) alert('There has no data');
		else inviteTable( 'invit_pr', response );
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
		$('invit_pend').setAttribute('disabled', 'disabled');
		if (!response) alert('There has no data');
		else inviteTable( 'invit_pe', response );
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
}

function inviteTable( id, response ) {
	var tb = $(id);
	tb.style.display = 'block';
	var td, txtData;

	for ( var i = 0; i < response.length; i++ ){
		var tr = document.createElement('tr');
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].st);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].et);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].place);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].sportType);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode('me');
		td.appendChild(txtData);
		tr.appendChild(td);
		
		td = document.createElement('td');
		txtData = document.createTextNode(response[i].invitee);
		td.appendChild(txtData);
		tr.appendChild(td);
		
		tb.appendChild(tr);
	}
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
	method:'get', parameters: { st: beginTime, et: endTime, place: addr, sportType: type},
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		alert(response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
	
	if ( $('plan_undone').getAttribute('disabled') == 'disabled' )  {
		var tb = $('plan_u');
		tb.style.display = 'block';
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
	var begin = $F("i_begin");
	var end = $F("i_end");
	var addr = $F("I_addr");
	var type = $F("I_type");
	var people = $F('I_people');
	
	if ( !begin || !end || !addr || !type || !people.length ) {
		alert("不能留空！");
		return false;
	}
	
	var result ;
	
	var beginStr = begin.split('-');
	var beginHour = $F("ibhour");
	var beginMin = $F("ibminute");
	
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
	var endHour = $F("iehour");
	var endMin = $F("ieminute");
	
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

	var inviteesId = ''; //用于获取好友的id，并且用逗号隔开
	var inviteesName = '';
	for ( var i = 0; i < people.length; i++ ) {
		var peopleArray =  people[i].split(':');
		inviteesId+=peopleArray[0] + ',';
		inviteesName += peopleArray[1] + ',';
	}
	
	//将新数据发给服务器
	new Ajax.Request('/sentInvit', {
	method:'get', parameters: {st: beginTime, et: endTime, place: addr, sportType: type, invitee: inviteesId},
	onSuccess: function(transport) {
		var response = transport.responseText.evalJSON() ;
		alert(response);
	},
	onFailure:function() {
		alert('Something went wrong...');
	}
	});
	
	if ( $('invit_pend').getAttribute('disabled') == 'disabled' ) {
		var tb = $('invit_pe');
		tb.style.display = 'block';
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
		
		td = document.createElement('td');
		txtData = document.createTextNode('me');
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
