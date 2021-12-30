const project_root = "https://www.greenfacelabs.com/three/"
const img_dir = `${project_root}img/`
const thumbnail_dir = `${img_dir}user_thumbnails/`

const is_demo = window.location.href===`${project_root}demo.php`

let right_edge = 14;
let left_edge = -14;

let rotate_camera = false
let reset_camera = false

function randomAngle() {
    return Math.random() * 2 * Math.PI
}

function rndSign() {
    return Math.random()*10 > 5 ? 1 : -1
}

function getSign(n) {
    return n>=0 ? 1 : -1
}

function todeg(r) { return r*180/Math.PI }

let dbugger = {
    debug_on : false,
    "print" : function(s,force) {
        if(this.debug_on || force) {
            console.log(s);
        }
    }
};

if(is_demo) {
    right_edge = 17;
    left_edge = -16;
} else {
    const server = window.location.href.split("http://")[1].split("/")[0]
    console.log("Page location is " + server)

    // we receive messages from the send_socket and send messages to the recv_socket
    var recv_socket = new  WebSocket("ws://" + server + "/ws/receive");
    var send_socket = new  WebSocket("ws://" + server + "/ws/publish");

    var recv_socketOpened = false

    recv_socket.onopen = function() {
        recv_socketOpened = true
        var message = {
            'payload': 'Client connected'
        };
        recv_socket.send(JSON.stringify(message));
    };

    send_socket.onopen = function() {
        var message = {
            'payload': 'Client connected'
        };
        recv_socket.send(JSON.stringify(message));
    };

    send_socket.onclose = function(){
        console.log('Connection closed');
    };

    send_socket.onerror = function(error) {
        console.log('Error detected: ' + JSON.stringify(error));
    };

    send_socket.onmessage = function(e) {
        let server_message = e.data;
        let responseObject = JSON.parse(server_message);
        msg_handler(responseObject)
    }

    function animation_ended() {
        if (recv_socketOpened){
            recv_socket.send("ping");
        }
    }
}


const msg_handler = function(responseObject) {
    dbugger.print("Cmd name: " + responseObject.cmd_name)

    switch(responseObject.cmd_name) {
        case "Init":
            omuamua.init()
            // document.getElementById("tweet").setAttribute("class",responseObject.tweet_class);
            document.getElementById("tweet").style="opacity:0";
            document.getElementById("user").style="opacity:0";

            break;
        case undefined:
            break;
        default:
            omuamua.start()

            if(responseObject.tweet_class==='Down_4') {
                // rotate_camera = true
            }

            if(responseObject.img) {
                omuamua.set_texture(new THREE.TextureLoader().load( responseObject.img,function(texture) {
                    // console.log(`Loaded!`)
                }, function(prog) {
                    // console.log(prog)
                }, function (err) {
                    omuamua.set_texture(default_texture)
                    // console.log(err)
                    })
                )
            }

            document.getElementById("tweet_text").innerHTML="";
            document.getElementById("user_img").setAttribute("src","");
            document.getElementById("user_location").innerHTML="";
            document.getElementById("user_name").innerHTML="";
            try {
                document.getElementById("cmd_name").innerHTML="";
            } catch(e) {
                dbugger.print("Error: " + e)
            }


            document.getElementById("tweet").setAttribute("class",responseObject.cmd_sentiment+" "+responseObject.tweet_class);
            document.getElementById("tweet_text").innerHTML=responseObject.tweet.text;

            document.getElementById("tweet").style="opacity:1";
            document.getElementById("user").style="opacity:1";
            try {
                document.getElementById("cmd_name").innerHTML=responseObject.cmd_name;
            } catch(e) {
                dbugger.print("Error: " + e)
            }

            try {
                document.getElementById("user_img").setAttribute("src",responseObject.tweet.user.profile_image_url);
            } catch(e) {
                dbugger.print("Error: " + e)
            }
            try {
                document.getElementById("user_name").innerHTML=`<div>${responseObject.tweet.user.screen_name}</div>`
            } catch(e) {
                dbugger.print("Error: " + e)
            }
            try {
                document.getElementById("user_location").innerHTML=responseObject.location.place;
            } catch(e) {
                dbugger.print("Error: " + e)
            }

    }
}

