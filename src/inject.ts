import {addButton, addCheckbox, visibleMenu, setCurrentSpeed, viewInit} from './modules/view';
import * as GatherHook from './modules/gather_hook';
import * as CspHook from './modules/csp_hook';
import {getCustomTeleportPos, getMenuIsOpened, getMenuPos, setMenuPos, setCustomTeleportPos, setMenuIsOpened, setOoBIsEnabled, getOoBIsEnabled} from './modules/localstorage';
import {DATA_I18N_KEY} from './constants';
import {sleep} from './util';

const MAX_CNT = 10;

// state
let autoWarpIntervalId: number | null = null;

const randomWarp = () => {
    const maps = Object.values(gameSpace.mapState);
    const {id: mapId, dimensions: [mapWidth, mapHeight]} = maps[Math.floor(Math.random() * maps.length)];
    const x = Math.floor(Math.random() * mapWidth);
    const y = Math.floor(Math.random() * mapHeight);
    game.teleport(mapId, x, y);
};

const main = async() => {
    // ページ読み込み後のタイミングではgame, gameSpaceがないケースがある
    for (let i = 0; i < MAX_CNT; i++) {
        if ('game' in window && 'gameSpace' in window && 'newrelic' in window) {
            break;
        }
        await sleep(1500);
    }

    CspHook.attach();

    viewInit(
        getMenuPos(),
        (menuPos: {x: number, y: number}) => setMenuPos(menuPos),
        getMenuIsOpened(),
        (isOpened: boolean) => setMenuIsOpened(isOpened)
    );
    // addButton('currentPosGroup', 'SAVE', () => {
    //     const label = window.prompt('Label');
    //     if (label) {
    //         const {id: mapId} = gameSpace.getCurrentMap();
    //         const {x, y} = gameSpace.getMyPredictedPos();
    //         setCustomTeleportPos(game.spaceId, {mapId, x, y, label});
    //     }
    // });

    // Teleport
    addButton('teleport', 'AUTO', button => {
        if (autoWarpIntervalId !== null) {
            button.setAttribute(DATA_I18N_KEY, 'AUTO');
            window.clearInterval(autoWarpIntervalId);
            autoWarpIntervalId = null;
            return;
        }
        button.setAttribute(DATA_I18N_KEY, 'STOP');
        autoWarpIntervalId = window.setInterval(() => {randomWarp()}, 2000);
    });
    addButton('teleport', 'RANDOM', () => {randomWarp()});
    // getCustomTeleportPos(game.spaceId).forEach(pos => {
    //     addButton('customTeleport', pos.label, () => {game.teleport(pos.mapId, pos.x, pos.y)});
    // });
    // Speed mod
    GatherHook.attachGetMyPredictedPos();
    [1, 2, 3, 4].forEach(s => addButton('speed', 'x' + s, () => {
        game.setSpeedModifier(s);
        setCurrentSpeed(s);
    }));
    // Misc
    const ooBIsEnabled = getOoBIsEnabled();
    ooBIsEnabled && GatherHook.attachMove();
    addCheckbox('misc', 'ENABLE_OOB', ooBIsEnabled, checked => {
        checked ? GatherHook.attachMove() : GatherHook.detachMove();
        setOoBIsEnabled(checked);
    });
    addButton('misc', 'GOKART_GEN', () => {game.interact('GOKART')});
    document.pictureInPictureEnabled && addButton('misc', 'MAIN_PINP', () => {document.querySelector<HTMLVideoElement>('.GameCanvasContainer-main video')?.requestPictureInPicture()});

            const removeHeartbeatEvent = game.subscribeToEvent('serverHeartbeat', () => {
                visibleMenu();
                removeHeartbeatEvent();
            });
};

main();

export {};
