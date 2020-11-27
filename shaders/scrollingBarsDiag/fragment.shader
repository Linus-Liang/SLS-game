#version 300 es

out highp vec4 color;
uniform highp float vw;
uniform highp float vh;
uniform highp float time;

void main() {
    highp vec4 pos = gl_FragCoord;
    highp float pointDistance = sqrt(pow(abs(pos.x)/vw, 2.0) + pow(abs(pos.y)/vh, 2.0));
    highp float colors = cos((abs(pos.y)/vh + abs(pos.x)/vw) * 50.0 + time/100.0) * 10.0;
    color = vec4(colors, colors, colors, 1.0);
}