const init_camera_position = new THREE.Vector3(0,0,5)

const scene = new THREE.Scene();
const aspect_ratio = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera( 40, aspect_ratio, 2, 1000 );

//camera.translateY(3);

const canvas=document.getElementById("the_canvas");
canvas.width=window.innerWidth
canvas.height=window.innerHeight
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.setAttribute("id","the_canvas")
//renderer.context="2d"
document.body.appendChild( renderer.domElement );
// const ctx=canvas.getContext("2d");

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//Create the lights
// const pointLight = new THREE.PointLight(0xffffff,0.1)
// pointLight.position.x=2
// pointLight.position.y=3
// pointLight.position.z=4
// scene.add(pointLight)

const left_light = new THREE.PointLight( 0xffffdd,.5 );
left_light.castShadow = true; // default false
left_light.position.set(-10, -2, 4);
scene.add( left_light );

const right_light = new THREE.PointLight( 0xddddff,.5 );
right_light.castShadow = true; // default false
right_light.position.set(10, 2, 4);
scene.add( right_light );

const ambient_light = new THREE.AmbientLight( 0xffffff,.02 );
// light2.castShadow = true; // default false
ambient_light.position.set(10, 20, 4);
scene.add( ambient_light );

const white_stars = new StarField(3000,0xffffff)
scene.add(white_stars.starfield)

const red_stars = new StarField(1000,0xffbbbb)
scene.add(red_stars.starfield)

const blue_stars = new StarField(1000,0xbbbbff)
scene.add(blue_stars.starfield)


const visibleHeightAtZDepth = ( depth, camera ) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

const visibleWidthAtZDepth = ( depth, camera ) => {
    const height = visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;
};


//light.translateY(-3)
// const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );


// const cube_geometry = new THREE.BoxGeometry(2,4,.3,4,8,4);
// const loader = new THREE.TextureLoader();
// let cube,material;
//
// loader.load('https://pbs.twimg.com/media/FCojQCFX0AUrXPS.jpg' , function(texture)
//     {
//         material = new THREE.MeshBasicMaterial( { map: texture } );
//         dbugger.print(material);
//         cube = new THREE.Mesh( new THREE.BoxGeometry(2,4,.3,4,8,4), material );
//         cube.castShadow = true; //default is false
//         cube.receiveShadow = false; //default
//         cube.position.x = left_edge
//         cube.position.z = -10
//         scene.add( cube );
//         animate();
//     },	function ( err ) {
//         console.error( 'An error happened.' );
//     }
// );
//
const planet_geometry = new THREE.SphereGeometry();
// basic monochromatic energy preservation
// const diffuseColor = new THREE.Color().setHSL( 1, 0.5, .5 * 0.5 + 0.1 ).multiplyScalar( 1 - .5 * 0.2 );
const diffuseColor = new THREE.Color().setHSL( 1, 1, 1 )

