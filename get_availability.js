var vaccineAvailability = {};
var center_available = [];

$(".provided_min_age").click(function() {

	$('#loader').show();

	center_available = [];

    district_id = $('#district').val()
    provided_min_age = $(this).val()

    $('.main-card').slice(1).remove();

    if (district_id > 0) {
        prepareDistrictURL(district_id, provided_min_age);
    } else {
        alert('Please select the district');
    }

    return false;
})

function prepareDistrictURL(district_id, provided_min_age) {

	base_url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id="+ district_id + "&date=";

	start_date = new Date().toISOString().slice(0, 10);
	end_date   = "2021-05-30";

	dates = getDates(new Date(start_date), new Date(end_date));

	for (var i = 0; i < dates.length; i++) {
		final_url = base_url + dates[i]
		result = getVaccineAvailability(final_url, provided_min_age)
	}

	if (result.indexOf(true) > -1) {
		$("#no_center_available").hide()
		$(".main-card:first").hide()
    } else {
    	$("#no_center_available").show()
    }
}

function getVaccineAvailability(final_url, provided_min_age = 18) {

	$.ajax({
        url: final_url,
        dataType: 'json',
        async: false,
        success: function(json) {
            vaccineAvailability = json;
        }
    });

    var center_list = vaccineAvailability['centers']

    for (var i = 0; i < center_list.length; i++) {

       center_name = center_list[i]['name']
       state = center_list[i]['state_name']
       district = center_list[i]['district_name']
       block = center_list[i]['block_name']
       pincode = center_list[i]['pincode']
       fees = center_list[i]['fee_type']

       session_details = center_list[i]['sessions']

        for (var j = 0; j < session_details.length; j++) {

            min_age = session_details[j]['min_age_limit']
            capacity = session_details[j]['available_capacity']
            vaccine_name = session_details[j]['vaccine']
            date = session_details[j]['date']

            if (min_age == provided_min_age && capacity > 0) {

            	$(".main-card").show()

            	center_available.push(true)

                address = `${block}, ${district}, ${state},  ${pincode}`
                card_map_link = "https://www.google.co.in/maps/search/" + center_name + ", "+ address

                var cards = $(".main-card:first").clone()
                $(cards).find(".card-title").html(center_name);
                $(cards).find(".card-date").html(date);
                $(cards).find(".card-min-age").html(min_age);
                $(cards).find(".card-vaccine-name").html(vaccine_name);
                $(cards).find(".card-address").html(address);
                $(cards).find(".card-slots").html(capacity);
                $(cards).find(".card-fees").html(fees);
                $(cards).find(".card-map-link").attr('href', card_map_link);

                $(cards).show()
                $(cards).appendTo($("#main-card-div"))
            }
        }
    }

    return center_available
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
    	var d = new Date (currentDate)
    	year  = d.getFullYear();
		month = (d.getMonth() + 1).toString().padStart(2, "0");
		day   = d.getDate().toString().padStart(2, "0");

    	var datestring = day + '-' + month + '-' + year;

        dateArray.push(datestring);
        currentDate = currentDate.addDays(7);
    }
    return dateArray;
}
