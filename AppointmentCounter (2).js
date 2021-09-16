function Form_OnLoad()
{
    //setRequiredAttendiesDelimited();
    //setOptionalAttendiesDelimited();
}

function Form_OnSave() {
    //RemoveRequiredAttendiesDelimited();
    //RemoveOptionalAttendiesDelimited();
}

function CounterIncrement()
{
//debugger;
var status = Xrm.Page.getAttribute("statecode").getValue();
var counter = Xrm.Page.getAttribute("vrp_counter").getValue();
Xrm.Page.getAttribute("vrp_counter").setSubmitMode("always");

//var increment = counter +1;


//if(status == 0 || status ==2 || status ==3  ) {
//Xrm.Page.getAttribute("vrp_counter").setValue(increment);
//Xrm.Page.getAttribute("vrp_counter").setSubmitMode("always");
//}

}

function Location()
{
//debugger;
var Location= Xrm.Page.getAttribute("location").getValue();
Xrm.Page.getAttribute("location").setSubmitMode("always");

}

function setRequiredAttendiesDelimited() {
    SetDelimitedlookup("requiredattendees");
}

function setOptionalAttendiesDelimited() {
    SetDelimitedlookup("optionalattendees");
}

function SetDelimitedlookup(lookupid) {
    var ToParties = new Array();
    ToParties = Xrm.Page.getAttribute(lookupid).getValue();
    if (ToParties) {
        for (var count = 0; count < ToParties.length; count++) {
            var nameValue = ToParties[count].name;
            if (nameValue.substr(nameValue.length - 2, 1) != ';')
                ToParties[count].name = nameValue + '; ';
        }
        Xrm.Page.getAttribute(lookupid).setValue(ToParties);
    }
}

function RemoveRequiredAttendiesDelimited() {
    RemoveDelimitedlookup("requiredattendees");
}

function RemoveOptionalAttendiesDelimited() {
    RemoveDelimitedlookup("optionalattendees");
}

function RemoveDelimitedlookup(lookupid) {
    var ToParties = new Array();
    ToParties = Xrm.Page.getAttribute(lookupid).getValue();
    if (ToParties) {
        for (var count = 0; count < ToParties.length; count++) {
            var nameValue = ToParties[count].name;
            if (nameValue.substr(nameValue.length - 2, 2) == '; ')
                ToParties[count].name = nameValue.substr(0, nameValue.length - 2);
        }
        Xrm.Page.getAttribute(lookupid).setValue(ToParties);
    }
}

function AppendFilterSearch() {
	//Keep Person and User entities in Look For dropdown of lookup window of required and optional attendees
	var requiredAttendeesControl = Xrm.Page.getControl("requiredattendees");
	requiredAttendeesControl.getAttribute().setLookupTypes(["systemuser","contact"]);
	
	var optionalAttendeesControl = Xrm.Page.getControl("optionalattendees");
	optionalAttendeesControl.getAttribute().setLookupTypes(["systemuser","contact"]);
	
	/*
	//Not used
    Xrm.Page.getControl("requiredattendees").addPreSearch(function () {
        AddPreSearch();
    });
	Xrm.Page.getControl("optionalattendees").addPreSearch(function () {
        AddPreSearch();
    });
	*/
}
	

function AddPreSearch() {
    var contactFilter = "<filter type='and'><condition attribute='contactid' operator='not-null' /></filter>";
    var accountFilter = "<filter type='and'><condition attribute='accountid' operator='null' /></filter>";
    //remove system users
    var systemUserFilter = "<filter type='and'><condition attribute='systemuserid' operator='not-null' /></filter>";
    //remove lead
    var leadFilter = "<filter type='and'><condition attribute='leadid' operator='null' /></filter>";
    //remove facility
    var facilityFilter = "<filter type='and'><condition attribute='equipmentid' operator='null' /></filter>";

    Xrm.Page.getControl("requiredattendees").addCustomFilter(contactFilter, "contact");
    Xrm.Page.getControl("requiredattendees").addCustomFilter(accountFilter, "account");
    Xrm.Page.getControl("requiredattendees").addCustomFilter(systemUserFilter, "systemuser");
    Xrm.Page.getControl("requiredattendees").addCustomFilter(leadFilter, "lead");
    Xrm.Page.getControl("requiredattendees").addCustomFilter(facilityFilter, "equipment");
}

//Function to read the QueryString
function getQuerystring(key)
{
	debugger;
  if (key != null && key != undefined ) 
  {
   var value = Xrm.Page.context.getQueryStringParameters()[key]
    return value;
  }
}

function LoadClientFromQS()
{
	debugger;
        var serverUrl = parent.Xrm.Page.context.getClientUrl();
	var accountid = getQuerystring('accountid_0');
	//var name= getQuerystring('accountName_0');
	
	if (accountid != "" && accountid != undefined) {
		$.ajax({
			type: "GET",
			contentType: "application/json; charset=utf-8",
			datatype: "json",
			url: serverUrl + "/api/data/v8.2/accounts?$select=name&$filter=accountid eq " + accountid,
			beforeSend: function (XMLHttpRequest) {
				XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
				XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
				XMLHttpRequest.setRequestHeader("Accept", "application/json");
				XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
			},
			async: false,
			success: function (data, textStatus, xhr) {

				var results = data;
				if (results.value.length > 0) {
					var name = results.value[0]["name"];
					
					if (name != "" && name != undefined)
					{
						Xrm.Page.getAttribute("vrp_corporate").setValue([{ id: accountid, name: name, entityType: 'account' }]);
					}
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				//  Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
			}
		});
	}
}
