var userName = "";
var userPassword = "";
var userCompany = "";

//Capture a settings closed event by main form
System.Gadget.onSettingsClosed = settingsUpdate;

// Disable caching of AJAX responses - Stop IE reusing cache data for the same requests
$.ajaxSetup({
    cache: false
});
jQuery.support.cors = true;


// --------------------------------------------------------------------
// Settings Form Closed
// --------------------------------------------------------------------
function settingsUpdate(event) {
    if (event.closeAction == event.Action.commit) {
		userName = System.Gadget.Settings.readString("userName");
		userPassword = System.Gadget.Settings.readString("userPassword");
		userCompany = System.Gadget.Settings.readString("userCompany");
        refreshInterval = System.Gadget.Settings.readString("refreshInterval");
        reloadBalance();
    }
    event.cancel = false;
}

// Initialize the gadget.
function init() {
    document.body.style.width = 100;
    document.body.style.height = 100;                   
    var oBackground = document.getElementById("imgBackground");
    oBackground.src = "url(images/cibus3.png)";
	imgBackground.addImageObject( "images/cibus3.png", 0, 0 );
	// Enable the gadget settings functionality. 
	System.Gadget.settingsUI = "settings.html";
	//Enable flyout
	System.Gadget.Flyout.file = "flyout.html";
	setTimeout(function() {reloadBalance(); }, 10);
}

function isSettingsOK(){
	userName = System.Gadget.Settings.readString("userName");
	userPassword = System.Gadget.Settings.readString("userPassword");
	userCompany = System.Gadget.Settings.readString("userCompany");
	
	if (userName == "" || userPassword == "" || userCompany == "" 
		|| userName == "undefined" || userPassword == "undefined" || userCompany == "undefined")
		return false;
	else
		return true;
}

function reloadBalance() {
		$("#gadgetContent2").html("Updating...");
	if (isSettingsOK()) {
			var xx = $.post(getCibusStart(), 
				function (data) {	reloadBalanceOK1(data); }
			);
		}
	else
		$("#gadgetContent2").html("Please update settings.");
}

function getCibusUrl() {
	return "http://www.cibus.co.il/";
}

function getCibusStart() {
	return "http://www.cibus.co.il/Signout.aspx";
}

function getFormUrl(){
	return getCibusUrl()+$("#aspnetForm").attr('action');
}

function reloadBalanceOK1(rawData) {
    //Get the raw data passed into the function and store in the holding div
    var raw = rawData;
    holdingdata.innerHTML = raw;
	$("#__EVENTTARGET").val("ctl00$LoginForm1$btnLogin")	
	$("#ctl00_LoginForm1_txtUserName").val(userName);	
	$("#ctl00_LoginForm1_txtPassword").val(userPassword);
	$("#ctl00_LoginForm1_txtCompany").val(userCompany);
	if ($("#ctl00_LoginForm1_lblBudget").html() == null || $("#ctl00_LoginForm1_lblBudget").text() == "")
		setTimeout(function() {reloadBalance2(); }, 500);
	else
		$("#gadgetContent2").html($("#ctl00_LoginForm1_lblBudget").text()+ "Y");
}

function reloadBalance2() {
	var x3=	$.ajax({
			type: "POST",
			url: getFormUrl(),
			data: $("#aspnetForm").serialize(),
			dataType: "html",
			success: function (data) { reloadBalanceOK2(data) }			
		});
}
function reloadBalanceOK2(rawData){
	var raw = rawData;
    holdingdata.innerHTML = raw;
	if ($("#ctl00_LoginForm1_lblMsg").text() != "") {
		$("#gadgetContent2").html($("#ctl00_LoginForm1_lblMsg").text());
		return; }
	$("#gadgetContent2").html($("#ctl00_LoginForm1_lblBudget").text() + "X");
}

// --------------------------------------------------------------------
// Display the Flyout 
// --------------------------------------------------------------------
function showFlyout() {
	System.Gadget.Flyout.show = !System.Gadget.Flyout.show;
}

// -------------------------------------------------
// Navigate to Cibus
// -------------------------------------------------
function navCibus() {
    window.open(getCibusUrl());
}