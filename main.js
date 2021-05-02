var statesList = {};
var stateDistrictMap = {};
var centerResponse = {};

loadSelectBoxes()
fetchStateAndDisctrict()
populateStates();

$(".main-card:first").hide()

function loadSelectBoxes() {
    $('#states').select2({
        placeholder: 'Select State'
    });

    $('#district').select2({
        placeholder: 'Select District'
    });
}

function fetchStateAndDisctrict() {

    $.ajax({
        url: 'states.json',
        dataType: 'json',
        async: false,
        success: function(json) {
            statesList = json.states;
        }
    });

    $.ajax({
        url: 'state_district_mapping.json',
        dataType: 'json',
        async: false,
        success: function(json) {
            stateDistrictMap = json;
        }
    });
}

function populateStates() {
    var stateValues = "";
    for (stateId in statesList) {
        stateValues += "<option value = '" + statesList[stateId]['state_id'] + "'>" + statesList[stateId]['state_name'] + "</option>";
    }

    document.getElementById("states").innerHTML = stateValues;
}

function populateDistrict(value) {

    if (value.length == 0) {
        document.getElementById("district").innerHTML = "<option></option>";

    } else {

        var districtValues = "";

        var selected_district = stateDistrictMap[value][0];

        for (var i = 0; i < selected_district.length; i++) {
            var district_id = selected_district[i]['district_id']
            var district_name = selected_district[i]['district_name']
            districtValues += "<option value = '" + district_id + "'>" + district_name + "</option>";
        }

        document.getElementById("district").innerHTML = districtValues;
    }
}