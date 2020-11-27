import * as glUtils from './utils/glUtils.mjs';
import { toggleFullscreen } from './utils/fullscreen.mjs';

function update(elapsedTime) {
    
}

function render() {
    
    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function main(keyBinder, ) {
    let program = glUtils.compileProgram(loaded.simple.vertex, loaded.simple.fragment);

    let lastTime = 0;
    return (time) => {
        time - lastTime;
        lastTime = time;
        render();
        gl.useProgram(program);
    }
}