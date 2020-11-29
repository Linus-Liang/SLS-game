export function map(number, min1, max1, min2, max2) {
    return (number - min1) / (max1 - min1) * (max2 - min2) + min2;
}

export function mat4(array) {
    return array;
}

export function vec4() {

}

export function multMatVec4(mat4, vec4) {
    return [
        (mat4[0] * vec4[0]) + (mat4[4] * vec4[1]) + (mat4[8 ] * vec4[2]) + (mat4[12] * vec4[3]),
        (mat4[1] * vec4[0]) + (mat4[5] * vec4[1]) + (mat4[9 ] * vec4[2]) + (mat4[13] * vec4[3]),
        (mat4[2] * vec4[0]) + (mat4[6] * vec4[1]) + (mat4[10] * vec4[2]) + (mat4[14] * vec4[3]),
        (mat4[3] * vec4[0]) + (mat4[7] * vec4[1]) + (mat4[11] * vec4[2]) + (mat4[15] * vec4[3]),
    ]
}

export function multMatMat4(lmat4, rmat4) {
    return [
        ...multMatVec4(lmat4, [rmat4[0 ], rmat4[1 ], rmat4[2 ], rmat4[3 ]]),
        ...multMatVec4(lmat4, [rmat4[4 ], rmat4[5 ], rmat4[6 ], rmat4[7 ]]),
        ...multMatVec4(lmat4, [rmat4[8 ], rmat4[9 ], rmat4[10], rmat4[11]]),
        ...multMatVec4(lmat4, [rmat4[12], rmat4[13], rmat4[14], rmat4[15]])
    ];
}

export function translationMat4(x, y, z) {
    return mat4([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        x,y,z,1,
    ]);
}

export function scaleMat4(x, y, z) {
    return mat4([
        x,0,0,0,
        0,y,0,0,
        0,0,z,0,
        0,0,0,1,
    ]);
}

export function rotationMat4(x, y, z) {
    const s = Math.sin(z/(360/Math.PI));
    const c = Math.cos(z/(360/Math.PI));
    return mat4([
        c,s,0,0,
       -s,c,0,0,
        0,0,1,0,
        0,0,0,1,
    ]);
}

export function identity() {
    return mat4([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1,
    ]);
}
