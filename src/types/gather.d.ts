declare const gameSpace: {
    id: number;
    mapId: string;
    gameState: {
      x: number;
      y: number;
    }[];
    mapState: {[key: string]: {
        id: string;
        dimensions: [number, number];
    }};
    getMyPredictedPos: (arg?: [{
        dir: Direction;
        stopped: boolean;
    }]) => {
        x: number;
        y: number;
        map?: string;
        speedModifier?: number;
    };
    getMyPlayerMap: () => {
        id: string;
        portals: {
            x: number;
            y: number;
            targetMap: string;
            targetX: number;
            targetY: number;
        }[];
    };
    getCurrentPrivateArea: () => string;
    getPrivateAreaById: (privateAreaId: string) => {
        allowedUsers: {
            users: string[];
        };
        colored?: boolean;
        isInMeeting?: boolean;
        capacity?: number;
        isDesk?: boolean;
        name: string;
        nookCoords: {
            coords: {x: number, y: number}[];
        };
        requestedUsers?: {
            user: string[];
        };
        restricted?: boolean;
    };
}

type Direction = 0 | 1 | 2 | 3 | 4;

declare const game: {
    spaceId: string;
    connected: boolean;
    hasSentMapSinceConnect: boolean;
    engine: {
        clientUid: string;
    };
    players: {[userId: string]: {
        map: string;
        x: number;
        y: number;
        speedModifier: number;
    }};
    getMyPlayer: () => {
        map: string;
        x: number;
        y: number;
        speedModifier: number;
    } | undefined;
    teleport: (mapId: string, x: number, y: number, targetId?: string, direction?: string) => void;
    setSpeedModifier: (speed: number) => void;
    move: (dir: Direction, stopped: boolean, targetId: number) => void;
    interact: (objId: string, mapId?: string, data?: {[key: string]: string | number | boolean}) => void;
    subscribeToEvent: (event: string, callback: (args: any) => void) => () => void;
    setMapNooks: (mapId: string, nooks: {[privateAreaId: string]: {restricted: boolean}}) => void;
}
