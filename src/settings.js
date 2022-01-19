

export const registerSettings = function () {
    game.settings.register("day-night-cycle", "first-load", {
        scope: "world",
        config: false,
        default: true,
        type: Boolean
    });

    game.settings.register("day-night-cycle", "message-number", {
        scope: "world",
        config: false,
        default: 0,
        type: Number
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
        default: 0.17,
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

    game.settings.register("day-night-cycle", "MaxLight", {
        name: "What is the maximum light level? (Default)",
        hint:"For worlds that do not reach full light.",
        scope: "world",
        config: true,
        default: 1.0,
        type: Number
    });

    game.settings.register("day-night-cycle", "moonon", {
        name: "Moons effect lighting",
        hint:"Should Moons effect the behaviour of Day Night Cycle by default?",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register("day-night-cycle", "moonstrength", {
        name: "Moon Strength (Default)",
        hint:"The strength of light from each moon on a full moon at midnight.",
        scope: "world",
        config: true,
        default: 0.1,
        type: Number
    });

    game.settings.register("day-night-cycle", "currentmoonphases", {
        name: "Current Moon Phase",
        scope: "world",
        config: false,
        default: "{}",
        type: String
    });


    game.settings.register("day-night-cycle", "Debug", {
        name: "Turn on Debug",
        hint:"You probably don't need this on.",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
};
