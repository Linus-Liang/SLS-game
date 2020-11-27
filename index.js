import { load      } from './utils/loader.mjs';
import { KeyBinder } from './utils/keybindy.mjs';
import { main      } from './main.mjs';

function resizeCanvas(canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

async function init() {
    const canvas = document.getElementById('canvas');

    // initialize WebGL
    const gl = canvas.getContext("webgl2");
    
    const glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
    if (gl === null && glslVersion.search('3.00') > -1) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
    globalThis.gl = gl;
    
    // TODO do this in a lazy way
    // TODO implement a unloader so that resources can be freed maybe weak map??
    // load resources/assets
    globalThis.loaded = await load('/shaders/shaders.list');

    // set up canvas resizer
    window.addEventListener('resize', () => resizeCanvas(canvas));
    resizeCanvas(canvas);    

    // set up keybindings
    const binder = new KeyBinder(window);

    // set up pointer locker


    const gameLoop = main(binder, );
    function loop(time) {
        const state = gameLoop(time);
        if (state < 0) return;
        window.requestAnimationFrame(loop);
    }
    
    window.requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', init);

window.addEventListener('beforeunload', async e => {
    e.preventDefault();
});