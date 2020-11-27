import * as glUtils from './utils/glUtils.mjs';

export function main(keyBinder, pointer) {
    const points = new Float32Array([
         0.5, -0.5,
         0.5,  0.5,
        -0.5, -0.5,
        -0.5,  0.5,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.DYNAMIC_DRAW);
        
    let x = 0;
    let y = 0;
    // canvas.addEventListener('mousemove', e => {
    //     x =  map(e.clientX, 0, canvas.width , -1, 1);
    //     y = -map(e.clientY, 0, canvas.height, -1, 1);
    //         console.log(x, y);
    // });
    
    keyBinder.bind('-e:(canrepeat)', e => x += 0.1);
    keyBinder.bind('-a:(canrepeat)', e => x -= 0.1);
    keyBinder.bind('-,:(canrepeat)', e => y += 0.1);
    keyBinder.bind('-o:(canrepeat)', e => y -= 0.1);
    
    // keyBinder.bind('-o:(canrepeat)', e => { console.log('pressed'); y -= 0.1; });
    // keyBinder.bind('-o:(canrepeat)', e => { console.log('pressed'); y -= 0.1; });
    
    const program = glUtils.compileProgram(loaded.scrollingBarsDiag.vertex, loaded.scrollingBarsDiag.fragment);
    gl.useProgram(program);

    // let lastTime = 0;
    return (time) => {
        // time - lastTime;
        // lastTime = time;

        const newPoints = points.map((val, index) => {
            if (index % 2 === 0) {
                return x + val; //- val - 0.5;
            }
            return y + val; //- val - 0.5;
        });

        gl.bufferData(gl.ARRAY_BUFFER, newPoints, gl.DYNAMIC_DRAW);
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // gl.clearDepth(1.0);
        // gl.enable(gl.DEPTH_TEST);
        // gl.depthFunc(gl.LEQUAL);
        
        gl.clear(gl.COLOR_BUFFER_BIT); //| gl.DEPTH_BUFFER_BIT);
        
        gl.bindAttribLocation(program, 0, 'position');
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        const vw = gl.getUniformLocation(program, 'vw');
        gl.uniform1f(vw, window.innerWidth);
        const vh = gl.getUniformLocation(program, 'vh');
        gl.uniform1f(vh, window.innerHeight);
        const timeloc = gl.getUniformLocation(program, 'time');
        gl.uniform1f(timeloc, time);
        
        // console.log(gl.getProgramInfoLog(program));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}