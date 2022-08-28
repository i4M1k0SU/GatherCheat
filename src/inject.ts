import {addButton, addCheckbox, visibleMenu, setCurrentSpeed, viewInit} from './modules/view';
import * as GatherHook from './modules/gather_hook';
import * as CspHook from './modules/csp_hook';
import {getCustomTeleportPos, getMenuIsOpened, getMenuPos, setMenuPos, setCustomTeleportPos, setMenuIsOpened} from './modules/localstorage';

const randomWarp = () => {
    const maps = Object.values(gameSpace.mapState);
    const {id: mapId, dimensions: [mapWidth, mapHeight]} = maps[Math.floor(Math.random() * maps.length)];
    const x = Math.floor(Math.random() * mapWidth);
    const y = Math.floor(Math.random() * mapHeight);
    game.teleport(mapId, x, y);
};

let autoWarpIntervalId: number | null = null;

const main = () => {
    CspHook.attach();
    const removeHeartbeatEvent = game.subscribeToEvent('serverHeartbeat', () => {
        visibleMenu();
        GatherHook.attachGetMyPredictedPos();
        removeHeartbeatEvent();
    });

    viewInit(
        getMenuPos(),
        (menuPos: {x: number, y: number}) => setMenuPos(menuPos),
        getMenuIsOpened(),
        (isOpened: boolean) => setMenuIsOpened(isOpened)
    );
    // addButton('currentPosGroup', 'Save', () => {
    //     const label = window.prompt('Label');
    //     if (label) {
    //         const {id: mapId} = gameSpace.getCurrentMap();
    //         const {x, y} = gameSpace.getMyPredictedPos();
    //         setCustomTeleportPos(game.spaceId, {mapId, x, y, label});
    //     }
    // });

    // Teleport
    addButton('teleport', 'Auto', button => {
        if (autoWarpIntervalId !== null) {
            button.innerText = 'Auto';
            window.clearInterval(autoWarpIntervalId);
            autoWarpIntervalId = null;
            return;
        }
        button.innerText = 'Stop';
        autoWarpIntervalId = window.setInterval(() => {randomWarp()}, 2000);
    });
    addButton('teleport', 'Random', () => {randomWarp()});
    // getCustomTeleportPos(game.spaceId).forEach(pos => {
    //     addButton('customTeleport', pos.label, () => {game.teleport(pos.mapId, pos.x, pos.y)});
    // });
    // Speed mod
    [1, 2, 3, 4].forEach(s => addButton('speed', 'x' + s, () => {
        game.setSpeedModifier(s);
        setCurrentSpeed(s);
    }));
    // Misc
    addCheckbox('misc', 'Enable OoB', false, checked => {checked ? GatherHook.attachMove() : GatherHook.detachMove()});
    addButton('misc', 'GOKART Gen', () => {game.interact('GOKART')});
    addButton('misc', 'Main PinP', () => {document.querySelector<HTMLVideoElement>('.GameCanvasContainer-main video')?.requestPictureInPicture()});
};

main();

export {};
