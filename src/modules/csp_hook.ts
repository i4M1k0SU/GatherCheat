// 壁抜け時、newrelicにCSPを送信するのでブロックする

let newrelicAddPageActionOrig: typeof newrelic.addPageAction;

export const attach = () => {
    newrelicAddPageActionOrig = newrelic.addPageAction;
    newrelic.addPageAction = function (name, attributes) {
        if (name.toLocaleLowerCase().includes('csp')) {
            return;
        }

        return newrelicAddPageActionOrig.call(this, name, attributes);
    };
};

export const detach = () => {
    if (newrelicAddPageActionOrig) {
        newrelic.addPageAction = newrelicAddPageActionOrig;
    }
};
