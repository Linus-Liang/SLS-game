export function addVec3(lvec3, rvec3, fractionOfASecond) {
    return {
        x: (lvec3?.x || 0) + ( (rvec3?.x || 0) * fractionOfASecond ),
        y: (lvec3?.y || 0) + ( (rvec3?.y || 0) * fractionOfASecond ),
        z: (lvec3?.z || 0) + ( (rvec3?.z || 0) * fractionOfASecond )
    };
}

export function update(object, environment, seconds) {
    const acceleration = {
        x: (object.iAcceleration?.x||0) * seconds + environment.force?.x||0,
        y: (object.iAcceleration?.y||0) * seconds + environment.force?.y||0,
        z: (object.iAcceleration?.z||0) * seconds + environment.force?.z||0,
    };
    const velocity = {
        x: (object.iVelocity?.x||0) + acceleration.x * seconds,
        y: (object.iVelocity?.y||0) + acceleration.y * seconds,
        z: (object.iVelocity?.z||0) + acceleration.z * seconds,
    };
    const position = {
        x: ( (object.iVelocity?.x||0) * seconds ) + 0.5 * acceleration.x * seconds * seconds,
        y: ( (object.iVelocity?.y||0) * seconds ) + 0.5 * acceleration.y * seconds * seconds,
        z: ( (object.iVelocity?.z||0) * seconds ) + 0.5 * acceleration.z * seconds * seconds,
    };
    
    return {
        acceleration: acceleration,
        velocity: velocity,
        position: position
    };
}

// export function update(object, environment, fractionOfASecond) {
//     // const xAcceleration = addVec3(object.givenXAcceleration, environment.forceX, fractionOfASecond);
//     // const yAcceleration = addVec3(object.givenYAcceleration, environment.forceY, fractionOfASecond);
//     // const zAcceleration = addVec3(object.givenZAcceleration, environment.forceZ, fractionOfASecond);
//     // const xVelocity     = addVec3(object.xVelocity, xAcceleration, fractionOfASecond);
//     // const yVelocity     = addVec3(object.yVelocity, yAcceleration, fractionOfASecond);
//     // const zVelocity     = addVec3(object.zVelocity, zAcceleration, fractionOfASecond);
//     // const x             = addVec3(object.x, xVelocity, fractionOfASecond);
//     // const y             = addVec3(object.y, yVelocity, fractionOfASecond);
//     // const z             = addVec3(object.z, zVelocity, fractionOfASecond);
//     // return {
//     //     xAcceleration: xAcceleration,
//     //     yAcceleration: yAcceleration,
//     //     zAcceleration: zAcceleration,
//     //     xVelocity: xVelocity,
//     //     yVelocity: yVelocity,
//     //     zVelocity: zVelocity,
//     //     x: x,
//     //     y: y,
//     //     z: z,
//     // };
//     const acceleration = addVec3(object.givenAcceleration, environment.force, fractionOfASecond);
//     const velocity     = addVec3(object.velocity, addVec3(object.givenVelocity, acceleration, fractionOfASecond), 1);
//     const position = addVec3(object.position, velocity, fractionOfASecond);
//     console.log(position)
//     return {
//         acceleration: acceleration,
//         velocity: velocity,
//         position: position
//     };
// }