function check() {
	if (checkName() && checkPassword()) {
		var form = document.getElementById("RegisterFrom");
		var bnt = form.elements["submit"];
		bnt.disabled = true;
		return true;
	}
	else return false;
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