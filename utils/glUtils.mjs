export function compileShader(type, source, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
}

export function compileProgram(vertexSource, fragmentSource) {
    const program        = gl.createProgram();
    compileShader(gl.VERTEX_SHADER  , vertexSource  , program);
    compileShader(gl.FRAGMENT_SHADER, fragmentSource, program);
    gl.linkProgram(program);
    gl.validateProgram(program);
    return program;
}