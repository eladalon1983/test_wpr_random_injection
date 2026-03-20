// 1. The Direct approach (Standard call)
// This will use the version overridden by WPR's deterministic.js
document.getElementById('direct').innerText = Math.random();
// 2. The IFrame Bypass
// WPR injects into HTML responses. By creating an iframe with no 'src',
// we create a fresh browser context ('about:blank') that never triggered
// a network request, so WPR never had a chance to inject into it.
try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // Grab the Math object from the clean iframe's window
    const cleanRandom = iframe.contentWindow.Math.random();
    document.getElementById('iframe').innerText = cleanRandom;
    document.getElementById('iframe').className = 'success';
    document.body.removeChild(iframe);
} catch (e) {
    document.getElementById('iframe').innerText = "IFrame Error: " + e.message;
}
// 3. The Web Worker Bypass
// WPR's ScriptInjector explicitly skips application/javascript files.
// Since Workers run in their own global scope and are loaded from JS files,
// they maintain the original, non-deterministic browser environment.
try {
    // We create a worker from a Blob so you only need these two files,
    // but the effect is the same as loading a separate worker.js file.
    const workerCode = "self.onmessage = () => self.postMessage(Math.random());";
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = function (e) {
        document.getElementById('worker').innerText = e.data;
        document.getElementById('worker').className = 'success';
    };
    worker.postMessage('go');
} catch (e) {
    document.getElementById('worker').innerText = "Worker Error: " + e.message;
}
