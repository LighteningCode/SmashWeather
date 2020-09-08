const worker = {

    message: (e) => {
        try {
            // postMessage({ message: `From worker: ${e.data.message}` });
            setInterval(() => {
                postMessage({ message: `worker` });
            }, 2000);
        } catch (ex) {
            postMessage({ type: 'error', message: ex });
        }
    }
};

addEventListener('message', worker.message);
