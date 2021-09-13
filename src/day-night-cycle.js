import {registerSettings} from './settings.js';

'use strict';




Hooks.once('init', async () => {
    console.log('day-night-cycle | Initializing tension-pool');
    registerSettings();
});



Hooks.on("ready", () => {

    if (game.settings.get("day-night-cycle", "first-load") && game.user.isGM){
        let message = "Hi,<br>Thanks for installing Day Night Cycle<br>I recommend you goto<br>https://sdoehren.com/daynightcycle<br>" +
            "before you make any changes to the default settings.<br>This message will not be shown again.<br>" +
            "All the best,<br>SDoehren<br>Discord Server: https://discord.gg/QNQZwGGxuN"
        ChatMessage.create({whisper:ChatMessage.getWhisperRecipients("GM"),content: message,speaker:ChatMessage.getSpeaker({alias: "Day Night Cycle"})}, {});
        game.settings.set("day-night-cycle", "first-load",false)
    }
    console.log('day-night-cycle | Ready');
});

Hooks.on("renderSceneConfig", (sheet, html, data) => {

    let DNCflags = sheet.object.data.flags["day-night-cycle"]
    let currentactiveflag;
    let activechecked;
    let defaultchecked;
    let sd;
    let stepsize;

    if (DNCflags===undefined){
        sheet.object.setFlag("day-night-cycle", "active", game.settings.get("day-night-cycle", "default-on"))
        if (game.settings.get("day-night-cycle", "default-on")){
            activechecked = "checked";
        } else {
            activechecked = "";
        }

        defaultchecked = "checked";

        sd = game.settings.get("day-night-cycle", "sd");
        stepsize = game.settings.get("day-night-cycle", "stepsize");


    } else {
        currentactiveflag = DNCflags.active;
        if (currentactiveflag === undefined) {
            currentactiveflag = game.settings.get("day-night-cycle", "default-on")
        } else {
            currentactiveflag = currentactiveflag === true
        }
        activechecked = "";
        if (currentactiveflag) {
            activechecked = "checked"
        }

        let currentdefaultflag = DNCflags.default;
        defaultchecked = "";

        if (currentdefaultflag === true || currentdefaultflag === undefined) {
            defaultchecked = "checked";
        }


        if (currentdefaultflag === true || currentdefaultflag === undefined) {
            sd = game.settings.get("day-night-cycle", "sd")
            stepsize = game.settings.get("day-night-cycle", "stepsize")
        } else {
            let currentsdflag = DNCflags.sd;
            if (currentsdflag === undefined) {
                sd = game.settings.get("day-night-cycle", "sd")
                stepsize = game.settings.get("day-night-cycle", "stepsize")
            } else {
                sd = DNCflags.sd
                stepsize = DNCflags.stepsize
            }
        }
    }




    html.find(`input[name="globalLightThreshold"]`).parent().parent().after(`\
<div class="form-group">
    <label>Day Night Cycle</label>
    <div class="form-fields">
        <label class="checkbox">
            <input type="checkbox" id="DNC.active" name="DNC.active" ` + activechecked + `>
        </label>
    </div>
    <p class="notes">Turns on the Day Night Cycle for this scene.</p>
</div>

<div class="form-group">
    <label>Use Default Day Night Cycle Settings</label>
    <div class="form-fields">
        <label class="checkbox">
            <input type="checkbox" id="DNC.default" name="DNC.default" ` + defaultchecked + `>
        </label>
    </div>
    <p class="notes">If ticked the following Day Night Cycle settings will be ignored.</p>
</div>

<div class="form-group">
    <label>Day Length Metric</label>
    <div class="form-fields">
        <input type="number" name="DNC.sd" min="0.01" value="`+sd+`" step="0.01" data-dtype="Number">
    </div>
    <p class="notes">Turns on the Day Night Cycle for this scene.</p>
</div>
<div class="form-group">
    <label>Lighting Step Size</label>
    <div class="form-fields">
        <input type="number" name="DNC.stepsize" min="0.001" value="`+stepsize+`" step="0.001" data-dtype="Number">
    </div>
    <p class="notes">Size of jumps when adjusting light levels - High number bigger jumps but less often.</p>
</div>
`);

})


Hooks.once("init", () => {
    libWrapper.register("day-night-cycle", "SceneConfig.prototype._getSubmitData", function (wrapped, ...args) {
        let event = this.form;
        let configscene = this.object;

        const active = $(event)
            .find('input[name="DNC.active"]')
            .prop("checked");
        configscene.setFlag("day-night-cycle", "active", active)

        const defaultval = $(event)
            .find('input[name="DNC.default"]')
            .prop("checked");
        configscene.setFlag("day-night-cycle", "default", defaultval)

        const sd = $(event)
            .find('input[name="DNC.sd"]')
            .val();
        configscene.setFlag("day-night-cycle", "sd", sd)

        const stepsize = $(event)
            .find('input[name="DNC.stepsize"]')
            .val();
        configscene.setFlag("day-night-cycle", "stepsize", stepsize)

        console.log(active,defaultval,sd,stepsize)

        return wrapped(...args);
    }, 'WRAPPER');

})


