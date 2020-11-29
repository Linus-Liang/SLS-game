#version 300 es

precision highp float;

out vec4 color;
uniform float vw;
uniform float vh;

float map(float number, float min1, float max1, float min2, float max2) {
    return (number - min1) / (max1 - min1) * (max2 - min2) + min2;
}

void main() {
    vec4 pos = gl_FragCoord;
    float pointDistance = sqrt(pow((pos.x - vw/2.0)/vw, 2.0) + pow((pos.y - vh/2.0)/vh, 2.0));
    float clipped = 1.0 - map(pointDistance, 0.0, 0.2, 0.0, 1.0);
    color = vec4(clipped * .1, clipped * .7, clipped * .2,  1.0);
}