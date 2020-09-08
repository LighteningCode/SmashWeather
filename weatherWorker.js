const worker = {

    message: (e) => {
        try {
            let dat = { "asfgag":"asdsga"}
            setInterval(() => {
                postMessage({ message: dat });
            }, 2000);
        } catch (ex) {
            postMessage({ type: 'error', message: ex });
        }
    }
};

addEventListener('message', worker.message);
