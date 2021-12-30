// const particlesGeometry = new THREE.BufferGeometry;
// const particlesCnt = 5000
// const posArray = new Float32Array(particlesCnt * 3)
//
// posArray.forEach(function(value, index) {
//     if((index+1)%3===0) {
//         posArray[index] = Math.random() * -250 - 85
//     } else {
//         posArray[index] = 250*(Math.random()-.5)
//     }
// })
//
// particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
//
// const starfield = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ size: .6 }));


class StarField {
    constructor(particlesCnt,color) {
        this.particlesGeometry = new THREE.BufferGeometry;
        const posArray = new Float32Array(particlesCnt * 3)
        posArray.forEach(function(value, index) {
            if((index+1)%3===0) {
                // the z-value
                posArray[index] = Math.random() * -250 - 85
            } else {
                posArray[index] = 250*(Math.random()-.5)
            }
        })
        this.particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        this.starfield = new THREE.Points(this.particlesGeometry, new THREE.PointsMaterial({ size: .6, color: color }));
    }

    rotate() {
        this.starfield.rotation.z += .000025;
    }
}