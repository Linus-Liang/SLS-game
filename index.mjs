import { initializeWebGL } from './utils/glUtils.mjs';
import { load            } from './utils/loader.mjs';
import { KeyBinder       } from './utils/keybindy.mjs';
import { main            } from './main.mjs';

// navigator.serviceWorker.register('/sw.js');
console.time('ready')
window.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('canvas');
    
    const gl = initializeWebGL(canvas);
    
    // TODO do this in a lazy way
    // TODO Caching I think?
    // load resources/assets
    const loaded = load('/shaders/shaders.list');

    // set up canvas resizer
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // set up keybindings
    const binder = new KeyBinder(window);
    // const bindings = await load('/keybindings.list');
    // for (const binding of bindings) {
        // binder.bind(binding.keyCombo, actions[binding.action]);
    // }

    // set up pointer locker
    // canvas.addEventListener('focus', () => canvas.requestPointerLock());
    // canvas.addEventListener('click', () => canvas.requestPointerLock());
    // canvas.addEventListener('blur' , () => document.exitPointerLock());
    // document.addEventListener('pointerlockchange', () => console.log('changed'));

    binder.bind('ALT+-F', () => {
        toggleFullscreen();
    });

    const obserable = {};

    window.addEventListener('beforeunload', async e => {
    
        // e.preventDefault();
    });

    let initTime  = 0
    let lastTime  = 0;
    let lastState = 0;
    function loop(time) {
        // try {
            lastState = gameLoop(time - initTime, lastTime, initTime);
        // } catch(x) {
            // window.alert('An uncaught error:' + x);
        //     return;
        // }

        if (lastState < 0) {
            window.alert('An unrecoverable error: ' + lastState);
            return;
        };
        lastTime = time;
        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);

    globalThis.step = (by) => {
        if (!initTime) {
            window.requestAnimationFrame((time) => {
                initTime = time;
                loop(time - initTime)
            });
            return;
        }
        window.requestAnimationFrame(() => loop(lastTime + by));
    }
    
    globalThis.gl     = gl;
    globalThis.binder = binder;
    globalThis.loaded = loaded;
    
    const gameLoop = main(binder, obserable);

});
