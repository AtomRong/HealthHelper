//检查名字和密码是否符合规格
function check() {
	if (checkName() && checkPassword()) {
		var form = document.getElementById("RegisterFrom");
		var bnt = form.elements["submit"];
		bnt.disabled = true;
		var user = $F('user');
		var pw = $F('pw');
		new Ajax.Request('/registerCheck', {
		method:'get', parameters: {user: user, password: pw},
		onSuccess: function(transport) {
			var response = transport.responseText.evalJSON() ;
			alert('You id is ' + response);
			proceed();
		},
		onFailure:function() {
			alert('Something went wrong...');
		}
		});
		return true;
	}
	else return false;
}

function proceed() {
	var form = document.createElement('form');
	form.setAttribute('method','get');
	form.setAttribute('action','/');
	/*var id = document.createElement('input');
	id.setAttribute('type', 'text');
	id.setAttribute('name', 'id');
	id.setAttribute('value', '.');
	var password = document.createElement('input');
	password.setAttribute('type', 'text');
	password.setAttribute('name', 'password');
	password.setAttribute('value', '.');
	form.appendChild(id);
	form.appendChild(password);
	*/
	form.style.display='hidden';
	document.body.appendChild(form);
	form.submit();
}

function checkName() {
	if (!document.getElementById) return false;
	var form = document.getElementById("RegisterFrom");
	var name = form.elements["username"].value;
	if ( !name ) {
		alert("The 'Username' can't not be empty!");
		return false;
	}
	
	for ( var i = 0; i < name.length; i++ ) {
		var c = name.toLowerCase().charAt(i);
		if ( c < '0' || (c > '9' && c < 'a') || c > 'z') {
			alert("The 'Username' can't not contain any characters exept number and lecter");
			return false;
		}
	}
	
	return true;
}

function checkPassword() {
	var form = document.getElementById("RegisterFrom");
	var pw = form.elements["password"].value;
	var pwconf = form.elements["passwordConf"].value;
	
	if ( !pw ) {
		alert("The 'Password' can't not be empty!");
		return false;
	}
	
	if ( pw.length < 6 ) {
		alert("The 'Password' must longer than or equal to 6!");
		return false;
	}
	
	for ( var i = 0; i < pw.length; i++ ) {
		var c = pw.toLowerCase().charAt(i);
		if ( c < '0' || (c > '9' && c < 'a') || c > 'z') {
			alert("The 'password' can't not contain any characters exept number and lecter");
			return false;
		}
	}
	
	if ( !pwconf ) {
		alert("Please write the password again!");
		return false;
	}
	
	if ( pw !== pwconf ) {
		alert("The password doesn't match!");
		return false;
	}

	return true;
}