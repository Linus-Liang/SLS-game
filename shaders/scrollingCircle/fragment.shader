#version 300 es

precision highp float;

in highp vec4 pos;
out highp vec4 color;
uniform float vw;
uniform float vh;
uniform float time;

void main() {
    highp vec4 fragPos = gl_FragCoord;
    float pointDistance = sqrt(pow(((fragPos.x - vw/2.0)/vw) * 1.5, 2.0) + pow((fragPos.y - vh/2.0)/vh, 2.0));
    float colorComponent = cos(1.0 - pointDistance * 200.0 + time/1000.0) * 10.0;
    // color = pos;
    if (pointDistance < .3 ) {
        color = vec4(colorComponent, colorComponent, colorComponent, 1.0);
    } else {
    }
}
