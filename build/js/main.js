$(document).ready(function () {
    // http://stackoverflow.com/a/17163358
    var self = this;

    //var current_url = "http://192.168.1.69:5001/"; // for test local only
    var touchscreen;
    var current_url = window.location.href; //http://monitoring.3draion.com/raion1/   ---- with slash !!!
    console.log(current_url);
    //test if this is for touchscreen
    if (current_url.indexOf("localhost") !== -1) {
        touchscreen = true;
        $("#userid").append(" (touchscreen)");
    }
    var current_url_trim = current_url.slice(0, current_url.length - 1);  //remove the slash
    var url_webcam_touchscreen = current_url + ":8080/";
    // var url_webcam_normalscreen = "http://10.8.0.2:8080/";
    var html_url_webcam;
    if (touchscreen) {
        html_url_webcam = '<img src="' + url_webcam_touchscreen + '?action=stream" alt="Chargement du flux webcam..." ' +
            'style="max-width: 100%; max-height: 100%; text-align: center">';  //fit the video into div
        $("#card_monitor").hide();
        $("#collapse_temperature").click();
        $("#collapse_status").click();
        $("#temp_title_stats").show();
    } else if (current_url.indexOf("172.24") !== -1) {
        html_url_webcam = '<img src="' + current_url_trim + ':8080/?action=stream" alt="Chargement du flux webcam..." ' +
            'style="max-width: 100%; max-height: 100%; text-align: center">';  //fit the video into div
    } else if ((current_url.indexOf("192.168.") !== -1) || (current_url.indexOf("10.8.") !== -1)) {
        console.log("stream from local");
        html_url_webcam = '<img src="' + current_url_trim + ':8080/?action=stream" alt="Chargement du flux webcam..." ' +
            'style="max-width: 100%; max-height: 100%; text-align: center">';  //fit the video into div
    } else {
        html_url_webcam = '<img src="' + current_url + 'stream/?action=stream" alt="Chargement du flux webcam..." ' +
            'style="max-width: 100%; max-height: 100%; text-align: center">';  //fit the video into div
    }

    var webcam_stt = false;

    // $("#webcam").html("Surveillance désactivée");
    $("#webcam").html(html_url_webcam);
    $("#webcam").setAttribute("src", "");

    $("#surveillance-toggle").click(function () {
        console.log(webcam_stt);
        if (webcam_stt) {
            webcam_stt = false;
            // $("#webcam").html("Surveillance désactivée");
            $("#webcam").setAttribute("src", "");
            // $("#webcam").trigger('pause');
        } else {
            webcam_stt = true;
            // $("#webcam").html(html_url_webcam);
            // $("#webcam").trigger('play');
            $("#webcam").setAttribute("src", html_url_webcam);
        }
    });

    $("#surveillance-refresh").click(function () {
        if (webcam_stt) {
            $("#webcam").html(html_url_webcam);
        }
    });

    var btn_on_off = $("[name='on_off']");
    btn_on_off.bootstrapSwitch();
    btn_on_off.removeClass("bootstrap-switch bootstrap-switch-mini");

    //const API_BASEURL = current_url + 'api/'; // for test local only
    //const API_BASEURL = current_url + 'control/api/';  //for online
    const API_BASEURL = current_url + 'api/';   //for touchscreen
    const API_KEY = 'raionpi';
    const DEF_DISTANCE = 10;
    const DEF_MULTIPLIER = 1;
    const DEF_FEEDRATE = 100;
    const DEF_FLOW = 100;

    const MAX_TEMP_BED = 100;
    const MAX_TEMP_TOOL = 265;

    const FAN_ON = "M106";
    const FAN_OFF = "M107";
    const MOTORS_OFF = "M84";
    const HOME_XYZ = "G28";

    const DEF_EXTRUDE_LENGTH = 0.1;
    const DEF_EXTRUDE_SPEED = 200;

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

    var sd_ready;
    var file_selected;
    var file_size;
    var file_date;
    var file_estimatedtime;
    var file_filementlength;

    var x_pos;
    var y_pos;
    var z_pos;

    var baudrate = 250000;
    var serial_port = "AUTO";
    var printer_profile = "default";

    function resetView() {
        $(".info").html("N/A");
    }

    self.updatePrinterCommand = function (responseAjax, operational) {
        info_printer = responseAjax;
        //verify if the machine is connected
        if (!operational) {
            connected = false;
            $(".status_job").addClass("disabled");
            $(".file_print").addClass("disabled");
            $("#connection-text").html(" Déconnecté").attr("style", "color: red; font-weight: bold");
            $("#connection-btn-text").html(" Connecter");
            resetView();
        } else {
            connected = true;
            //test if printing - paused - canceled
            if (info_printer.state.flags.printing) { //printing
                $(".status_job").removeClass("disabled");
                $("#job_pause").html("Pause");
                $(".file_print").addClass("disabled");
            } else if (info_printer.state.flags.paused) {  //paused
                $("#job_pause").html("Résumer");
                $(".status_job").removeClass("disabled");
                $(".file_print").addClass("disabled");
            } else { //nothing or canceled
                $("#job_pause").html("Pause");
                $(".status_job").addClass("disabled");
                $(".file_print").removeClass("disabled");
            }

            $("#connection-text").html(" Connecté").attr("style", "color: green; font-weight: bold");
            $("#connection-btn-text").html("Déconnecter");
            temp_bed_actual = info_printer.temperature.bed.actual;
            temp_tool_actual = info_printer.temperature.tool0.actual;
            if (info_printer.temperature.bed.target == 0) {
                temp_bed_target = "OFF";
            } else {
                temp_bed_target = info_printer.temperature.bed.target;
            }
            if (info_printer.temperature.tool0.target == 0) {
                temp_tool_target = "OFF";
            } else {
                temp_tool_target = info_printer.temperature.tool0.target;
            }
            //sd_ready = info_printer.sd.ready;

            $("#temp_bed_actual").html(temp_bed_actual);
            $("#temp_bed_actual_title").html(temp_bed_actual);
            $("#temp_bed_target").html(temp_bed_target);
            $("#temp_bed_target_title").html(temp_bed_target);
            $("#temp_tool_actual").html(temp_tool_actual);
            $("#temp_tool_actual_title").html(temp_tool_actual);
            $("#temp_tool_target").html(temp_tool_target);
            $("#temp_tool_target_title").html(temp_tool_target);

            $("#control_temp_bed_target").attr("placeholder", temp_bed_target);
            $("#control_temp_tool_target").attr("placeholder", temp_tool_target);

            // if (sd_ready) {
            //     $("#sd_ready").html("Prêt");
            // } else {
            //     $("#sd_ready").html("Pas présente");
            // }
        }
    };

    self.sendConnectCommand = function (connect) {
        var data;
        if (connect) {
            data = {"connect": "yes"};
        } else {
            data = {"connect": "no"};
        }
        $.post({
            url: "src/php/connection.php",
            data: data
        }).done(function (data) {
            // console.log("connect OK. homing...");
            //go home after connection
            if (connect) {
                $("#jog_xyhome").click();
                $("#jog_zhome").click();
            }
        });
    };

    $("#connection").click(function () {
        if (!connected) {
            self.sendConnectCommand(true);
            $("#connection-text").html(" Connecté").attr("style", "color: green;");
            $("#connection-btn-text").html("Déconnecter");
        } else {
            self.sendConnectCommand(false);
            $("#connection-text").html(" Déconnecté").attr("style", "color: red;");
            $("#connection-btn-text").html(" Connecter");
        }
    });

    self.sendPrinterCommand = function () {
        $.get({
            url: "src/php/printer.php",
            dataType: "json"
        }).done(function (data) {
            self.updatePrinterCommand(data, true);
        }).fail(function (data) {
            self.updatePrinterCommand(data, false);
        });
    };

    self.sendPrintHeadCommand = function (data) {
        $.post({
            url: "src/php/printer.printhead.php",
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data)
        });
    };

    function updateAxisPos(axis, diff) {
        switch (axis) {
            case "x":
                x_pos += diff;
                break;
            case "y":
                y_pos += diff;
                break;
            case "z":
                if (diff == 0) {
                    z_pos = 196;
                }
                z_pos += diff;
                break;
            case "xy":
                x_pos = 0;
                y_pos = 0;
                break;
        }
        $("#x_pos").html(x_pos);
        $("#y_pos").html(y_pos);
        $("#z_pos").html(z_pos);
    }

    function getSelectedJogDistance() {
        var selected_dist = $("label[class='btn btn-default active']").children().val();
        return parseFloat(selected_dist);
    }

    self.sendJogCommand = function (axis, multiplier) {
        var distance = getSelectedJogDistance();
        if (typeof distance === "undefined")
            distance = DEF_DISTANCE;
        var data = {"command": "jog"};
        var diff = distance * multiplier;
        data["axe"] = axis;
        data["dist"] = diff;
        updateAxisPos(axis, diff);
        $.post({
            url: "src/php/printer.printhead.php",
            dataType: "json",
            data: data
        });
    };

    self.sendFeedrateCommand = function (feedrate) {
        if (typeof feedrate === "undefined")
            feedrate = DEF_FEEDRATE;
        var data = {"command": "feedrate"};
        data["feedrate"] = feedrate;
        $.post({
            url: "src/php/printer.printhead.php",
            dataType: "json",
            data: data
        });
    };

    self.sendFlowCommand = function (flow) {
        if (typeof flow === "undefined")
            flow = DEF_FLOW;
        var data = {"flow": flow};
        $.post({
            url: "src/php/printer.tool.php",
            dataType: "json",
            data: data
        });
    };

    self.sendHomeCommand = function (input) {
        var axehome;
        switch (input) {
            case "xy":
                axehome = '["x", "y"]';
                break;
            case "z":
                axehome = '"z"';
                break;
        }
        var data = {"command": "home"};
        data["axehome"] = axehome;
        $.post({
            url: "src/php/printer.printhead.php",
            dataType: "json",
            data: data
        });
        updateAxisPos(input, 0)
    };

    self.updateFilesTable = function (data) {
        $("#file_table").html(""); // clear the table
        data.files.forEach(function (item, index) {
            //var name = item.name.slice(0, item.name.length-6); //remove .gcode
            var name = item.name;
            var _date = new Date(item.date * 1000);
            var month=_date.getMonth()+1;
            var date = _date.getDate() + "/" + month + "/" + _date.getUTCFullYear();
            var time = _date.getHours() + ":" + _date.getMinutes() + ":" + _date.getSeconds();
            var size = item.size / 1024;
            size = Math.round(size);
            size += " KB";
            var estTime;
            var estFilament;
            if (typeof (item.gcodeAnalysis) !== 'undefined') {
                estTime = item.gcodeAnalysis.estimatedPrintTime / 60;
                estTime = Math.round(estTime);
                estTime += " min.";
                estFilament = item.gcodeAnalysis.filament.tool0.length / 1000;
                estFilament = Math.round(estFilament);
                estFilament += " m";
            } else {
                estTime = "n/a";
                estFilament = "n/a"
            }

            $("#file_table").append(
                "<tr>" +
                "<td><input type='radio' name='file_radiobutton_group' value='" + name + "'></td>" +
                "<td>" + name + "</td>" +
                "<td>" + date + " " + time + "</td>" +
                "<td>" + size + "</td>" +
                "<td>" + estTime + "</td>" +
                "<td>" + estFilament + "</td>" +
                "</tr>"
            )
        });
        $("#div_file_table").addClass("fix_width");
    };

    self.getFilesCommand = function () {
        $.get({
            url: "src/php/files.php",
            dataType: "json"
        }).done(function (data) {
            self.updateFilesTable(data);
        }).fail(function (data) {
            console.log("Fail to execute getFilesCommand");
        });
    };

    self.deleteFileCommand = function (filename) {
        console.log(filename);
        $.post({
            url: "src/php/files.php",
            data: {"filename":filename},
            dataType: "json"
        }).done(function (data) {
            self.getFilesCommand();
        }).fail(function (data) {
            console.log("Fail to execute deleteFileCommand");
        });
    };

    self.selectPrintCommand = function (filename, print) {
        $.post({
            url: "src/php/print.php",
            data: {"filename": filename},
            dataType: "json"
        }).done(function (data) {
            self.getOneFileInfo(filename);
        });
    };

    self.sendJobCancel = function () {
        $.post({
            url: "src/php/job.php",
            data: {"command": "cancel"},
            // dataType: "json"
        }).done(function (data) {
            console.log("cancel OK")
        });
    };

    self.sendJobPause = function () {
        $.post({
            url: "src/php/job.php",
            data: {"command": "pause"},
            dataType: "json"
        }).done(function (data) {
            console.log("pause OK")
        });
    };

    self.updateSelectedFile = function (responseAjax) {
        $("#file_selected").html(responseAjax.name);
        var size = Math.round(responseAjax.size);
        size += " KB";
        $("#file_size").html(size);
    };

    self.getOneFileInfo = function (filename) {
        $.post({
            url: "src/php/getOneFileInfo.php",
            data: {"filename": filename},
            dataType: "json"
        }).done(function (data) {
            self.updateSelectedFile(data);
        }).fail(function (data) {
            console.log("Fail to execute getOneFileInfo");
        });
    };

    self.sendTempSet = function (type, temp) {
        var data;
        var url_dest;
        if (type == "bed") {
            data = {
                "command": "target",
                "target": temp
            };
            url_dest = "src/php/printer.setTempBed.php";
        } else {
            data = {
                "command": "target",
                "targets": {
                    "tool0": temp
                }
            };
            url_dest = "src/php/printer.setTempTool.php";
        }
        $.post({
            url: url_dest,
            dataType: "json",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data)
        }).done(function (data) {
            console.log(data);
        });
    };

    function goToByScroll(id) {
        $('html,body').animate({scrollTop: $("#" + id).offset().top}, 'slow');
    }

    $("#file_select_print_btn").click(function () {
        goToByScroll("first_row");
        // $("#job_cancel").css("display", "inline-block");
        $("#job_cancel").removeClass("disabled");
        $("#job_pause").removeClass("disabled");
        var selected_file = $("input:radio[name='file_radiobutton_group']:checked").val();
        self.selectPrintCommand(selected_file, true);
        $("#file_select_print_btn").addClass("disabled");
    });

    $("#file_refresh_btn").click(function () {
        self.getFilesCommand();
    });

    $("#file_delete_btn").click(function () {
        var selected_file = $("input:radio[name='file_radiobutton_group']:checked").val();
        self.deleteFileCommand(selected_file);
    });

    $("#job_cancel").click(function () {
        self.sendJobCancel();
        $("#job_cancel").addClass("disabled");
        $("#file_select_print_btn").removeClass("disabled");
    });

    $("#job_pause").click(function () {
        self.sendJobPause();
        $("#job_pause").html("Résumer");
    });

    $("#control_temp_bed_set").click(function () {
        var input = $("#control_temp_bed_target").val();
        if (input == "OFF") {
            $("#control_temp_bed_target").val("OFF");
            temp_bed_target = "OFF";
            $("#temp_bed_target").html("OFF");
            self.sendTempSet("bed", 0);
        } else if (parseInt(input) >= 0) {
            if (parseInt(input) <= MAX_TEMP_BED) {
                $("#control_temp_bed_target").val(parseInt(input));
                temp_bed_target = parseInt(input);
                $("#temp_bed_target").html(parseInt(input));
                self.sendTempSet("bed", parseInt(input))
            } else {
                new PNotify({
                    title: 'Erreur',
                    text: 'La température dépasse le maximum : ' + MAX_TEMP_BED,
                    type: 'error',
                    styling: 'bootstrap3'
                });
            }
        } else {
            new PNotify({
                title: 'Erreur',
                text: 'Erreur de saisie la valeur température',
                type: 'error',
                styling: 'bootstrap3'
            });
        }
    });

    $("#control_temp_tool_set").click(function () {
        var input = $("#control_temp_tool_target").val();
        // console.log("test");
        if (input == "OFF") {
            $("#control_temp_tool_target").val("OFF");
            temp_tool_target = "OFF";
            $("#temp_tool_target").html("OFF");
            self.sendTempSet("tool", 0);
        } else if (parseInt(input) >= 0) {
            if (parseInt(input) <= MAX_TEMP_TOOL) {
                $("#control_temp_tool_target").val(parseInt(input));
                temp_tool_target = parseInt(input);
                $("#temp_tool_target").html(parseInt(input));
                self.sendTempSet("tool", parseInt(input))
            } else {
                new PNotify({
                    title: 'Erreur',
                    text: 'La température dépasse le maximum : ' + MAX_TEMP_TOOL,
                    type: 'error',
                    styling: 'bootstrap3'
                });
            }
        } else {
            new PNotify({
                title: 'Erreur',
                text: 'Erreur de saisie la valeur température',
                type: 'error',
                styling: 'bootstrap3'
            });
        }
    });

    $("#control_temp_bed_off").click(function () {
        $("#control_temp_bed_target").val("OFF");
        $("#temp_bed_target").html("OFF");
        self.sendTempSet("bed", 0);
    });

    $("#control_temp_tool_off").click(function () {
        $("#control_temp_tool_target").val("OFF");
        $("#temp_tool_target").html("OFF");
        // abortTimer();
        self.sendTempSet("tool", 0);
        // var tid_get_infoprinter = setInterval(get_infoprinter, 1000);
    });


    $("#control_feedrate_set").click(function () {
        var input = $("#control_feedrate_target").val();
        self.sendFeedrateCommand(parseInt(input));
    });

    $("#control_feedrate_reset").click(function () {
        self.sendFeedrateCommand(100);
    });

    $("#control_flow_set").click(function () {
        var input = $("#control_flow_target").val();
        self.sendFlowCommand(parseInt(input));
    });

    $("#control_flow_reset").click(function () {
        self.sendFlowCommand(100);
    });

    self.sendGcodeCommand = function (command) {
        $.post({
            url: "src/php/customGcodeCommand.php",
            dataType: "json",
            data: {"multiple": "no","command": command}
        });
    };

    self.sendGcodeMultipleCommand = function (command) {
        $.post({
            url: "src/php/customGcodeCommand.php",
            dataType: "json",
            data: {"multiple": "yes","command": command}
        });
    };

    $("#fan_on").click(function () {
        self.sendGcodeCommand(FAN_ON);
    });

    $("#fan_off").click(function () {
        self.sendGcodeCommand(FAN_OFF);
    });

    $("#motors_off").click(function () {
        self.sendGcodeCommand(MOTORS_OFF);
    });

    $("#extrude").click(function () {
        if (temp_tool_target == "OFF") {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez échauffer la tête d\'impression',
                type: 'error',
                styling: 'bootstrap3'
            });
        } else if (temp_tool_actual < temp_tool_target - 2) {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez attendre que la tête d\'impression s\'échauffe jusqu\'à: ' + temp_tool_target,
                type: 'error',
                styling: 'bootstrap3'
            });
        } else {
            var command = "G1 E" + DEF_EXTRUDE_LENGTH + " F" + DEF_EXTRUDE_SPEED;
            console.log(command);
            self.sendGcodeMultipleCommand('"G92 E0", "G1 E1 F200"');
        }
    });

    $("#extrude01").click(function () {
        if (temp_tool_target == "OFF") {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez échauffer la tête d\'impression',
                type: 'error',
                styling: 'bootstrap3'
            });
        } else if (temp_tool_actual < temp_tool_target - 2) {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez attendre que la tête d\'impression s\'échauffe jusqu\'à: ' + temp_tool_target,
                type: 'error',
                styling: 'bootstrap3'
            });
        } else {
            var command = "G1 E" + DEF_EXTRUDE_LENGTH + " F" + DEF_EXTRUDE_SPEED;
            console.log(command);
            self.sendGcodeMultipleCommand('"G92 E0", "G1 E0.1 F200"');
        }
    });

    $("#extrude50").click(function () {
        if (temp_tool_target == "OFF") {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez échauffer la tête d\'impression',
                type: 'error',
                styling: 'bootstrap3'
            });
        } else if (temp_tool_actual < temp_tool_target - 2) {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez attendre que la tête d\'impression s\'échauffe jusqu\'à: ' + temp_tool_target,
                type: 'error',
                styling: 'bootstrap3'
            });
        } else {
            var command = "G1 E" + DEF_EXTRUDE_LENGTH + " F" + DEF_EXTRUDE_SPEED;
            console.log(command);
            self.sendGcodeMultipleCommand('"G92 E0", "G1 E50 F1500"');
        }
    });


    $("#retract").click(function () {
        if (temp_tool_target == "OFF") {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez échauffer la tête d\'impression',
                type: 'error',
                styling: 'bootstrap3'
            });
        } else if (temp_tool_actual < temp_tool_target - 2) {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez attendre que la tête d\'impression s\'échauffe jusqu\'à: ' + temp_tool_target,
                type: 'error',
                styling: 'bootstrap3'
            });
        } else {
            var command = "G1 E" + DEF_EXTRUDE_LENGTH + " F" + DEF_EXTRUDE_SPEED;
            console.log(command);
            self.sendGcodeMultipleCommand('"G92 E0", "G1 E-1 F200"');
        }
    });

    $("#retract01").click(function () {
        if (temp_tool_target == "OFF") {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez échauffer la tête d\'impression',
                type: 'error',
                styling: 'bootstrap3'
            });
        } else if (temp_tool_actual < temp_tool_target - 2) {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez attendre que la tête d\'impression s\'échauffe jusqu\'à: ' + temp_tool_target,
                type: 'error',
                styling: 'bootstrap3'
            });
        } else {
            var command = "G1 E" + DEF_EXTRUDE_LENGTH + " F" + DEF_EXTRUDE_SPEED;
            console.log(command);
            self.sendGcodeMultipleCommand('"G92 E0", "G1 E-0.1 F200"');
        }
    });

    $("#retract50").click(function () {
        if (temp_tool_target == "OFF") {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez échauffer la tête d\'impression',
                type: 'error',
                styling: 'bootstrap3'
            });
        } else if (temp_tool_actual < temp_tool_target - 2) {
            new PNotify({
                title: 'Erreur',
                text: 'Veuillez attendre que la tête d\'impression s\'échauffe jusqu\'à: ' + temp_tool_target,
                type: 'error',
                styling: 'bootstrap3'
            });
        } else {
            var command = "G1 E" + DEF_EXTRUDE_LENGTH + " F" + DEF_EXTRUDE_SPEED;
            console.log(command);
            self.sendGcodeMultipleCommand('"G92 E0", "G1 E-50 F1500"');
        }
    });

    var _submit = document.getElementById('_submit'),
        _file = document.getElementById('_file'),
        _progress = document.getElementById('_progress');

    var upload = function(){

        if(_file.files.length === 0){
            return;
        }

        var data = new FormData();
        data.append('SelectedFile', _file.files[0]);

        console.log('OK data append');

        var request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(request.readyState == 4){
                try {
                    var resp = JSON.parse(request.response);
                } catch (e){
                    var resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };
                }
                self.getFilesCommand();
                console.log(resp.status + ': ' + resp.data);
            }
        };

        request.upload.addEventListener('progress', function(e){
            var percent = parseInt(e.loaded/e.total * 100)
            _progress.style.width = percent + '%';
            $("#_progress").html(percent + '%');
            if (percent == 100) {
                $("#_progress").html("Upload terminé");
                $("#file_refresh_btn").click();
            }
        }, false);

        request.open('POST', 'src/php/upload.php');
        request.send(data);
    };

    _submit.addEventListener('click', upload);



    /* Init first time load page */
    self.sendPrinterCommand(); // check if connected
    self.getFilesCommand();

    /* Loop Functions */
    // set interval
    var tid_get_infoprinter = setInterval(get_infoprinter, 1000);

    function get_infoprinter() {
        self.sendPrinterCommand();
    }

    function abortTimer() { // to be called when you want to stop the timer
        clearInterval(tid_get_infoprinter);
    }

    // Turn on/off
    $('#turnon').on('click', function () {
        $.ajax({
            url: 'src/php/turnon.php'
        }).done(function (data) {
            console.log(data);
        });
    });

    $('#turnoff').on('click', function () {
        var r = window.confirm("Etes-vous sûr d'éteindre l'imprimante?");
        if (r == true) {
            $.ajax({
                url: 'src/php/turnoff.php'
            }).done(function (data) {
                console.log(data);
            });
        }
    });

    //Lighton/off
    $('#lighton').on('click', function () {
        $.ajax({
            url: 'src/php/lighton.php'
        }).done(function (data) {
            console.log(data);
        });
    });

    $('#lightoff').on('click', function () {
        $.ajax({
            url: 'src/php/lightoff.php'
        }).done(function (data) {
            console.log(data);
        });
    });

    // JOG PANEL

    $("#collapse_control").click(function () {
        if ($(".control_title_btn").css("display") == "none") {
            $(".control_title_btn").css("display", "inline-block")
        } else {
            $(".control_title_btn").css("display", "none")
        }
    });

    $("#jog_xinc").click(function () {
        self.sendJogCommand("x", multiplier * -1)
    });
    $("#jog_xdec").click(function () {
        self.sendJogCommand("x", multiplier)
    });
    $("#jog_yinc").click(function () {
        self.sendJogCommand("y", multiplier * -1)
    });
    $("#jog_ydec").click(function () {
        self.sendJogCommand("y", multiplier)
    });
    $(".jog_xyhome").click(function () {
        self.sendHomeCommand("xy")
    });
    $("#jog_zup").click(function () {
        self.sendJogCommand("z", multiplier * -1)
    });
    $("#jog_zdown").click(function () {
        self.sendJogCommand("z", multiplier)
    });
    $(".jog_zhome").click(function () {
        self.sendHomeCommand("z")
    })
});
