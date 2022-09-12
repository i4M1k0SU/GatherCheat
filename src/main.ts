import {DATA_I18N_KEY} from './constants';

(async() => {
    // inject html
    const injectHtml = chrome.runtime.getURL('html/inject.html');
    const html = await fetch(injectHtml).then(r => r.text());
    const gatherCheatMenu = document.createElement('div');
    gatherCheatMenu.innerHTML = html;

    // set logo
    const logo = chrome.runtime.getURL('img/48.png');
    gatherCheatMenu.querySelector<HTMLImageElement>('#gather-cheat-icon')!.src = logo;

    // i18n
    gatherCheatMenu.querySelectorAll<HTMLElement>(`[${DATA_I18N_KEY}]`).forEach(element => {
        const i18nKey = element.getAttribute(DATA_I18N_KEY);
        if (i18nKey) {
            element.innerText = chrome.i18n.getMessage(i18nKey) || i18nKey;
        }
    });
    new MutationObserver(mutationRecords => {
        mutationRecords.forEach(r => {
            if (r.type === 'attributes' && r.attributeName === DATA_I18N_KEY) {
                const target = r.target as HTMLElement;
                const i18nKey = target.getAttribute(r.attributeName);
                if (i18nKey) {
                    target.innerText = chrome.i18n.getMessage(i18nKey) || i18nKey;
                }
            }
            if (r.type === 'childList') {
                r.addedNodes.forEach(n => {
                    if (!(n instanceof HTMLElement)) {
                        return;
                    }
                    const i18nKey = n.getAttribute(DATA_I18N_KEY);
                    if (i18nKey) {
                        n.innerText = chrome.i18n.getMessage(i18nKey) || i18nKey;
                    }
                });
            }
        });
    }).observe(gatherCheatMenu, {
        attributes: true,
        attributeFilter: [DATA_I18N_KEY],
        childList: true,
        subtree: true
    });

    document.body.prepend(gatherCheatMenu);

    // inject js
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/inject.js');
    document.head.append(script);
})();
