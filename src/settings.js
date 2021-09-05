

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
        hint:"Smaller Numbers give longer nights",
        scope: "world",
        config: true,
        default: 0.13,
        type: Number
    });

    game.settings.register("day-night-cycle", "stepsize", {
        name: "Lighting Step Size (Default)",
        hint:"Size of jumps when adjusting light levels - High number bigger jumps but less often.",
        scope: "world",
        config: true,
        default: 0.005,
        type: Number
    });
};
