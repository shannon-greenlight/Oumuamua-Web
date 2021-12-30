const splash_camera_position = new THREE.Vector3(-23.7,18.0,77.5)

const sentiment_manager = {
    sentiment: 0,
    last_sentiment: 0,
    new_method: "next",
    set_sentiment: function(key_code) {
        this.sentiment = parseInt(key_code)
        if(mode==="U") {
            this.sentiment += 10
            if(this.sentiment===10) this.sentiment=20
        }
        if(mode==="D") {
            this.sentiment = 10-this.sentiment
            if(this.sentiment===10) this.sentiment=0
        }
        dbugger.print(`Sentiment: ${this.sentiment}`,false)
    },
    new_sentiment: function(new_method) {
        if(!new_method) new_method=this.new_method
        switch(new_method) {
            case "next":
                this.sentiment++
                if(this.sentiment>20) this.sentiment=0
                break;
            case "prev":
                this.sentiment--
                if(this.sentiment<0) this.sentiment=20
                break;
            case "rand":
                do  {
                    this.sentiment = parseInt(Math.random()*21)
                } while(this.sentiment===this.last_sentiment)
                break;
        }
        this.last_sentiment=this.sentiment
    },
    default_sentiment: function() {
        this.sentiment = 10
    },
    go: function () {
        let msg = demo_data.canned_tweets[this.sentiment][0]
        msg.tweet.text=msg.tweet.text.replace(/http(\S+)/g,"")
        const search_terms="vaccine,covid,mandate,virus"
        const search_parts=search_terms.split(",")
        search_parts.forEach(function(currentValue, index) {
            let reg = new RegExp(currentValue, "gi");
            msg.tweet.text=msg.tweet.text.replace(reg,`<span>${currentValue}</span>`)
        })
        let val = this.sentiment-10
        if(val===0) {
            msg.tweet_class = "Default"
            msg.cmd_sentiment = "Default"
            msg.cmd_name = "Default"
        } else {
            let cmd_sentiment = val > 0 ? "Up" : "Down"
            msg.cmd_sentiment = cmd_sentiment
            msg.tweet_class = `${cmd_sentiment}_${Math.abs(val)}`
            msg.cmd_name = `${cmd_sentiment} ${Math.abs(val)}`
        }

        dbugger.print(msg)
        msg_handler(msg)
    }
}

const audio_manager = {
    audio_controls: document.getElementById("audio_controls"),
    audio_timeout: null,
    end_time: 0,
    go: function () {
        const start_time=demo_data.audio_start_times[sentiment_manager.sentiment]-3
        this.end_time=demo_data.audio_end_times[sentiment_manager.sentiment]+6
        dbugger.print(`Start: ${start_time}, End: ${this.end_time}`,true)
        this.audio_timeout = setTimeout(audio_ended,(this.end_time-start_time)*1000)
        this.audio_controls.currentTime = start_time
        this.audio_controls.play()
    },
    pause: function () {
        clearTimeout(this.audio_timeout)
        this.audio_controls.pause();
    },
    resume: function () {
        //console.log("Howdy! "+this.audio_controls.currentTime)
        this.audio_timeout = setTimeout(audio_ended,(this.end_time-this.audio_controls.currentTime)*1000)
        this.audio_controls.play();
    },
    reset: function () {
        clearTimeout(this.audio_timeout)
        this.audio_controls.pause();
        this.audio_controls.currentTime = 0
    }
}

const display_manager = {
    splash: document.getElementById("splash"),
    help: document.getElementById("help"),
    about: document.getElementById("about"),
    chart: document.getElementById("chart"),
    go_button: document.getElementById("go_button"),
    go_div: document.getElementById("go_div"),
    going: false,
    show_hide: function(item) {
        const item_on = this.is_opaque(item)
        dbugger.print(`Item on: ${item_on}`, false)
        if(item_on) {
            this.set_opacity(item,0)
            if(this.is_going() && !pause_pressed) resume()
        } else {
            this.set_opacity(item,1)
            if(this.is_going() && !pause_pressed) pause()
        }
        return !item_on
    },
    is_opaque: function(item) {
        dbugger.print(`${item.id} Opacity: ${item.style.opacity}`)
        return item.style.opacity==="1" // style values stored as strings
    },
    set_opacity: function(item,opacity) {
        item.style.opacity=opacity
    },
    is_going: function () {
        return this.going
    },
    help_showing: function () {
        return this.is_opaque(this.help)
    },
    about_showing: function () {
        return this.is_opaque(this.about)
    },
    splash_showing: function () {
        return this.is_opaque(this.splash)
    },
    chart_showing: function () {
        return this.is_opaque(this.chart)
    },
    go: function () {
        this.going=true
        this.set_opacity(this.go_div,0)
        this.set_opacity(this.help,0)
        this.set_opacity(this.about,0)
        this.set_opacity(this.splash,0)
        this.set_opacity(this.chart,0)
    },
    is_showing: function () {
        return this.help_showing() || this.about_showing() ||this.splash_showing() || this.chart_showing()
    },
    toggle_splash: function () {
        if(this.is_going() || this.help_showing() || this.about_showing() ||this.chart_showing()) {
            this.set_opacity(this.help,0)
            this.set_opacity(this.about,0)
            this.set_opacity(this.chart,0)
            this.show_hide(this.splash)
        }
    },
    toggle_help: function () {
        this.show_hide(this.help)
        if(this.help_showing()) {
            this.set_opacity(this.splash,0)
            this.set_opacity(this.about,0)
            this.set_opacity(this.chart,0)
        } else {
            this.set_opacity(this.splash,(this.is_going() ? 0 : 1))
        }
    },
    toggle_about: function () {
        this.show_hide(this.about)
        if(this.about_showing()) {
            this.set_opacity(this.splash,0)
            this.set_opacity(this.help,0)
            this.set_opacity(this.chart,0)
        } else {
            this.set_opacity(this.splash,(this.is_going() ? 0 : 1))
        }
    },
    toggle_chart: function () {
        this.show_hide(this.chart)
        if(this.chart_showing()) {
            this.set_opacity(this.help,0)
            this.set_opacity(this.about,0)
            this.set_opacity(this.splash,0)
        } else {
            this.set_opacity(this.splash,(this.is_going() ? 0 : 1))
        }
    }
}

