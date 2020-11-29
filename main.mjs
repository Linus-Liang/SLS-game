import * as glUtils from './utils/glUtils.mjs';
import * as m       from './utils/math.mjs';
import * as physics from './utils/physics.mjs';

class Square {
    constructor() {
        this.iAcceleration = { x: 0, y: 0.0, z: 0};
        this.iVelocity = { x: 0, y: 1, z: 0};
        this.deg = 0;
        this.points = new Float32Array([
            0.5, -0.5,
            0.5,  0.5,
           -0.5, -0.5,
           -0.5,  0.5,
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        this.ready = false;
        this.readyHandler = () => {};

        loaded.then(o => o.gradient1.vertex.then(vertex => {
            loaded.then(o => o.scrollingCircle.fragment.then(fragment => {
                this.program = glUtils.compileProgram(vertex, fragment);
                gl.useProgram(this.program);
        
                this.locs = glUtils.getAttribLocations(this.program, ['position']);
                gl.enableVertexAttribArray(this.locs.position);
                gl.vertexAttribPointer(this.locs.position, 2, gl.FLOAT, false, 0, 0);
                
                this.uniLocs = glUtils.getUniformLocations(this.program, ['vw', 'vh', 'time', 'model', 'rotate', 'scale']);
                console.timeEnd('ready')
                this.ready = true;
                this.readyHandler();
            }));
        }));
    }

    draw(time) {
        if (this.ready) {
            gl.bufferData(gl.ARRAY_BUFFER, this.points, gl.DYNAMIC_DRAW);
        
            gl.uniformMatrix4fv(this.uniLocs.model, false, m.translationMat4(this.position?.x || 0, this.position?.y || 0, 0));
            gl.uniformMatrix4fv(this.uniLocs.rotate, false, m.identity());//m.rotationMat4(0, 0, 360 * Math.cos(time/10000 * Math.PI)));
            gl.uniformMatrix4fv(this.uniLocs.scale, false, m.scaleMat4(window.innerHeight/window.innerWidth, 1, 1));
            gl.uniform1f(this.uniLocs.vw, window.innerWidth);
            gl.uniform1f(this.uniLocs.vh, window.innerHeight);
            gl.uniform1f(this.uniLocs.time, time);
        
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }

    update(time, environment) {
        if (this.ready) {
            const newState = physics.update(this, environment, time/1000);
            Object.assign(this, newState);
        }
    }
}

export function main(keyBinder, events) {
    const square = new Square();

    keyBinder.bind('-a:(canrepeat)', () => square.displacement.x -= 0.01);
    keyBinder.bind('-e:(canrepeat)', () => square.displacement.x += 0.01);
    keyBinder.bind('-o:(canrepeat)', () => square.displacement.y -= 0.01);
    keyBinder.bind('-,:(canrepeat)', () => square.displacement.y += 0.01);

    keyBinder.bind('-r:(canrepeat)', () => square.deg += 1);
    keyBinder.bind('-l:(canrepeat)', () => square.deg -= 1);
    
    const environment = {
        force: { x: 0, y: -0.1, z: 0},
        shapes: [square]
    };

    globalThis.environment = environment;

    // prerender
    for (const shape of environment.shapes) shape.readyHandler = () => shape.draw(0);

    return (time, lastTime, initTime) => {
        if (time === initTime) setTimeout(() => console.log(environment.shapes[0]), 1000);
        console.log(time/1000)

        // setter() 
        globalThis.interupt = () => {
            debugger;
        };
        const deltaTime = time - lastTime;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        for (const shape of environment.shapes) {
            shape.update(time, environment);
            // console.log(deltaTime);
            shape.draw(time);
        }
    }
}

function once(fn) {
    let called = false;
    return () => {
        if (called) return;
        called = true;
        fn();
    }
}