// const x_material = new THREE.MeshToonMaterial( {color: diffuseColor} );
class MovingObject {
    init() {
        this.move_ok = false
        this.rotate_ok = true

        this.init_angle = Math.random() * 2 * Math.PI
        this.init_vector = new THREE.Vector3(this.outer_edge*Math.cos(this.init_angle),this.outer_edge*Math.sin(this.init_angle),this.init_z_position)
        this.item.position.copy(this.init_vector)

        // this.end_edge = visibleWidthAtZDepth(this.end_z_position,camera)/2 + 3;    // 2 is width of box. todo: compute this value
        //this.end_edge = 6;    // 2 is width of box. todo: compute this value

        this.end_angle = this.init_angle + Math.PI + Math.random() * this.target_range - this.target_range/2
        this.end_vector = new THREE.Vector3(this.end_edge*Math.cos(this.end_angle),this.end_edge*Math.sin(this.end_angle),this.end_z_position)

        this.difference_vector = new THREE.Vector3(this.init_vector.x-this.end_vector.x,this.init_vector.y-this.end_vector.y,this.init_vector.z-this.end_vector.z)
        this.x_inc = -this.difference_vector.x*this.move_factor
        this.y_inc = -this.difference_vector.y*this.move_factor
        this.z_inc = -this.difference_vector.z*this.move_factor

        //this.item.rotation.set(randomAngle(),0,randomAngle())
        this.item.rotation.x=0
        this.item.rotation.y=0
        this.item.rotation.z=0

        this.rotation_inc = this.rotation_back

        // this.rotation_x *= rndSign()
        // this.rotation_y *= rndSign()
        // this.rotation_z *= rndSign()

    }

    constructor(options) {
        // set default values
        this.active=true
        this.geometry = null
        this.material = null
        this.outer_edge = 1
        this.end_edge = 1
        this.scale_factor = 1
        this.move_factor = 0
        this.target_range = 0
        this.init_z_position = 0
        this.end_z_position = 0
        this.rotation_inc = {}
        this.rotation_inc.x  = 0
        this.rotation_inc.y = 0
        this.rotation_inc.z = 0
        this.rotation_limit = {}
        this.rotation_limit.x  = 0
        this.rotation_limit.y = 0
        this.rotation_limit.z = 0
        this.move_ended = function() {
            dbugger.print("Move Ended")
        }

        // override defaults
        for(const [key, value] of Object.entries(options) ) {
            this[key]=value
        }

        this.rotation_back = this.rotation_inc

        this.item = new THREE.Mesh( this.geometry, this.material )
        this.item.scale.setScalar(this.scale_factor)

        scene.add( this.item );
        this.init()
    }

    move() {
        let force=false
        if(this.move_ok) {
            const distance_to = this.item.position.distanceTo(this.end_vector)
            //dbugger.print(distance_to,force)
            this.item.position.x += this.x_inc;
            this.item.position.y += this.y_inc;
            this.item.position.z += this.z_inc;
            if( distance_to < this.move_factor*100 ) {
                this.move_ok=false
                dbugger.print(distance_to,force)
                dbugger.print("Ended at: " + this.item.position.x + ", " + this.item.position.y + ", "+this.item.position.z,force);
                this.move_ended(this)
                // animation_ended()
            }
        }
    }

    switch_rotation_direction(axis) {
        // switch direction of rotation
        this.rotation_inc[axis] *= -1
        dbugger.print(`Switching on ${axis} axis. Rotation: ${this.item.rotation[axis]}`,false)
    }

    _rotate(axis) {
        const my_limit = this.rotation_limit[axis]
        const my_rotation = this.item.rotation[axis]
        if(my_limit!==0) {
            // this.item.rotation[axis] += this.rotation_inc[axis];
            const diff = my_limit-Math.abs(my_rotation)
            const ratio = Math.max(diff/my_limit,.01)
            const rotation = ratio * this.rotation_inc[axis]
            this.item.rotation[axis] += rotation
            dbugger.print(`My rotation: ${my_rotation}, Inc: ${rotation}, Diff: ${diff}`)
            if(this.rotation_inc[axis]>=0 && this.item.rotation[axis]>=my_limit-.01) {
                this.switch_rotation_direction(axis)
            } else
            if(this.rotation_inc[axis]<0 && this.item.rotation[axis]<=-(my_limit-.01)) {
                this.switch_rotation_direction(axis)
            }
        } else {
            this.item.rotation[axis] += this.rotation_inc[axis];
        }
    }

    rotate() {
        if(this.rotate_ok) {
            this._rotate("x")
            this._rotate("y")
            this._rotate("z")
        }
    }

    set_position(x,y,z) {
        this.item.position.x = x;
        this.item.position.y = y;
        this.item.position.z = z;
    }

