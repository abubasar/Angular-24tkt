
$('body').on("click", ".beSwapCity", function (event) {
    event.preventDefault();
    var ele = $(this);
    ele.toggleClass("jsRotateClass");

    var inp1 = ele.prev("div").children("div").first().children("input").first();
    var inp2 = ele.parent("li").next("li").children("div").children("div").children("input").first();
    var d1 = inp1.val();
    var d2 = inp2.val();

    var inp3 = ele.prev("div").children("input").first();
    var inp4 = ele.parent("li").next("li").children("div").first().children("input").first();

    var code1 = inp3.val();
    var code2 = inp4.val();

    var inp5 = inp3.next("input");
    var inp6 = inp4.next("input");
    var city1 = inp5.val();
    var city2 = inp6.val();

    var inp7 = inp5.next("input");
    var inp8 = inp6.next("input");
    var airport1 = inp7.val();
    var airport2 = inp8.val();


    inp1.toggleClass("goToRight");
    inp2.toggleClass("goToLeft");

    ele.prev("div").children("div").first().children("div").first().children("ul").html("");
    ele.parent("li").next("li").children("div").children("div").children("div").first().children("ul").html("");
    inp1.addClass("focus-action");
    inp2.addClass("focus-action");

    setTimeout(function () {
        inp1.toggleClass("goToRight");
        inp2.toggleClass("goToLeft");
        inp1.val(d2);
        inp2.val(d1);

        inp3.val(code2);
        inp4.val(code1);

        inp5.val(city2);
        inp6.val(city1);

        inp7.val(airport2);
        inp8.val(airport1);

    }, 300);
});
$('body').on('focus', '.focus-action', function (event) {
    $(this).select();
});
/*********************************************************************/
$('body').on('click', 'input[name=JourneyType]', function (event) {
    var v = $(this).val();
    $("#mc-box").hide();
    $(".first-dest-row").removeClass("w315").removeClass("w225");
    if (v == "1" || v == "3") {
        $(".first-dest-row").addClass("w315");
        $("#first-ret-date").hide();
        $("#dp-0").attr("data-next", "").val("");
        $("#dp-0").prev("input").val("");
        $("#rt-0").val("");
        $("#rt-0").prev("input").val("");
        if (v == "3") {
            $("#mc-box").show();
            $("#dp-0").attr("data-next", "dp-1");
        }
    } else if (v == "2") {
        $(".first-dest-row").addClass("w225");
        $("#first-ret-date").show();
        $("#dp-0").prev("input").val("");
        $("#dp-0").attr("data-next", "rt-0").val("");
        $("#rt-0").val("");
        $("#rt-0").prev("input").val("");        
    }
});
/*********************************************************************/
$('body').on('click', '.city-add-btn', function (event) {
    event.preventDefault();
    var id = parseInt($(this).attr("data-id"));
    $("#s-" + id).val(id);

    var e1 = id + 1;
    $("#mc-" + e1).show();
    $(this).hide();
    if (id == 3) {
        $("#a-" + e1).hide();
    } else {
        $("#a-" + e1).show();
    }
    $("#r-" + id).hide();
});
/*********************************************************************/
$('body').on('click', '.city-remove-btn', function (event) {
    event.preventDefault();
    var id = parseInt($(this).attr("data-id"));
    $("#s-" + id).val("-1");

    if (id == 1) {
        $('input[name=JourneyType]').filter('[value="1"]').prop("checked", true);
        $("#mc-box").hide();
    } else {
        $("#mc-" + id).hide();
        var e1 = id - 1;
        $("#a-" + e1).show();
        $("#r-" + e1).show();
    }
});

$('body').on('click', '.calender-icon', function (event) {
    $(this).prev("input").focus();
});

$('body').on('click', '.flt-adt-spinner-btn', function (event) {

    $("#flt-people-child").val("0")
    $("#flt-people-infant").val("0")
    ReInitSpinner();

    SetDisplayText();
});

$('body').on('click', '.flt-child-spinner-btn', function (event) {
    SetDisplayText();
});

function InitSpinners() {
    var mx = 9;
    var adt = parseInt($("#flt-people-adult").val());

    $("#flt-people-adult").TouchSpin({
        min: 1,
        max: mx,
        buttondown_class: "btn spinner-btn  flt-adt-spinner-btn",
        buttonup_class: "btn spinner-btn  flt-adt-spinner-btn"
    });

    mx = parseInt($("#flt-people-max-adults").val()) - adt;
    $("#flt-people-child").TouchSpin({
        min: 0,
        max: mx,
        buttondown_class: "btn spinner-btn flt-child-spinner-btn",
        buttonup_class: "btn spinner-btn flt-child-spinner-btn"
    });

    $("#flt-people-infant").TouchSpin({
        min: 0,
        max: adt,
        buttondown_class: "btn spinner-btn flt-child-spinner-btn",
        buttonup_class: "btn spinner-btn flt-child-spinner-btn"
    });
}

function ReInitSpinner() {
    var adt = parseInt($("#flt-people-adult").val());
    var mx = 9 - adt;

    $("#flt-people-child").trigger("touchspin.updatesettings", { max: mx });
    $("#flt-people-infant").trigger("touchspin.updatesettings", { max: adt });
}


