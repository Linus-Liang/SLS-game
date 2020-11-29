export function initializeWebGL(canvas) {
    const gl = canvas.getContext('webgl2');
    
    if (gl === null || gl.getParameter(gl.SHADING_LANGUAGE_VERSION).search('3.00') === -1) {
        throw new Error(
            'Unable to initialize WebGL or your GLSL is the incorrect version. Your browser or machine may not support it.'
        );
    }

    return gl;
}

export function compileShader(type, source, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error(source, gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
}

export function compileProgram(vertexSource, fragmentSource) {
    const program = gl.createProgram();
    compileShader(gl.VERTEX_SHADER  , vertexSource  , program);
    compileShader(gl.FRAGMENT_SHADER, fragmentSource, program);
    gl.linkProgram(program);
    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    console.log('linkStatus: %s', linkStatus)
    gl.validateProgram(program);
    const validateStatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
    console.log('validateStatus: %s', validateStatus)
    return program;
}

export function setUniform(name, ) {

}

export function getAttribLocations(program, attribs) {
    return Object.fromEntries(attribs.map(attrib => [attrib, gl.getAttribLocation(program, attrib)]));
}

export function getUniformLocations(program, attribs) {
    return Object.fromEntries(attribs.map(attrib => [attrib, gl.getUniformLocation(program, attrib)]));
}