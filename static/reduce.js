function addLoadEvent( func ) {
	//alert("addLoadEvent");
	var oldOnload = window.onload;
	if ( typeof window.onload != "function")
		window.onload = func;
	else {
		window.onload = function() {
			oldOnload();
			func();
		};
	}
}

function insertAfter( newElement, targetElement ) {
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement)
		parent.appendChild(newElement);
	else
		parent.insertBefore( newElement, targetElement.nextSibling );
}

function getHTTPObject() {
	//alert("getHttpObject");
	if ( typeof XMLHttpRequest == "undefined") {
		alert("if");
		XMLHttpRequest = function() {
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); alert(1);}
			catch (e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); alert(2); }
			catch (e) {}
			try { return new ActiveXObject("Msxml2.XMLHTTP"); alert(3);}
			catch (e) {}
			return false;
		}
	}
	alert(5);
	return new XMLHttpRequest()
}