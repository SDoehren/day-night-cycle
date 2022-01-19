import {registerSettings} from './settings.js';

'use strict';

Hooks.once('init', async () => {
    console.log('day-night-cycle | Initializing tension-pool');
    registerSettings();
});

function DEBUG(message){
    if (game.settings.get("day-night-cycle",'Debug')) {
        console.log(message);
    }
}

Hooks.on("ready", () => {

    if (game.settings.get("day-night-cycle", "first-load") && game.user.isGM){
        let message = "Hi,<br>Thanks for installing Day Night Cycle<br>" +
            "I recommend you goto<br>" +
            "https://sdoehren.com/daynightcycle<br>" +
            "before you make any changes to the default settings.<br>" +
            "This message will not be shown again.<br><br>" +
            "All the best,<br>SDoehren<br>Discord Server: https://discord.gg/QNQZwGGxuN"
        ChatMessage.create({whisper:ChatMessage.getWhisperRecipients("GM"),content: message,speaker:ChatMessage.getSpeaker({alias: "Day Night Cycle"})}, {});
        game.settings.set("day-night-cycle", "first-load",false)
    }

    let CURRENTMESSAGE = 1;
    if (game.settings.get("day-night-cycle", "message-number")<CURRENTMESSAGE && game.user.isGM){
        let message = "Hi,<br>Thanks for updating Day Night Cycle<br>" +
            "Please note that the Moon Effects are only available when the game language is set to English; a fix is being investigated.<br><br>" +
            "This message will not be shown again.<br><br>" +
            "All the best,<br>SDoehren<br>Discord Server: https://discord.gg/QNQZwGGxuN"
        ChatMessage.create({whisper:ChatMessage.getWhisperRecipients("GM"),content: message,speaker:ChatMessage.getSpeaker({alias: "Day Night Cycle"})}, {});
        game.settings.set("day-night-cycle", "message-number",CURRENTMESSAGE)
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
    let moonstrength;
    let moononchecked;
    let MaxLight;

    if (DNCflags===undefined){
        sheet.object.setFlag("day-night-cycle", "active", game.settings.get("day-night-cycle", "default-on"))
        if (game.settings.get("day-night-cycle", "default-on")){
            activechecked = "checked";
        } else {
            activechecked = "";
        }

        if (game.settings.get("day-night-cycle", "moonon")){
            moononchecked = "checked";
        } else {
            moononchecked = "";
        }

        defaultchecked = "checked";

        sd = game.settings.get("day-night-cycle", "sd");
        stepsize = game.settings.get("day-night-cycle", "stepsize");
        moonstrength = game.settings.get("day-night-cycle", "moonstrength");
        MaxLight = game.settings.get("day-night-cycle", "MaxLight");



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
        let moononflag = DNCflags.moonon;
        moononchecked = "";

        if (currentdefaultflag === true || currentdefaultflag === undefined) {
            defaultchecked = "checked";
        }

        if (moononflag === true || moononflag === undefined) {
            moononchecked = "checked";
        }


        if (currentdefaultflag === true || currentdefaultflag === undefined) {
            sd = game.settings.get("day-night-cycle", "sd")
            stepsize = game.settings.get("day-night-cycle", "stepsize")
            moonstrength = game.settings.get("day-night-cycle", "moonstrength")
            MaxLight = game.settings.get("day-night-cycle", "MaxLight")
        } else {
            let currentsdflag = DNCflags.sd;
            if (currentsdflag === undefined) {
                sd = game.settings.get("day-night-cycle", "sd")
                stepsize = game.settings.get("day-night-cycle", "stepsize")
                moonstrength = game.settings.get("day-night-cycle", "moonstrength")
                MaxLight = game.settings.get("day-night-cycle", "MaxLight")
            } else {
                sd = DNCflags.sd
                stepsize = DNCflags.stepsize
                moonstrength = DNCflags.moonstrength
                MaxLight = DNCflags.MaxLight
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
<div class="form-group">
    <label>Moons effect lighting</label>
    <div class="form-fields">
        <label class="checkbox">
            <input type="checkbox" id="DNC.moononflag" name="DNC.moononflag" ` + moononchecked + `>
        </label>
    </div>
    <p class="notes">Turns on moon effects for this scene.</p>
</div>

<div class="form-group">
    <label>Moon Brightness at Full Moon</label>
    <div class="form-fields">
        <input type="number" name="DNC.moonstrength" min="0.01" max="1.00" value="`+moonstrength+`" step="0.01" data-dtype="Number">
    </div>
</div>

<div class="form-group">
    <label>Max Brightness for Scene</label>
    <div class="form-fields">
        <input type="number" name="DNC.MaxLight" min="0.01" max="1.00" value="`+MaxLight+`" step="0.01" data-dtype="Number">
    </div>
    <p class="notes">For worlds that do not reach full light.</p>
</div>
`);

})


Hooks.once("init", () => {
    libWrapper.register("day-night-cycle", "SceneConfig.prototype._getSubmitData", function (wrapped, ...args) {
        let event = this.form;
        let configscene = this.object;

        const moonon = $(event)
            .find('input[name="DNC.moononflag"]')
            .prop("checked");
        configscene.setFlag("day-night-cycle", "moonon", moonon)

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

        const moonstrength = $(event)
            .find('input[name="DNC.moonstrength"]')
            .val();
        configscene.setFlag("day-night-cycle", "moonstrength", moonstrength)

        const MaxLight = $(event)
            .find('input[name="DNC.MaxLight"]')
            .val();
        configscene.setFlag("day-night-cycle", "MaxLight", MaxLight)

        DEBUG(active,defaultval,sd,stepsize)

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
        canvas.scene.setFlag("day-night-cycle", "moonon", game.settings.get("day-night-cycle", "moonon"))
        canvas.scene.setFlag("day-night-cycle", "moonstrength", game.settings.get("day-night-cycle", "moonstrength"))
        canvas.scene.setFlag("day-night-cycle", "MaxLight", game.settings.get("day-night-cycle", "MaxLight"))
        return;
    }

    let currentactiveflag = DNCflags.active;
    let sd = DNCflags.sd;
    let stepsize= DNCflags.stepsize;
    let defaultmode= DNCflags.default;
    let moonon= DNCflags.moonon;
    let moonstrength= DNCflags.moonstrength;

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

    if (moonon === undefined){
        console.log('day-night-cycle | setting moonon flag');
        canvas.scene.setFlag("day-night-cycle", "moonon", game.settings.get("day-night-cycle", "moonon"))
    }

    if (moonstrength === undefined){
        console.log('day-night-cycle | setting moonstrength flag');
        canvas.scene.setFlag("day-night-cycle", "moonstrength", game.settings.get("day-night-cycle", "moonstrength"))
    }

    if (moonstrength === undefined){
        console.log('day-night-cycle | setting MaxLight flag');
        canvas.scene.setFlag("day-night-cycle", "MaxLight", game.settings.get("day-night-cycle", "MaxLight"))
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

        let hoursinday = SimpleCalendar.api.getTimeConfiguration().hoursInDay;
        let minutesinhour = SimpleCalendar.api.getTimeConfiguration().minutesInHour;

        DEBUG([hoursinday,minutesinhour])

        let lastS = 1 - game.scenes.active.data.darkness;
        let visioncutoff = 1 - game.scenes.active.data.globalLightThreshold;

        function score(sd, mean, X) {
            return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((X - mean) / sd) ** 2))
        }

        const minscore = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((0 - mean) / sd) ** 2))
        const maxscore = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (((0.5 - mean) / sd) ** 2))
        const divisor = maxscore - minscore



        let MaxLight = activesceneflags.MaxLight
        if (MaxLight===undefined){MaxLight = game.settings.get("day-night-cycle", "MaxLight")}

        let s = ((score(sd, mean, (dt.hour * minutesinhour + dt.minute) / (hoursinday * minutesinhour)) - minscore) / divisor);
        s = s*MaxLight
        DEBUG(["score",s])

        let Moonvalues;
        if (((dt.hour * minutesinhour + dt.minute) / (hoursinday * minutesinhour)) - minscore > 0.5){
            Moonvalues = SimpleCalendar.api.getAllMoons().map(x=>x.currentPhase.name)
            game.settings.set("day-night-cycle", "currentmoonphases", JSON.stringify(Moonvalues))
        } else {
            Moonvalues = JSON.parse(game.settings.get("day-night-cycle", "currentmoonphases"));
        }
        DEBUG(["Moonvalues",Moonvalues])

        let steppedS;
        let update = true;
        let steppedStype;
        if (s < definition) {
            steppedS = 0
            steppedStype=1
        } else if (1 - s < definition) {
            steppedS = 1
            steppedStype=2
        }  else if (lastS < visioncutoff && s >= visioncutoff) {
            steppedS = s
            steppedStype=3
        } else if (lastS > visioncutoff && s <= visioncutoff) {
            steppedS = s
            steppedStype=4
        } else if (Math.abs(s - lastS) < definition) {
            update = false
            steppedStype=5
        } else {
            steppedS = Math.round(s / definition) * definition
            steppedStype=6
            if (s - lastS > 0) {
                steppedS += definition / 2
            } else {
                steppedS -= definition / 2
            }
        }
        DEBUG(["steppedS",steppedS])

        if (steppedS > visioncutoff && s <= visioncutoff) {
            steppedS = parseFloat(visioncutoff) - 0.001
        } else if (steppedS < visioncutoff && s >= visioncutoff) {
            steppedS = parseFloat(visioncutoff) + 0.001
        }
        DEBUG(["parseFloat steppedS",steppedS])

        if (Math.abs(steppedS - lastS) === 0) {
            update = false
        }
        DEBUG(["Math.abs steppedS",steppedS])

        let dark = 1 - steppedS
        DEBUG(["dark 1 ",dark])

        let MoonStages = {
            "New Moon":0.0,
            "Waxing Crescent":0.25,
            "First Quarter":0.50,
            "Waxing Gibbous":0.75,
            "Full Moon":1.0,
            "Waning Gibbous":0.75,
            "Last Quarter":0.50,
            "Waning Crescent":0.25,
        }

        Moonvalues= Moonvalues.map(x=>MoonStages[x])
        let moonmax = activesceneflags.moonstrength
        if (moonmax===undefined){moonmax = game.settings.get("day-night-cycle", "moonstrength")}
        let combinedbrightness = Moonvalues.reduce((a, b) => a + b, 0)
        let finalmoonbrightness = combinedbrightness*(dark*moonmax)
        DEBUG(["Moonvalues Final",Moonvalues,moonmax,dark,combinedbrightness,finalmoonbrightness])
        if (!isNaN(finalmoonbrightness)) {
            dark = dark - finalmoonbrightness
        }
        DEBUG(["dark 2",dark])

        if (dark<0){dark=0}
        if (dark>1){dark=1}

        DEBUG(["dark final",dark])

        DEBUG("update:"+update+"| s:"+s+"| visioncutoff:"+visioncutoff+"| lastS:"+lastS+"| steppedS:"+steppedS+"| dark:"+dark)
        if (update) {
            Hooks.call("day-night-cycle-darknessupdated", dark);
            game.scenes.active.update({"darkness": dark}, {animateDarkness: 500});
        }
    }
})