var vaccineAvailability = {};
var center_available = [];

$(".provided_min_age").click(function() {

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

	base_url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id="+ district_id + "&date=";

	start_date = "2021-05-02";
	end_date   = "2021-07-30";

	dates = getDates(new Date(start_date), new Date(end_date));

	for (var i = 0; i < dates.length; i++) {
		final_url = base_url + dates[i]
		result = getVaccineAvailability(final_url, provided_min_age)
	}

	if (result.indexOf(1) > -1) {
		$("#no_center_available").hide()
		$(".main-card:first").hide()
    } else {
		console.log(result);
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
            date = session_details[j]['date']

            if (min_age == provided_min_age && capacity > 0) {

            	$(".main-card").show()

            	center_available.push(1)

                address = `${block}, ${district}, ${state},  ${pincode}`

                var cards = $(".main-card:first").clone()
                $(cards).find(".card-title").html(center_name);
                $(cards).find(".card-date").html(date);
                $(cards).find(".card-min-age").html(min_age);
                $(cards).find(".card-address").html(address);
                $(cards).find(".card-slots").html(capacity);
                $(cards).find(".card-fees").html(fees);

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
    	var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear();

        dateArray.push(datestring);
        currentDate = currentDate.addDays(7);
    }
    return dateArray;
}
