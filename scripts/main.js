import { world, Player, EntityQueryOptions, EntityQueryScoreOptions } from 'mojang-minecraft';
import { ModalFormData, ActionFormData } from 'mojang-minecraft-ui';
Object.prototype.forEach = function (callback) {
    for (const key in this) {
        if (key === 'forEach') { continue; }
        return callback(key, this[key]);
    }
};
function objectiveadd(objective, displayName = '') {
    try {
        this.runCommand(`scoreboard objectives add ${objective} dummy ${displayName}`);
        return true;
    } catch {
        return;
    }
}
Object.assign(Player.prototype, {
    runCommands: function () {
        const commands = (typeof arguments[0] === array) ? arguments[0] : [...arguments];
        const returns = [];
        commands.forEach(command => returns.push(this.runCommand(command)));
        return returns;
    },
    getName: function () {
        return (/"|\\/.test(this.nameTag)) ? this.nameTag = this.nameTag.replace(/"|\\/) : this.nameTag;
    },
    scoreAdd: function (objective, amount = 0) {
        try {
            return this.runCommand(`scoreboard players add @s ${objective} ${amount}`).statusMessage.match(/-?\d+(?=\)$)/).toNumber();
        } catch {
            return true;
        }
    },
    scoreTest: function (objective, initialise = false) {
        try {
            return this.runCommand(`scoreboard players test @s ${objective} *`).statusMessage.match(/-?\d+/).toNumber();
        } catch {
            if (initialise) {
                objectiveadd(objective);
                return this.scoreAdd(objective);
            } else {
                return;
            }
        }
    }
});
const stringFunctions = {
    toNumber: function () {
        return Number(this);
    },
    round: function (place) {
        return Math.round(Number(this) * 10 ** place) / 10 ** place;
    },
    floor: function (place) {
        return Math.floor(Number(this) * 10 ** place) / 10 ** place;
    },
    ceil: function (place) {
        return Math.ceil(Number(this) * 10 ** place) / 10 ** place;
    },
    trunc: function () {
        return Math.trunc(Number(this));
    },
    dec: function () {
        return Number(this) % 1;
    },
};
Object.assign(Number.prototype, stringFunctions);
Object.assign(String.prototype, stringFunctions);
Object.assign(Array.prototype, stringFunctions);

Array.prototype.delete = function (index) {
    return this.filter(item => item === !this[index]);
};
Array.prototype.deleteIncludes = function (any) {
    return this.filter(item => item === !any);
};
let joiningPlayers = [];
let playerMap = new Map();
world.events.playerJoin.subscribe(({ player }) => {
    joiningPlayers.unshift(player);
});
world.events.playerLeave.subscribe(({ playerName }) => {
    playerMap.delete(playerName);
});

world.events.tick.subscribe(({ currentTick }) => {
    console.warn(joiningPlayers);
    for (const player in joiningPlayers) {
        try {
            player.runCommand('testfor @s');
            player.runCommand('say joined');
            try { joiningPlayers = joiningPlayers.delete(player); } catch (error) { console.warn(error, error.stack); }
        } catch { }
    }
    let players = [...world.getPlayers()].filter(player => !joiningPlayers.some(join => player.getName() === join));
    if (players.length) {

    }


});
world.events.beforeItemUse.subscribe(({ item, source }) => {
    try {

        switch (item.id) {
            case 'minecraft:dirt':
                UI.textbox(source);
                break;
            case 'minecraft:stone':
                UI.buttonUI(source);
        }

    } catch (error) {
        console.warn(error, error.stack);
    }
});
const MainMenus = {
    teleprorts: (player) => new ActionFormData()
        .title('§l§9Player GUI')
        .button('§l§bSpawn')
        .button('§l§gShop')
        .show(player)
        .then(({ selection }) => {
            try {

            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    moderatorMenu: (player) => {
        const modeMode = player.scoreTest('modMode', true);
        new ActionFormData()
            .title('§l§9Player GUI')
            .button(`§l§2Moderator §7Mode: ${(modeMode) ? '§aON' : '§cOFF'}`)
            .button('')
            .button('§l§cBack')
            .show(player)
            .then(({ selection }) => {
                try {
                    [
                        player.scoreSet('modMode', (modeMode) ? 0 : 1)
                    ][selection];
                    MainMenus.moderatorMenu();
                } catch (error) {
                    console.warn(error, error.stack);
                }
            });
    },
};

const secondaryMenuPopups = {

};
const GUIS = [
    (player) => new ActionFormData()
        .title('§l§9Player GUI')
        .button('§l§bTeleports')
        .button('§l§gShop')
        .show(player)
        .then(({ selection }) => {
            try {

            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('§l§aTrial Moderator')
        .button('§l§bTeleports')
        .button('§l§gShop')
        .button('§l§aModerator Options')
        .show(player)
        .then(({ selection }) => {
            try {

            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('§l§2Moderator')
        .button('§l§bTeleports')
        .button('§l§gShop')
        .button('§l§aModerator Menu')
        .button('§l§7Spectate Menu')
        .show(player)
        .then(({ selection }) => {
            try {

            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('Trial Builder')
        .textField('text', 'input text!')
        .show(player)
        .then(({ selection }) => {
            try {

            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('Builder')
        .textField('text', 'input text!')
        .show(player)
        .then(({ selection }) => {
            try {

            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('Senior Moderator')
        .textField('text', 'input text!')
        .show(player)
        .then(({ selection }) => {
            try {

            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('Senior Builder')
        .textField('text', 'input text!')
        .show(player)
        .then(({ formValues }) => {
            try {
                console.warn(JSON.stringify(formValues));
            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('Administrator')
        .textField('text', 'input text!')
        .show(player)
        .then(({ formValues }) => {
            try {
                console.warn(JSON.stringify(formValues));
            } catch (error) {
                console.warn(error, error.stack);
            }
        }),
    (player) => new ActionFormData()
        .title('Owner')
        .textField('text', 'input text!')
        .show(player)
        .then(({ formValues }) => {
            try {
                console.warn(JSON.stringify(formValues));
            } catch (error) {
                console.warn(error, error.stack);
            }
        }),


];
const UI = {
    textbox: function (player) {
        new ModalFormData()
            .title('Text Box')
            .textField('text', 'input text!')
            .show(player)
            .then(({ formValues }) => {
                try {
                    console.warn(JSON.stringify(formValues));
                } catch (error) {
                    console.warn(error, error.stack);
                }
            });
    },
    buttonUI: function (player) {
        const rank = player.scoreTest('Rank', true);
        GUIS[rank](player);
    }
};