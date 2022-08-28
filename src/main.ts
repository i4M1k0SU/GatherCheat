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
    gatherCheatMenu.querySelectorAll<HTMLElement>('.gather-cheat-menu-i18n').forEach(element => {
        element.innerText = chrome.i18n.getMessage(element.innerText);
    });

    document.body.prepend(gatherCheatMenu);

    // inject js
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('js/inject.js');
    document.head.append(script);
})();
