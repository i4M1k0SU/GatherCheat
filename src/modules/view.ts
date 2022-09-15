import {DATA_I18N_KEY} from '../constants';
import {debounce} from '../util';

const gatherCheatMenu = document.getElementById('gather-cheat-menu') as HTMLDivElement;
const titleBar = document.getElementById('title-bar') as HTMLElement;
const currentPosGroup = document.getElementById('current-pos-group') as HTMLDivElement;
const teleportGroup = document.getElementById('teleport-group') as HTMLDivElement;
const customTeleportGroup = document.getElementById('custom-teleport-group') as HTMLDivElement;
const speedGroup = document.getElementById('speed-group') as HTMLDivElement;
const miscGroup = document.getElementById('misc-group') as HTMLDivElement;
const closeButton = document.getElementById('close-button') as HTMLDivElement;
const menuContent = document.getElementById('menu-content') as HTMLDivElement;
const currentMapId = document.getElementById('current-map-id') as HTMLSpanElement;
const currentXPos = document.getElementById('current-x-pos') as HTMLSpanElement;
const currentYPos = document.getElementById('current-y-pos') as HTMLSpanElement;
const currentSpeed = document.getElementById('current-speed') as HTMLSpanElement;

const pointerRelative = {x: 0, y: 0};
const pointerViewportPosToMenuAbsolutePos = (x: number, y: number) => {
    return {
        x: Math.min(Math.max(x - pointerRelative.x, 0), document.body.clientWidth - gatherCheatMenu.scrollWidth),
        y: Math.min(Math.max(y - pointerRelative.y, 0), document.body.clientHeight - gatherCheatMenu.scrollHeight)
    };
};

const onMouseMove = (e: MouseEvent) => {
    const {x, y} = pointerViewportPosToMenuAbsolutePos(e.clientX, e.clientY);
    gatherCheatMenu.style.top = y + 'px';
    gatherCheatMenu.style.left = x + 'px';
};

type MenuPos = {x: number, y: number};

export const viewInit = (
    menuPos: MenuPos,
    menuPosChanged: (menuPos: MenuPos) => void,
    menuIsOpened: boolean,
    menuOpenChanged: (isOpened: boolean) => void
) => {
    // メニューの高さが変わったらCSS変数を更新する
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(e => {
            menuContent.style.setProperty('--scroll-height', menuContent.scrollHeight + 'px');
        });
    });
    resizeObserver.observe(menuContent, {box : 'border-box'});
    // resizeでウィンドウ外に出ていかないようにする
    window.addEventListener('resize', debounce(() => {
        gatherCheatMenu.style.top = Math.min(gatherCheatMenu.offsetTop, document.body.clientHeight - gatherCheatMenu.scrollHeight) + 'px';
        gatherCheatMenu.style.left = Math.min(gatherCheatMenu.offsetLeft, document.body.clientWidth - gatherCheatMenu.scrollWidth) + 'px';
    }));

    // 初期位置
    gatherCheatMenu.style.top = Math.min(menuPos.y, document.body.clientHeight - gatherCheatMenu.scrollHeight) + 'px';
    gatherCheatMenu.style.left = Math.min(menuPos.x, document.body.clientWidth - gatherCheatMenu.scrollWidth) + 'px';
    // 初期展開
    if (menuIsOpened) {
        gatherCheatMenu.classList.add('open');
    }

    titleBar.addEventListener('mousedown', e => {
        const {left, top} = titleBar.getBoundingClientRect();
        pointerRelative.x = e.pageX - left + window.pageXOffset;
        pointerRelative.y = e.pageY - top + window.pageYOffset;
        document.addEventListener('mousemove', onMouseMove);
    });
    
    titleBar.addEventListener('mouseup', e => {
        document.removeEventListener('mousemove', onMouseMove);
        menuPosChanged(pointerViewportPosToMenuAbsolutePos(e.clientX, e.clientY));
    });

    closeButton.addEventListener('click', () => {
        if (gatherCheatMenu.classList.contains('open')) {
            gatherCheatMenu.classList.remove('open');
            menuOpenChanged(false);
        } else {
            gatherCheatMenu.classList.add('open');
            menuOpenChanged(true);
        }
    });
};

type Groups = 'currentPosGroup' | 'teleport' | 'customTeleport' | 'speed' | 'misc';

const getGroupElement = (group: Groups) => {
    switch (group) {
        case 'currentPosGroup':
            return currentPosGroup;
        case 'teleport':
            return teleportGroup;
        case 'customTeleport':
            return customTeleportGroup;
        case 'speed':
            return speedGroup;
        case 'misc':
            return miscGroup
    }
};

export const addButton = (group: Groups, name: string, func: (button: HTMLButtonElement) => void) => {
    const button = document.createElement('button');
    button.innerText = name;
    button.setAttribute(DATA_I18N_KEY, name);
    button.addEventListener('click', () => {func(button)});
    getGroupElement(group).append(button);
};

export const addCheckbox = (group: Groups, name: string, checked: boolean, func: (checked: boolean) => void) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.id = name;
    checkbox.addEventListener('change', () => {func(checkbox.checked)});
    const label = document.createElement('label');
    label.htmlFor = name;
    label.append(checkbox);
    getGroupElement(group).append(label);
    const span = document.createElement('span');
    span.innerText = name;
    span.setAttribute(DATA_I18N_KEY, name);
    // MutationObserverに反応させるためにGroupElementにappendした後に行う
    label.append(span);
};

export const visibleMenu = () => {gatherCheatMenu.style.visibility = 'visible'};
export const setCurrentPos = (pos: {mapId?: string, x: number, y: number}) => {
    if (pos.mapId) {
        currentMapId.innerText = pos.mapId;
    }
    currentXPos.innerText = pos.x.toString();
    currentYPos.innerText = pos.y.toString();
};
export const setCurrentSpeed = (speed: number) => {currentSpeed.innerText = 'x' + speed.toString()};
