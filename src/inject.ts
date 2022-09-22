import {addButton, addCheckbox, visibleMenu, setCurrentSpeed, viewInit} from './modules/view';
import * as GatherHook from './modules/gather_hook';
import * as CspHook from './modules/csp_hook';
import {getCustomTeleportPos, getMenuIsOpened, getMenuPos, setMenuPos, setCustomTeleportPos, setMenuIsOpened} from './modules/localstorage';
import {DATA_I18N_KEY} from './constants';
import {sleep} from './util';

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
    [1, 2, 3, 4].forEach(s => addButton('speed', 'x' + s, () => {
        game.setSpeedModifier(s);
        setCurrentSpeed(s);
    }));
    // Misc
    addCheckbox('misc', 'ENABLE_OOB', false, checked => {checked ? GatherHook.attachMove() : GatherHook.detachMove()});
    addButton('misc', 'GOKART_GEN', () => {game.interact('GOKART')});
    document.pictureInPictureEnabled && addButton('misc', 'MAIN_PINP', () => {document.querySelector<HTMLVideoElement>('.GameCanvasContainer-main video')?.requestPictureInPicture()});

    // ページ読み込み後のタイミングではgameがないケースがある
    for (let i = 0; i < 10; i++) {
        if ('game' in window) {
            const removeHeartbeatEvent = game.subscribeToEvent('serverHeartbeat', () => {
                visibleMenu();
                GatherHook.attachGetMyPredictedPos();
                removeHeartbeatEvent();
            });
            break;
        }
        await sleep(2000);
    }
};

main();

export {};
