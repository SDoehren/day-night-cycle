

export const registerSettings = function () {
    game.settings.register("day-night-cycle", "first-load", {
        scope: "world",
        config: false,
        default: true,
        type: Boolean
    });

    game.settings.register("day-night-cycle", "default-on", {
        name: "Default to On",
        hint:"Should Day Night Cycle activate on scenes by default?",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register("day-night-cycle", "sd", {
        name: "Day Length Metric (Default)",
        hint:"Smaller Numbers give more night",
        scope: "world",
        config: true,
        default: 0,
        type: Number
    });
};
