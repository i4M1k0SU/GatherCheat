import {setCurrentPos, setCurrentSpeed} from './view';

let gameMoveOrig: typeof game.move;
let gameSpaceGetMyPredictedPosOrig: typeof gameSpace.getMyPredictedPos;

export const attachMove = () => {
    gameMoveOrig = game.move;
    game.move = function (dir: Direction, stopped: boolean, targetId: number) {
        // 向きを変えるだけの時
        if (stopped) {
            return gameMoveOrig.call(this, dir, stopped, targetId);
        }

        const {id: mapId, portals} = gameSpace.getCurrentMap();
        const {x: beforeX, y: beforeY} = gameSpace.getMyPredictedPos();
        const result = gameMoveOrig.call(this, dir, stopped, targetId);
        const {x: afterX, y: afterY} = gameSpace.getMyPredictedPos();

        // 出入り口付近ではマップ移動に支障が出るので壁抜けできないようにする
        if (!!portals.find(p => mapId !== p.targetMap && p.x - 1 <= beforeX && p.x + 1 >= beforeX && p.y - 1 <= beforeY && p.y + 1 >= beforeY)) {
            return result;
        }

        switch (dir) {
            case 0: // Left
                if (beforeX === afterX) {
                    game.teleport(mapId, afterX - 1, afterY);
                }
                break;
            case 1: // Right
                if (beforeX === afterX) {
                    game.teleport(mapId, afterX + 1, afterY);
                }
                break;
            case 2: // Up
                if (beforeY === afterY) {
                    game.teleport(mapId, afterX, afterY - 1);
                }
                break;
            case 3: // Down
                if (beforeY === afterY) {
                    game.teleport(mapId, afterX, afterY + 1);
                }
                break;
        }
    
        return result;
    };
};

export const detachMove = () => {
    if (gameMoveOrig) {
        game.move = gameMoveOrig;
    }
};

export const attachGetMyPredictedPos = () => {
    gameSpaceGetMyPredictedPosOrig = gameSpace.getMyPredictedPos;
    gameSpace.getMyPredictedPos = function (arg) {
        // 壁衝突判定を誤魔化す
        if (arg?.length && !arg[0].stopped) {
            const currentPos = gameSpaceGetMyPredictedPosOrig.call(this);
            const nextPos = gameSpaceGetMyPredictedPosOrig.call(this, arg);
            // 座標が変わる時は衝突しないのでそのまま
            if (nextPos.x !== currentPos.x || nextPos.y !== currentPos.y) {
                return nextPos;
            }

            return {x: -1, y: -1};
        }
        const result = gameSpaceGetMyPredictedPosOrig.call(this, arg);
        if (result) {
            setCurrentPos({mapId: result.map, x: result.x, y: result.y});
            if (typeof result.speedModifier === 'number') {
                setCurrentSpeed(result.speedModifier);
            }
        }
        return result;
    };
};

export const detachGetMyPredictedPos = () => {
    if (gameSpaceGetMyPredictedPosOrig) {
        gameSpace.getMyPredictedPos = gameSpaceGetMyPredictedPosOrig;
    }
}
