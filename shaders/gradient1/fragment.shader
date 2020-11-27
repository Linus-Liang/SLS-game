#version 300 es

in highp vec3 pos;
out highp vec4 color;

void main() {
    color = vec4(pos.x + 1.0, pos.y + 1.0, pos.z + 1.0, 1.0);
}