    set_rotation(x,y,z) {
        this.item.rotation.x = x;
        this.item.rotation.y = y;
        this.item.rotation.z = z;
    }

    set_texture(material) {
        this.item.material.map = material;
        this.item.material.needsUpdate = true;
    }

    start() {
        this.move_ok = true
    }

    stop() {
        this.move_ok = true
    }

    debug() {
        this.ev = this.init_vector.clone()
        this.ev = new THREE.Vector3(this.outer_edge*Math.cos(this.end_angle),this.outer_edge*Math.sin(this.end_angle),this.init_z_position)
        //
        // let axis = new THREE.Vector3(0,0,1) // z-axis
        // this.ev.applyAxisAngle(axis,-Math.PI)

        // this.ev.set(10,0,0)  // override init vector

        dbugger.print(this.init_vector)
        dbugger.print(this.ev)

        // this.outer_edge = 1;
        //
        this.z_angle = Math.atan((this.end_z_position-this.init_z_position)/this.outer_edge)
        // this.z_angle = Math.atan(10/10)
        // this.z_angle = Math.PI/2
        dbugger.print(todeg(this.z_angle))

        let x_adj =
        // this.x_rot_angle = Math.cos(this.init_angle)*this.z_angle
        // dbugger.print(`x_rot_angle: ${this.x_rot_angle}`)
        // axis.set(1,0,0)
        // this.ev.applyAxisAngle(axis,this.x_rot_angle)

        // this.y_rot_angle = -Math.cos(0)*this.z_angle
        // dbugger.print(`y_rot_angle: ${this.y_rot_angle}`)
        // axis.set(0,1,0)
        // this.ev.applyAxisAngle(axis,this.y_rot_angle)

        dbugger.print("Final: ", this.ev)
    }

}

const num_vertices = 512
const omuamua_options = {
    // geometry: new THREE.BoxGeometry(2,4,.3,64,128,64),
    geometry: new THREE.PlaneGeometry(2,4,num_vertices,num_vertices),
    material: new THREE.MeshStandardMaterial(),
    outer_edge: 15,
    end_edge: 6,
    scale_factor: 1,
    move_factor: .00075,
    target_range: Math.PI/10,
    init_z_position: -10,
    end_z_position: 0,
    rotation_inc: {x: 0.02, y: 0.005, z: 0.003},
    rotation_limit: {x: Math.PI/4, y: Math.PI/8, z: 0},
    move_ended: animation_ended
}

const loader = new THREE.TextureLoader();
const default_texture = loader.load('https://pbs.twimg.com/media/FCojQCFX0AUrXPS.jpg')

// displacement maps(
const displacement_map_dir = `${img_dir}displacement_maps/`
const displacement_map_rocks = loader.load(`${displacement_map_dir}rocks.png`)
const displacement_map_rock2 = loader.load(`${displacement_map_dir}rock2.jpg`)
const displacement_map_foil = loader.load(`${displacement_map_dir}foil.jpg`)
const displacement_map_dm = loader.load(`${displacement_map_dir}dm.png`)
const displacement_map_dm2 = loader.load(`${displacement_map_dir}dm2.png`)
const displacement_map_mountain = loader.load(`${displacement_map_dir}mountain_map.jpg`)
const displacement_alien_gully = loader.load(`${displacement_map_dir}alien_gully.png`)
const displacement_map_bump = loader.load(`${displacement_map_dir}bump.jpg`)
const displacement_map_gold = loader.load(`${displacement_map_dir}gold-texture2.jpg`)

// alpha maps
const alpha_map_dir = `${img_dir}alpha_maps/`
const alpha_map1 = loader.load(`${alpha_map_dir}alpha_map.png`)
const alpha_map2 = loader.load(`${alpha_map_dir}alpha_map2.png`)
const alpha_map_hole = loader.load(`${alpha_map_dir}alpha_map_hole.png`)
const alpha_map_hole1 = loader.load(`${alpha_map_dir}alpha_map_hole1.png`)

