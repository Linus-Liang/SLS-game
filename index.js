import { initializeWebGL } from './utils/glUtils.mjs';
import { load } from './utils/loader.mjs';
import { KeyBinder } from './utils/keybindy.mjs';
import { main } from './main.mjs';

function resizeCanvas(gl, canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

async function init() {
    const canvas = document.getElementById('canvas');

    const gl = initializeWebGL(canvas);
    globalThis.gl = gl;

    // TODO do this in a lazy way
    // TODO Caching I think?
    // load resources/assets
    globalThis.loaded = await load('/shaders/shaders.list');

    // set up canvas resizer
    window.addEventListener('resize', () => resizeCanvas(gl, canvas));
    resizeCanvas(gl, canvas);

    // set up keybindings
    const binder = new KeyBinder(window);
    globalThis.binder = binder;

    // const bindings = await load('/keybindings.list');
    // for (const binding of bindings) {
    //     binder.bind(binding.keyCombo, actions[binding.action]);
    // }

    // set up pointer locker
    // canvas.addEventListener('focus', () => canvas.requestPointerLock());
    // canvas.addEventListener('click', () => canvas.requestPointerLock());
    // canvas.addEventListener('blur' , () => document.exitPointerLock());
    // document.addEventListener('pointerlockchange', () => console.log('changed'));

    // keyBinder.bind('ALT+F', () => {
    //     toggleFullscreen();
    // });

    const gameLoop = main(binder);
    function loop(time) {
        const state = gameLoop(time);
        if (state < 0) return;
        window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', init);

window.addEventListener('beforeunload', async e => {

    // e.preventDefault();
});