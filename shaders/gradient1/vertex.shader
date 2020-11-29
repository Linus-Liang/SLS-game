#version 300 es

uniform mat4 model;
uniform mat4 rotate;
uniform mat4 scale;
uniform mat4 view;
uniform mat4 persective;
in vec4 position;
out vec4 pos;

void main() {
    pos = model * scale * rotate * position;
    gl_Position = pos;
}