function InitDateOneway() {
    $('.dt-oneway').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        autoApply: true,
        minDate: $("#dt-from").attr("data-start"),
        maxDate: $("#dt-from").attr("data-end"),
        locale: {
            cancelLabel: 'Clear',
            format: 'DD MMM YYYY'
        }
    }, function (start, end, label) {
        var fid = this.element[0].id;
        //alert(fid)
        $("#" + fid).prev("input").val(start.format('MM/DD/YYYY'));
    });

}
function InitDepartDates() {
    $(".date-input").each(function () {
        var dp = $(this);
        dp.daterangepicker({
            singleDatePicker: true,
            autoUpdateInput: false,
            autoApply: true,
            minDate: dp.attr("data-start"),
            maxDate: dp.attr("data-end"),
            locale: {
                cancelLabel: 'Clear',
                format: 'DD MMM YYYY'
            }
        },
         function (start, end, label) {
             InitNextDate(dp, start);
        });
    });
}
function InitNextDate(dp, start) {
    dp.prev("input").val(start.format('MM/DD/YYYY'));
    dp.val(start.format('DD MMM YYYY'));
    var n = dp.attr("data-next");
    //alert(n)
    if (n != "" && n != null) {
        var dp2 = $("#" + n);
        dp2.prev("input").val("");
        dp2.val("");
        dp2.daterangepicker({
            singleDatePicker: true,
            autoUpdateInput: false,
            autoApply: true,
            minDate: start.format('DD MMM YYYY'),
            maxDate: dp2.attr("data-end"),
            locale: {
                cancelLabel: 'Clear',
                format: 'DD MMM YYYY'
            }
        }, function (start, end, label) {
            InitNextDate(dp2, start);
        });

        if (n == "rt-0") {
            dp2.data('daterangepicker').toggle();
        }
    }
}
//function InitDateReturn() {
//    $('.dt-return').daterangepicker({
//        autoUpdateInput: false,
//        minDate: $("#dt-from").attr("data-start"),
//        maxDate: $("#dt-from").attr("data-end"),
//        autoApply: true,
//        locale: {
//            cancelLabel: 'Clear',
//            format: 'DD MMM YYYY'
//        }
//    });
//    $('.dt-return').on('show.daterangepicker', function (ev, picker) {
//        var dtf = $(this).attr("data-dt-from");
//        var dtt = $(this).attr("data-dt-to");
//        if (dtf != null && dtf != "") {
//            $(this).data('daterangepicker').setStartDate(dtf);
//        }
//        if (dtt != null && dtt != "") {
//            $(this).data('daterangepicker').setEndDate(dtt);
//        }
//    });
//    $('.dt-return').on('apply.daterangepicker', function (ev, picker) {
//        var fid = $(this).attr("data-from");
//        var tid = $(this).attr("data-to");
//        var dtf = picker.startDate.format('DD MMM YYYY');
//        var dtt = picker.endDate.format('DD MMM YYYY');
//        $("#" + fid).val(picker.startDate.format('DD MMM YYYY'));
//        $("#" + tid).val(picker.endDate.format('DD MMM YYYY'));
//        $("#" + fid).prev("input").val(dtf);
//        $("#" + tid).prev("input").val(dtt);

//        if (fid == $(this).attr("id")) {
//            $("#" + tid).data('daterangepicker').setStartDate(dtf);
//            $("#" + tid).data('daterangepicker').setEndDate(dtt);
//        } else {
//            $("#" + fid).data('daterangepicker').setStartDate(dtf);
//            $("#" + fid).data('daterangepicker').setEndDate(dtt);
//        }
//    });
//    $('.dt-return').on('cancel.daterangepicker', function (ev, picker) {
//        var fid = $(this).attr("data-from");
//        var tid = $(this).attr("data-to");
//        $("#" + fid).val('');
//        $("#" + tid).val('');
//        $("#" + fid).prev("input").val('');
//        $("#" + tid).prev("input").val('');

//        var st = $("#dt-from").attr("data-start");
//        $("#" + fid).data('daterangepicker').setStartDate(st);
//        $("#" + fid).data('daterangepicker').setEndDate(st);
//        $("#" + tid).data('daterangepicker').setStartDate(st);
//        $("#" + tid).data('daterangepicker').setEndDate(st);
//    });
//}

function InitDestinationAutocomplete(d1, d2) {
    InitAirportAutocomplete(d1);
    InitAirportAutocomplete(d2);
}
function InitAirportAutocomplete(id) {
    var options = {
        url: function (query) {
            $("#" + id).parent("div").prev("i").show();
            $("#" + id).removeClass("focus-action");
            return "/Flights/SearchAirports?query=" + query;
        },
        getValue: "title",
        list: {
            //match: {
            //    enabled: true
            //},
            maxNumberOfElements: 25,
            onClickEvent: function () {
                var code = $("#" + id).getSelectedItemData().value;
                var city = $("#" + id).getSelectedItemData().data5;
                var airport = $("#" + id).getSelectedItemData().data2;
                var title = $("#" + id).getSelectedItemData().title;
                $("#" + id).parent("div").next("input").val(code);
                $("#" + id).parent("div").next("input").next("input").val(city);
                $("#" + id).parent("div").next("input").next("input").next("input").val(airport);

                var i = parseInt($("#" + id).attr("data-id"))+1;
                if (i >= 1) {
                    $("#from-" + i).val(title);
                    $("#from-" + i).parent("div").next("input").val(code);
                    $("#from-" + i).parent("div").next("input").next("input").val(city);
                    $("#from-" + i).parent("div").next("input").next("input").next("input").val(airport);
                }
            },
            onLoadEvent: function () {
                $("#" + id).parent("div").prev("i").hide();
            }
        },
        template: {
            type: "custom",
            method: function (value, item) {
                var html = '<div class="row"><div class="col-sm-7"><div class="row"><div class="col-sm-12 eac-title-1">' + value + '</div><div class="col-sm-12 eac-title-3">' + item.data2 + '</div></div></div>';
                html += '<div class="col-sm-5 eac-title-2">' + item.data4 + ' <span class="flag flag-' + (item.data3).toLowerCase() + '"></span></div></div>';
                return html;
            }
        },
        theme: "round"
    };

    $("#" + id).easyAutocomplete(options);
}