const omuamua = new MovingObject(omuamua_options)
omuamua.set_texture(default_texture)
omuamua.item.material.displacementMap = displacement_map_bump
omuamua.item.material.alphaMap = alpha_map_hole1
omuamua.item.material.displacementScale = .5
omuamua.item.material.displacementBias = .085
omuamua.item.material.transparent = true

class Meteor extends MovingObject {
    shoot() {
        // this.init()
        this.move_ok = true
    }

    activate() {
        let self = this
        setTimeout(function() {
            self.shoot()
        },Math.random() * 3000 + 10000)
    }

    deactivate() {
        this.move_ok = false
        this.active = false
    }
}
const meteor_options = {
    geometry: planet_geometry,
    material: new THREE.MeshToonMaterial( {color: diffuseColor} ),
    outer_edge: 36,
    end_edge: 36,
    scale_factor: .1,
    move_factor: .015,
    target_range: Math.PI/6,
    init_z_position: -40,
    end_z_position: -40,
    move_ended: function(o) {
        dbugger.print("Meteor ended")
        o.init()
        if(o.active) o.activate()
    }
}
const meteor = new Meteor(meteor_options)
meteor.activate()

const ring_material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
class PlanetRing {

    constructor(innerRadius, outerRadius ) {
        this.ring = new THREE.Mesh( new THREE.RingGeometry( innerRadius, outerRadius, 32 ), ring_material );
        //this.ring.position.z=-10
        this.ring.rotation.x=-Math.PI/2
        // this.ring.rotation.y=-2.5
        // this.ring.rotation.z=2*Math.PI;
    }

    move() {
        this.ring.rotation.x += .002;
        this.ring.rotation.y += 0.001;
        this.ring.rotation.z += 0.006;
    }
}

let ring1 = new PlanetRing(.75,3)
ring1.ring.material.map = new THREE.TextureLoader().load( `${img_dir}rings2.png` );

class Planet {
    constructor(init_obj) {
        this.rotation_speed = init_obj.rotation_speed
        this.group = new THREE.Object3D()
        if(init_obj.ring) {
            this.group.add(init_obj.ring.ring)
        }
        if(init_obj.scale_factor) {
            this.set_scale_factor(init_obj.scale_factor)
        } else {
            this.set_scale_factor(1)
        }
        this.material = new THREE.MeshPhongMaterial({color: 0xffffff});
        this.material.map = new THREE.TextureLoader().load( init_obj.texture );
        this.group.add(new THREE.Mesh( planet_geometry, this.material ))
        this.group.position.copy(init_obj.init_pos)
    }

    set_scale_factor(scale_factor) {
        this.scale_factor=scale_factor
        this.group.scale.x=this.scale_factor
        this.group.scale.y=this.scale_factor
        this.group.scale.z=this.scale_factor
    }

    rotate() {

        //this.group.rotateOnAxis( this.group.rotation.toVector3(), .0005*(this.rotation_speed) )

        // const q = new THREE.Quaternion();
        // q.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), .0005*(this.rotation_speed) );

        // let vector = this.group.quaternion;
        // vector.multiplyQuaternions(q, vector)
        // this.group._dirtyRotation = true

        this.group.rotation.y += .0005*(this.rotation_speed)
        if(this.group.rotation.y>2*Math.PI) this.group.rotation.y=0
        // dbugger.print(`Y: ${this.group.rotation.y}`)
    }
}

