import {registerSettings} from './settings.js';

'use strict';




Hooks.once('init', async () => {
    console.log('day-night-cycle | Initializing tension-pool');
    /*registerSettings();*/
});



Hooks.on("ready", () => {

    if (game.settings.get("day-night-cycle", "first-load")){
        let message = "Hi,<br>Thanks for installing Day Night Cycle<br>I recommend you goto<br>https://sdoehren.com/daynightcycle<br>" +
            "before you make any changes to the default settings.<br>This message will not be shown again.<br>" +
            "All the best,<br>SDoehren<br>Discord Server: https://discord.gg/QNQZwGGxuN"
        ChatMessage.create({whisper:ChatMessage.getWhisperRecipients("GM"),content: message,speaker:ChatMessage.getSpeaker({alias: "Day Night Cycle"})}, {});
        game.settings.set("day-night-cycle", "first-load",false)
    }
    console.log('day-night-cycle | Ready');
});

Hooks.on("renderSceneConfig", (sheet, html, data) => {
    let currentflag = sheet.object.data.flags.world.Active;
    currentflag = currentflag === true || currentflag === undefined;
    console.log("flags", currentflag)

    let checked = "";
    if (currentflag) {
        checked = "checked"
    }

    html.find(`input[name="globalLightThreshold"]`).parent().parent().after(`\
        <div class="form-group">
            <label>Day Night Cycle</label>
            <div class="form-fields">
                <label class="checkbox">
                    <input type="checkbox" id="DNC.active" name="DNC.active" ` + checked + `>
                </label>
            </div>
            <p class="notes">Turn on automated lighting of the day night cycle.</p>
        </div>`);

})

Hooks.on("closeSceneConfig", (sceneconfig,event) => {
    console.log("-------------------------------------");

    const Activate = $(event)
                            .find('input[name="DNC.active"]')
                            .prop("checked");
    console.log(sceneconfig.object.flags);

sceneconfig.object.setFlag("world","Active",Activate)

})


Hooks.on('updateWorldTime', async (timestamp,stepsize) => {
    await processtimeupdate()
});