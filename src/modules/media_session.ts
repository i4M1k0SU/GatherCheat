import {sleep} from '../util';

const MUTE_COLOR = 'rgb(255, 48, 73)';
const microphoneMuteButton = () => document.querySelector<HTMLButtonElement>('#app-container div[data-tutorial-tooltip-id=game-self-video] button');
const cameraMuteButton = () => document.querySelector<HTMLButtonElement>('#app-container > div > div:not(.Layout) > div span:nth-child(3) button');
const getMicrophoneActive = (): boolean => {
    const icon = microphoneMuteButton()?.querySelector('span');
    if (!icon) {
        return false;
    }
    return getComputedStyle(icon).color !== MUTE_COLOR;   
};
const getCameraActive = (): boolean => {
    const icon = cameraMuteButton()?.querySelector('span');
    if (!icon) {
        return false;
    }
    return getComputedStyle(icon).color !== MUTE_COLOR;
};

export const setMuteButtonForPinP = () => {
    if ('mediaSession' in navigator && microphoneMuteButton() && cameraMuteButton()) {
        (navigator.mediaSession as any).setMicrophoneActive(getMicrophoneActive());
        (navigator.mediaSession as any).setCameraActive(getCameraActive());
        // microphoneMuteButton()?.addEventListener('click', () => {
        //     (navigator.mediaSession as any).setMicrophoneActive(getMicrophoneActive());
        // });
        // cameraMuteButton()?.addEventListener('click', () => {
        //     (navigator.mediaSession as any).setCameraActive(getCameraActive());
        // });
        navigator.mediaSession.setActionHandler('togglemicrophone' as MediaSessionAction, async () => {
            microphoneMuteButton()?.click();
            await sleep(50);
            (navigator.mediaSession as any).setMicrophoneActive(getMicrophoneActive());
        });
        navigator.mediaSession.setActionHandler('togglecamera' as MediaSessionAction, async () => {
            cameraMuteButton()?.click();
            await sleep(50);
            (navigator.mediaSession as any).setCameraActive(getCameraActive());
        });
    }
};