const the_planets = [
    {
        init_pos: new THREE.Vector3(4,-4,-13),
        texture: `${img_dir}Earth_Texture_Full.png`,
        rotation_speed: 2,
        scale_factor: 1,
        ring: null
    },
    {
        init_pos: new THREE.Vector3(-5,5,-13),
        texture: `${img_dir}moon_nasa.jpg`,
        rotation_speed: -1,
        scale_factor: 2.4,
        ring: null
    },
    {
        init_pos: new THREE.Vector3(-20,-5,-40),
        texture: `${img_dir}jupitermap.jpg`,
        rotation_speed: 3,
        ring: null
    },
    {
        init_pos: new THREE.Vector3(20,8,-40),
        texture: `${img_dir}saturn2.jpg`,
        rotation_speed: 3,
        ring: ring1
    },
    {
        init_pos: new THREE.Vector3(10,19,-60),
        texture: `${img_dir}marsmap1k.jpg`,
        rotation_speed: 4,
        ring: null
    },
    {
        init_pos: new THREE.Vector3(6,-14,-80),
        texture: `${img_dir}4k_ceres_fictional.jpg`,
        rotation_speed: 5,
        ring: null
    },
    {
        init_pos: new THREE.Vector3(-40,12,-60),
        texture: `${img_dir}neptune.jpg`,
        rotation_speed: 6,
        ring: null
    }
]

let i;
let planets=[];
// let planet_materials=[];

for(i=0;i<7;i++) {
    planets[i] = new Planet(the_planets[i])
    scene.add(planets[i].group);
}

const earth = planets[0]
const moon = planets[1]
const jupiter = planets[2]
const saturn = planets[3]
const mars = planets[4]
const venus = planets[5]
const neptune = planets[6]

// saturn.group.rotation.x=Math.PI/8
// saturn.group.rotation.z=Math.PI/8
const ngui = new GUI()
ngui.close()
ngui.add(right_light,"intensity", 0,1)
ngui.add(right_light.position,"y", -15,15,.2)
// ngui.add(light1.color,"r", 0,1)
// ngui.add(light1.color,"g", 0,1)
// ngui.add(light1.color,"b", 0,1)
ngui.add(omuamua.material,"displacementScale", 0,1)
ngui.add(omuamua.item.rotation,"x", -omuamua_options.rotation_limit.x,omuamua_options.rotation_limit.x,.01)
ngui.add(omuamua.item.rotation,"y", -omuamua_options.rotation_limit.y,omuamua_options.rotation_limit.y,.01)
ngui.add(omuamua.item.rotation,"z", -Math.PI,Math.PI,.01)

const animate = function () {
    requestAnimationFrame( animate );

    if(rotate_camera) {
        camera.rotation.z += .007
        if(camera.rotation.z>2*Math.PI) {
            rotate_camera = false
            camera.rotation.z = 0
        }
    }

    if(reset_camera) {
        camera.position.lerp(init_camera_position,.01)
        const distance = camera.position.distanceTo(init_camera_position)
        console.log(`Distance: ${distance}`)
        if(distance<.05) {
            reset_camera=false
        }
    }

    meteor.move()
    omuamua.move()

    omuamua.rotate()
    white_stars.rotate()

    function rotate_planet(planet) {
        planet.rotate()
    }
    planets.forEach(rotate_planet)

    renderer.render( scene, camera );
};

// keyboard interface
function camera_controls(key_code) {
    switch(key_code) {
        case "ArrowRight":
            camera.position.x+=.25
            break;
        case "ArrowLeft":
            camera.position.x+=-.25
            break;
        case "ArrowUp":
            camera.position.y+=.25
            break;
        case "ArrowDown":
            camera.position.y+=-.25
            break;
        case "+":
            camera.position.z+=-.25
            break;
        case "-":
            camera.position.z+=.25
            break;
        case "c":
            reset_camera=true
            // camera.position.copy(init_camera_position)
            break;
        case "C":
            rotate_camera = true
            break;
    }
}

function transport_controls(key_code) {
    switch(key_code) {
        case "i":
            camera.position.copy(init_camera_position)
            omuamua.init()
            break;
        case "!":
            omuamua.move_ok = !omuamua.move_ok
            break;
        case "z":
            omuamua.set_position(0,0,0)
            omuamua.set_rotation(0,0,0)
            break;
        case "R":
            omuamua.rotate_ok = !omuamua.rotate_ok
            break;
    }
}

