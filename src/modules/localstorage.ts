const PREFIX = 'GATHER-CHEAT-MENU_';
const MENU_POS = PREFIX + 'memu_pos';
const MENU_IS_OPENED =  PREFIX + 'menu_is_opened';
const CUSTOM_TELEPORT_POS = PREFIX + 'custom_teleport_pos';
const OOB_IS_ENABLED = PREFIX + 'oob_is_enabled';

export const getMenuPos = (): {x: number, y: number} => {
    const value = localStorage.getItem(MENU_POS);
    if (!value) {
        return {x: 0, y: 0};
    }
    return JSON.parse(value);
};

export const setMenuPos = (value: {x: number, y: number}) => {
    localStorage.setItem(MENU_POS, JSON.stringify(value));
};

export const getMenuIsOpened = (): boolean => {
    return localStorage.getItem(MENU_IS_OPENED) === '1';
}

export const setMenuIsOpened = (value: boolean) => {
    localStorage.setItem(MENU_IS_OPENED, value ? '1' : '0');
};

type CustomTeleportPos = {label: string, mapId: string, x: number, y: number};

export const getCustomTeleportPos = (spaceId: string): CustomTeleportPos[] => {
    const value = localStorage.getItem(CUSTOM_TELEPORT_POS + '_' + spaceId);
    if (!value) {
        return [];
    }
    return JSON.parse(value);
};

export const setCustomTeleportPos = (spaceId: string, value: CustomTeleportPos) => {
    const current = getCustomTeleportPos(spaceId);
    current.push(value);
    localStorage.setItem(CUSTOM_TELEPORT_POS + '_' + spaceId, JSON.stringify(current));
};

export const getOoBIsEnabled = (): boolean => {
    return localStorage.getItem(OOB_IS_ENABLED) === '1';
}

export const setOoBIsEnabled = (value: boolean) => {
    localStorage.setItem(OOB_IS_ENABLED, value ? '1' : '0');
};