const go = function(e) {
    // display_manager.go()
    audio_manager.go()
    sentiment_manager.go()
}
display_manager.go_button.onclick = function() {
    display_manager.go()
    reset_camera=true
    let t = setInterval(function() {
        if(!reset_camera) {
            clearInterval(t)
            demo_init()
        }
    },500)
}
camera.position.copy(splash_camera_position)

function set_to_go() {
    setTimeout(function() {
        if(display_manager.is_showing() || reset_camera) {
            set_to_go()
        } else {
            sentiment_manager.new_sentiment()
            go()
        }
    },8000)
}

let audio_done=false
let animation_done=false
let pause_pressed=false

function demo_init() {
    const init_msg = {
        "topic": "control",
        "payload": "trigger",
        "cmd_name": "Init"
    }

    audio_done=false
    animation_done=false
    msg_handler(init_msg)
    set_to_go()
}

function audio_ended() {
    console.log("Audio Ended at: " + audio_manager.audio_controls.currentTime);
    audio_done=true
    audio_manager.reset()
    if(animation_done) {
        demo_init()
    }
}
function animation_ended() {
    dbugger.print("Animation Ended at: " + omuamua.item.position.x + ", " + omuamua.item.position.y + ", "+omuamua.item.position.z,true);
    animation_done=true
    // reset_camera=true
    if(audio_done) {
        demo_init()
    }
}

omuamua.move_ended = animation_ended

function jump() {
    audio_manager.reset()
    audio_done=false
    animation_done=false
    omuamua.init()
    // document.getElementById("tweet").setAttribute("class",responseObject.tweet_class);
    document.getElementById("tweet").style="opacity:0";
    document.getElementById("user").style="opacity:0";
    setTimeout(go,7000)
    //go()
}

function pause() {
    dbugger.print("Pausing",true)
    audio_manager.pause()
    omuamua.move_ok = false;
}

function resume() {
    dbugger.print("Resuming",true)
    audio_manager.resume()
    omuamua.move_ok = true;
}

function play_controls(key_code) {
    switch(key_code) {
        case "d":
            sentiment_manager.default_sentiment()
            jump()
            break;
        case ".":
            sentiment_manager.new_sentiment()
            jump()
            break;
        case ">":
            sentiment_manager.new_sentiment("next")
            jump()
            break;
        case "<":
            sentiment_manager.new_sentiment("prev")
            jump()
            break;
        case "r":
            sentiment_manager.new_method="rand"
            break;
        case "s":
            sentiment_manager.new_method="next"
            break;
        case "p":
            omuamua.move_ok ? pause() : resume()
            pause_pressed=!omuamua.move_ok
            break;
        case "a":
            display_manager.toggle_about()
            break;
        case "h":
            display_manager.toggle_chart()
            break;
        case "?":
            display_manager.toggle_help()
            break;
    }
}

function up_down_controls(key_code) {
    switch(key_code) {
        case '0':
        case '1':
        case '2':
        case "3":
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            sentiment_manager.set_sentiment(key_code)
            jump()
            break
    }
}

function  demo_mode_controls(key_code) {
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
        case "U":
        case "D":
            up_down_controls(key_code)
            break
    }
}

window.addEventListener("keydown", function(event) {
    // dbugger.print(event.code)
    dbugger.print(event.key,false)
    set_mode(event.key)
    camera_controls(event.key)
    transport_controls(event.key)
    text_controls(event.key)
    play_controls(event.key)

    demo_mode_controls(event.key)

})

document.getElementById("user_img").addEventListener("error", function (event) {
    // console.log(event)
    event.target.src=`${thumbnail_dir}interesting.jpg`
})

window.onload = function() {
    // alert(`Window: ${window.innerHeight} Screen: ${screen.height}`)
    if(screen.height-window.innerHeight<100) {
        document.getElementById("best_exp").remove()
    }
}