function text_controls(key_code) {
    switch(key_code) {
        case "t":
            const flat_div = document.getElementById('flat_div')
            flat_div.style.display = flat_div.style.display==="none" ? "initial" : "none"
            break;
        case "*":
            const cmd_name = document.getElementById("cmd_name")
            cmd_name.className = cmd_name.className==="hide" ? "show_inline" : "hide"
            break;
    }
}

function alpha_map_controls(key_code) {
    switch(key_code) {
        case "1":
            omuamua.item.material.alphaMap = alpha_map1
            break;
        case "2":
            omuamua.item.material.alphaMap = alpha_map_hole1
            break;
        case "3":
            omuamua.item.material.alphaMap = alpha_map2
            break;
        case "4":
            omuamua.item.material.alphaMap = alpha_map_hole
            break;
    }
}

function displacement_map_controls(key_code) {
    switch(key_code) {
        case "1":
            omuamua.item.material.displacementMap = displacement_map_rocks
            break;
        case "2":
            omuamua.item.material.displacementMap = displacement_map_gold
            break;
        case "3":
            omuamua.item.material.displacementMap = displacement_map_foil
            break;
        case "4":
            omuamua.item.material.displacementMap = displacement_map_dm
            break;
        case "5":
            omuamua.item.material.displacementMap = displacement_map_mountain
            break;
        case "6":
            omuamua.item.material.displacementMap = displacement_map_rock2
            break;
        case "7":
            omuamua.item.material.displacementMap = displacement_map_dm2
            break;
        case "8":
            omuamua.item.material.displacementMap = displacement_map_bump
            break;
        case "9":
            omuamua.item.material.displacementMap = displacement_alien_gully
            break;
    }
}

function texture_controls(key_code) {
    switch(key_code) {
        case "1":
            dbugger.print("Hey now: "+`${img_dir}watermelon.jpg`,true)
            omuamua.set_texture(new THREE.TextureLoader().load( `${img_dir}watermelon.jpg` ))
            break;
        case "2":
            omuamua.set_texture(new THREE.TextureLoader().load( `${img_dir}mud.jpg` ))
            break;
        case "3":
            omuamua.set_texture(new THREE.TextureLoader().load( `${img_dir}shed-colors.jpg` ))
            break;
        case "4":
            omuamua.set_texture(new THREE.TextureLoader().load( `${img_dir}wood.jpg` ))
            break;
        case "5":
            omuamua.set_texture(new THREE.TextureLoader().load( `${img_dir}gold-texture.jpg` ))
            break;
        case "6":
            omuamua.set_texture(new THREE.TextureLoader().load( `${img_dir}Sun.jpg` ))
            break;
        case "7":
            omuamua.set_texture(new THREE.TextureLoader().load( `${img_dir}ocean.jpg` ))
            break;
    }
}

let mode = "M"  // next number is a map index
// "U"  // next number is an Up cmd
// "D"  // next number is a Down cmd

function  mode_controls(key_code) {
    switch(mode) {
        case "A":
            alpha_map_controls(key_code)
            break
        case "M":
            displacement_map_controls(key_code)
            break
        case "T":
            texture_controls(key_code)
            break
        case "P":
            console.log("Would be playing: "+key_code)
            break
    }
}

function set_mode(key_code) {
    switch(key_code) {
        case "A":
        case "M":
        case "U":
        case "D":
        case "T":
            mode=key_code
            console.log("Setting: "+key_code)
            break
    }
}

if(!is_demo) {
    camera.position.copy(init_camera_position)

    window.addEventListener("keydown", function(event) {
        // dbugger.print(event.code)
        dbugger.print(event.key)

        set_mode(event.key)

        camera_controls(event.key)
        transport_controls(event.key)
        text_controls(event.key)
        mode_controls(event.key)

    })
}

animate();

let obj = new THREE.Object3D()
obj.rotation.z=Math.PI
console.log(obj.quaternion)