Hooks.once("canvasReady",async (canvas)=>{

    let DNCflags = canvas.scene.data.flags["day-night-cycle"]
    if (DNCflags === undefined){
        console.log('day-night-cycle | setting flags');
        canvas.scene.setFlag("day-night-cycle", "active", game.settings.get("day-night-cycle", "default-on"))
        canvas.scene.setFlag("day-night-cycle", "sd", game.settings.get("day-night-cycle", "sd"))
        canvas.scene.setFlag("day-night-cycle", "stepsize", game.settings.get("day-night-cycle", "stepsize"))
        canvas.scene.setFlag("day-night-cycle", "default", true)
        return;
    }

    let currentactiveflag = DNCflags.active;
    let sd = DNCflags.active;
    let stepsize= DNCflags.active;
    let defaultmode= DNCflags.default;

    if (currentactiveflag === undefined){
        console.log('day-night-cycle | setting active flag');
        canvas.scene.setFlag("day-night-cycle", "active", game.settings.get("day-night-cycle", "default-on"))
    }

    if (sd === undefined){
        console.log('day-night-cycle | setting sd flag');
        canvas.scene.setFlag("day-night-cycle", "sd", game.settings.get("day-night-cycle", "sd"))
    }

    if (stepsize === undefined){
        console.log('day-night-cycle | setting stepsize flag');
        canvas.scene.setFlag("day-night-cycle", "stepsize", game.settings.get("day-night-cycle", "stepsize"))
    }

    if (defaultmode === undefined){
        console.log('day-night-cycle | setting default flag');
        canvas.scene.setFlag("day-night-cycle", "default", true)
    }
})




Hooks.on('updateWorldTime', async (timestamp,stepsize) => {
    if (game.scenes.active.data.flags["day-night-cycle"].active && game.user.isGM) {
        let dt = SimpleCalendar.api.timestampToDate(timestamp)

        let activesceneflags = game.scenes.active.data.flags["day-night-cycle"];

        let mean = 0.5;
        let sd = activesceneflags.sd;
        let definition = activesceneflags.stepsize;

        if (sd===undefined){sd = game.settings.get("day-night-cycle", "sd")}
        if (definition===undefined){definition = game.settings.get("day-night-cycle", "stepsize")}


        let secondsinday = SimpleCalendar.api.dateToTimestamp({year:0,month:0,day:1,hour:0,minute:0,second:0});
        let secondsinhour = SimpleCalendar.api.dateToTimestamp({year:0,month:0,day:0,hour:1,minute:0,second:0});
        let secondsinminute = SimpleCalendar.api.dateToTimestamp({year:0,month:0,day:0,hour:0,minute:1,second:0});
        let hoursinday = secondsinday/secondsinhour;
        let minutesinhour = secondsinhour/secondsinminute;

        console.log(hoursinday,minutesinhour)

        let lastS = 1 - game.scenes.active.data.darkness;
        let visioncutoff = 1 - game.scenes.active.data.globalLightThreshold;

        function score(sd, mean, X) {
            return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((X - mean) / sd) ** 2))
        }

        const minscore = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((0 - mean) / sd) ** 2))
        const maxscore = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((0.5 - mean) / sd) ** 2))
        const divisor = maxscore - minscore

        let s = ((score(sd, mean, (dt.hour * minutesinhour + dt.minute) / (hoursinday * minutesinhour)) - minscore) / divisor);

        let steppedS;
        let update = true;
        if (s < definition) {
            steppedS = 0
        } else if (1 - s < definition) {
            steppedS = 1
        }  else if (lastS < visioncutoff && s >= visioncutoff) {
            steppedS = s
        } else if (lastS > visioncutoff && s <= visioncutoff) {
            steppedS = s
        } else if (Math.abs(s - lastS) < definition) {
            update = false
        } else {
            steppedS = Math.round(s / definition) * definition
            if (s - lastS > 0) {
                steppedS += definition / 2
            } else {
                steppedS -= definition / 2
            }
        }

        if (steppedS > visioncutoff && s <= visioncutoff) {
            steppedS = parseFloat(visioncutoff) - 0.001
        } else if (steppedS < visioncutoff && s >= visioncutoff) {
            steppedS = parseFloat(visioncutoff) + 0.001
        }

        if (Math.abs(steppedS - lastS) === 0) {
            update = false
        }

        let dark = 1 - steppedS

        console.log(update,s,visioncutoff,lastS,steppedS,dark)
        if (update) {
            Hooks.call("day-night-cycle-darknessupdated", dark);
            game.scenes.active.update({"darkness": dark}, {animateDarkness: 500});
        }
    }
})