$(document).ready(function () {
    // http://stackoverflow.com/a/17163358
    var self = this;

    var current_url = window.location.href; //http://monitoring.3draion.com/raion1/   ---- with slash !!!
    var current_url_trim = current_url.slice(0, current_url.length - 1);  //remove the slash
    var html_url_webcam = '<img src=\"' + current_url_trim + '/stream/?action=stream\" alt=\"Chargement du flux webcam...\">';
    //apply changes to html document
    $('#webcam').html(html_url_webcam);

    const API_BASEURL = current_url + 'control/api/';
    const API_KEY = 'raionpi';
    const DEF_DISTANCE = 10;
    const DEF_MULTIPLIER = 1;

    var distance = DEF_DISTANCE;
    var multiplier = DEF_MULTIPLIER;

    /* Variables for printer information */
    // connection
    var info_printer;
    var connected = false;

    var temp_bed_actual;
    var temp_bed_target;
    var temp_tool_actual;
    var temp_tool_target;

    var baudrate = 250000;
    var serial_port = "AUTO";
    var printer_profile = "default";

    self.updatePrinterCommand = function (responseAjax, operational) {
        info_printer = responseAjax;
        //verify if the machine is connected
        if (!operational) {
            connected = false;
            $("#connection").attr("class", "btn btn-danger btn-block").html("Déconnecté");
        } else {
            connected = true;
            $("#connection").attr("class", "btn btn-success btn-block").html("Connecté");
            temp_bed_actual = info_printer.temperature.bed.actual;
            temp_bed_target = info_printer.temperature.bed.actual;
            temp_tool_actual = info_printer.temperature.tool0.actual;
            temp_tool_target = info_printer.temperature.tool0.target;
            $("#temp_bed").html(temp_bed_actual);
            $("#temp_tool").html(temp_tool_actual);
        }
    }

    self.sendPrinterCommand = function () {
        var respond;
        return $.get({
            url: API_BASEURL + "printer",
            headers: {
                "X-Api-Key": API_KEY
            },
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            //deep copy http://stackoverflow.com/a/122704
            //respond = $.extend(true, {}, res);
        }).done(function (data) {
            console.log("Ajax OK");
            self.updatePrinterCommand(data,true);
        }).fail(function (data) {
            console.log("Fail to execute sendPrinterCommand");
            self.updatePrinterCommand(data,false);
        });
    };

    self.sendPrintHeadCommand = function (data) {
        $.post({
            url: API_BASEURL + "printer/printhead",
            headers: {
                "X-Api-Key": API_KEY
            },
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data)
        });
    };

    self.sendJogCommand = function (axis, multiplier, distance) {
        if (typeof distance === "undefined")
            distance = DEF_DISTANCE;
        var data = {
            "command": "jog"
        };
        data[axis] = distance * multiplier;

        self.sendPrintHeadCommand(data);
    };

    self.sendHomeCommand = function (axis) {
        self.sendPrintHeadCommand({
            "command": "home",
            "axes": axis
        });
    };

    /* Init */
    //get_infoprinter();

    /* Loop Functions */
    // set interval
    var tid_get_infoprinter = setInterval(get_infoprinter, 1000);

    function get_infoprinter() {
        self.sendPrinterCommand();
    }

    function abortTimer() { // to be called when you want to stop the timer
        clearInterval(tid_get_infoprinter);
    }


    // ASIDE PANEL
    $.fn.refresh_info = function () {
        $.get({
            url: API_BASEURL + 'printer',
            headers: {
                "X-Api-Key": "raionpi"
            },
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                var html = '<p>Key : value<br>';
                var data = JSON.parse(JSON.stringify(res));
                console.log(res);
                /*$.each(res, function (key, val) {
                 var htmlElement = key + ' : ' + val;
                 $('#result').append(htmlElement);
                 })*/
                console.log(res.temperature.bed.actual)
            }
        });
    }

    $("#refresh_info").click(function () {
        $.fn.refresh_info();
    });


    // Turn on/off
    $('#turnon').on('click', function () {
        $.ajax({
            url: 'php/turnon.php'
        }).done(function (data) {
            console.log(data);
        });
    });

    $('#shutdown').on('click', function () {
        var r = window.confirm("Etes-vous sûr d'éteindre l'imprimante?");
        if (r == true) {
            $.ajax({
                url: 'php/turnoff.php'
            }).done(function (data) {
                console.log(data);
            });
        }
    });

    // JOG PANEL
    distance = 20;

    $("#jog_xinc").click(function () {
        self.sendJogCommand("x", multiplier, distance)
    })
    $("#jog_xdec").click(function () {
        self.sendJogCommand("x", multiplier * -1, distance)
    })
    $("#jog_yinc").click(function () {
        self.sendJogCommand("y", multiplier, distance)
    })
    $("#jog_ydec").click(function () {
        self.sendJogCommand("y", multiplier * -1, distance)
    })
    $("#jog_xyhome").click(function () {
        self.sendHomeCommand("xy")
    })
    $("#jog_zup").click(function () {
        self.sendJogCommand("z", multiplier * -1, distance)
    })
    $("#jog_zdown").click(function () {
        self.sendJogCommand("z", multiplier, distance)
    })
    $("#jog_zhome").click(function () {
        self.sendHomeCommand("z")
    })
});
