<html>
<head>

	<title>Omuamua</title>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<style>
		@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Eater&family=Frijole&family=Rubik+Beastly&family=Sigmar+One&family=Amita:wght@700&family=Black+Ops+One&family=Bungee+Inline&family=Chewy&family=Courier+Prime:wght@700&family=Creepster&family=Emilys+Candy&family=Freckle+Face&family=Lakki+Reddy&family=Metal+Mania&family=Mystery+Quest&family=New+Rocker&family=Oleo+Script&family=Rock+Salt&family=Rye&family=Shrikhand&family=UnifrakturCook:wght@700&display=swap');
        @import url('./css/omuamua.css');
        @import url('https://greenfacelabs.com/three/css/demo.css');
	</style>

    <script src="https://greenfacelabs.com/three/js/three.js"></script>
    <script src="https://greenfacelabs.com/three/js/dat.gui.module.js"></script>
    <script src="https://greenfacelabs.com/three/js/starfield.js"></script>
</head>
<body>
<canvas id="the_canvas"></canvas>
<div id="flat_div">
	<div id="tweet" class="Init">
		<div id="tweet_text" ng-bind-html="msg.tweet.text" >Howdy!</div>
	</div>

	<div id="user">
		<img id="user_img" />
		<div id="user_location"></div>
        <div id="user_name"></div>
        <div id="cmd_name" class="hide"></div>
	</div>

</div>
<div id="audio">
    <audio id="audio_controls" controls preload="auto">
        <source src="audio/vaccine21.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
</div>

<div id="help" class="splashy">
    <h2>User Controls</h2>
    <div class="griddy">
        <div class="griddy_child">
            <h3>Play Controls</h3>
            <ul>
                <li><strong>p</strong> <span>Pause/Resume Play</span></li>
                <li><strong>d</strong> <span>Play Default Sentiment</span></li>
                <li><strong>.</strong> <span>Play New Sentiment</span></li>
                <li><strong>></strong> <span>Play Next Sentiment</span></li>
                <li><strong>&lt;</strong> <span>Play Previous Sentiment</span></li>
                <li><strong>r</strong> <span>Select Random Sequence</span></li>
                <li><strong>s</strong> <span>Select Sequential Sequence</span></li>
            </ul>
        </div>
        <div class="griddy_child">
            <h3>Camera Controls</h3>
            <ul>
                <li><strong>RightArrow</strong> <span>Move Camera right</span></li>
                <li><strong>LeftArrow</strong> <span>Move Camera left</span></li>
                <li><strong>UpArrow</strong> <span>Move Camera up</span></li>
                <li><strong>DownArrow</strong> <span>Move Camera down</span></li>
                <li><strong>+</strong> <span>Zoom Camera in</span></li>
                <li><strong>-</strong> <span>Zoom Camera out</span></li>
                <li><strong>c</strong> <span>Move Camera to initial position</span></li>
                <li><strong>C</strong> <span>Spin Camera 360&deg;</span></li>
            </ul>
        </div>
        <div class="griddy_child">
            <h3>Number Key Controls</h3>
            <ul>
                <li><strong>U</strong> <span>Number Keys Select Up Sentiment</span></li>
                <li><strong>D</strong> <span>Number Keys Select Down Sentiment</span></li>
                <li><strong>A</strong> <span>Number Keys Select Alpha Map</span></li>
                <li><strong>M</strong> <span>Number Keys Select Displacement Map</span></li>
                <li><strong>T</strong> <span>Number Keys Select Texture Map</span></li>
            </ul>
        </div>
        <div class="griddy_child">
            <h3>Display Controls</h3>
            <ul>
                <li><strong>t</strong> <span>Show/Hide Text</span></li>
                <li><strong>*</strong> <span>Show/Hide Sentiment</span></li>
                <li><strong>a</strong> <span>Show/Hide About Screen</span></li>
                <li><strong>h</strong> <span>Show/Hide Chart Image</span></li>
                <li class="notice"><strong>?</strong> <span>Show/Hide User Controls (This Screen)</span></li>
            </ul>
        </div>
        <div class="griddy_child">
            <h3>Oumuamua Controls</h3>
            <ul>
                <li><strong>!</strong> <span>Stop/Start Oumuamua Transit</span></li>
                <li><strong>R</strong> <span>Stop/Start Oumuamua Rotation</span></li>
                <li><strong>i</strong> <span>Init Oumuamua and Camera</span></li>
                <li><strong>z</strong> <span>Move Oumuamua to (0,0,0)</span></li>
            </ul>
        </div>
        <div class="griddy_child">
            <h3>Mouse Controls</h3>
            <ul>
                <li><strong>intensity</strong> <span>Light intensity</span></li>
                <li><strong>y</strong> <span>Light y position</span></li>
                <li><strong>displacementScale</strong> <span>Oumuamua contour</span></li>
                <li><strong>x</strong> <span>Oumuamua x rotation</span></li>
                <li><strong>y</strong> <span>Oumuamua y rotation</span></li>
                <li><strong>z</strong> <span>Oumuamua z rotation</span></li>
            </ul>
            <p>Note: Type "R" before setting x,y,z rotation</p>
        </div>
    </div>
</div>

<div id="chart" class="splashy Up_2">
    <img src="img/charts/chart1.png" />
    <p>This is an image taken from the analysis page of the project. Because a large portion of the Tweets are ranked as "Default" by the sentiment node, the Default data is not shown.</p>
    <p>Press <strong>h</strong> to exit this screen</p>
</div>

<div id="about" class="splashy">
    <h1>About The Oumuamua Project</h1>
    <section id="section_1">
        <h2>A Greenface Labs Production</h2>
        <div>
            <p>Oumuamua is the first known interstellar object detected passing through the Solar System and is Hawaiian for <em>messenger</em>. While I was wondering about where it came from and who might live there, it became the inspiration for the <strong>Oumuamua Project</strong>. The project brings together a music synthesizer, a 3-d web page and the views and opinions of people around the world.</p>
            <p>Oumuamua <em>listens</em> for Tweets that contain any of the words in a group of search terms and ranks them depending on the <em>sentiment</em> of the Tweet.</p>
            <p>The <em>sentiment</em> ranges from -10 to +10, with 0, the default, denoting no sentiment. This results in 21 total values, each of which are paired with a particular script that controls the synthesizer. A text to speech module reads the Tweet and that sound is fed into the synthesizer for further processing.</p>
            <p>In this way, each sentiment value results in a different <em>soundscape</em>.</p>
            <p>Finally, the image associated with the Tweet is mapped onto a textured surface and sent flying through space. This image and the accompanying sounds represent the <em>messages</em> that are being sent out from our planet, and how distorted our world must seem to distant civilizations.</p>
        </div>
        <div>
            <p>This demonstration is composed of 21 recordings of the data and audio made from the actual project which was configured to listen for the search terms: "vaccine,covid,mandate,virus".</p>
            <p>The recordings play sequentially in the order of Down 10 through Up 10. After which the sequence will repeat.</p>
            <p>While this demonstration does not fully capture the essence of the live system, it does a good job of conveying the look and feel.</p>
            <p>I expect that the project will evolve as time goes along. The user tools should help that process by providing a way to evaluate many of the design elements.</p>
            <p style="text-align: right;padding-right: 5em;">-- Shannon Vance 2021</p>
        </div>
        <div class="more_buttons">
            <button id="more_about" class="more_button" target="section_2">More About the Tech</button>
        </div>
    </section>

    <section id="section_2">
        <h2>The Technology</h2>
        <div>
            <p>The technical story behind The Oumuamua Project has several facets.</p>
            <ul>
                <li>The Controllers</li>
                <li>The Synthesizer</li>
                <li>The Web Pages</li>
            </ul>
        </div>
        <div>
            <p class="taller">There are two Controllers, one for the Live System and one for the Demo. The Live System's controller is based on Node-Red while the Demo's controller is pure JavaScript that runs in a browser.
            Below is a screen shot of the top-level Node-Red program. </p>
            <div class="flexer">
                <p class="img_div"><img class="about_img" src="img/about/node_red2.png" alt="The Node-Red Controller" title="Click to Enlarge" height="200px" />The Node-Red Controller</p>
                <div>
                    <p>The Node-Red Controller is responsible for collecting Twitter data and rating their sentiment, then sending the matching script to the Synthesizer and the data to the Web Page. Tweets can come in faster than they can be displayed, so a queue is used to moderate the data.</p>
                    <p>Every Tweet that is displayed is also saved to a MongoDB database. It is this data that is used to generate the sentiment distribution charts. An example of these appears in the demo.</p>
                    <p>The Node-Red Controller also provides various testing and configuration features. For example, the controller retrieves the synthesizer scripts from either a file or a MongoDB database depending on the configuration setting.</p>
                </div>
            </div>
            <p>The Demo Controller simulates the action of the Live System by cycling through the 21 canned Tweets and recordings. It also manages the demo's information screens (like this one).</p>
            <p>Both Controllers create and manage a Display Web Page. The Node-Red Controller communicates with its Display Page via web socket.</p>
        </div>
        <div class="more_buttons">
            <button class="more_button" target="section_1">Back</button>
            <button class="more_button" target="section_3">Next</button>
        </div>
    </section>

    <section id="section_3">
        <h2>The Synthesizer</h2>
        <div>
            <p>The Oumuamua Project Live System uses a Eurorack Synthesizer to produce unique soundscapes for each of the 21 possible sentiments. The synthesizer contains two Greenface Labs Spankulators, each of which are mounted as IoT devices via WiFi.
                The Spankulators execute scripts which are sent by the Node-Red Controller via a REST Post operation. One Spankulator serves as the Rhythm section and is connected to the Moog DFAM and the 2hp Kick module.
                The other Spankulator drives the Melody. It is connected to the Moog Mother-32 VCO and some other functions.
            </p>
            <p class="taller">
                The audio from the Web Page that reads the Tweet is fed into the Mother-32 and mixed with the synth signal. The mix is fed into the TipTop EchoZ. The output of the EchoZ and the Rhythm track are mixed as the final output.
            </p>
        </div>
        <div>
            <div class="flexer">
                <p class="img_div"><img class="about_img" src="img/about/synth.jpg" alt="The Synthesizer" title="Click to Enlarge" height="200px" />The Synthesizer</p>
                <div>
                    <p>
                        The Greenface Labs Spankulator is based around the Arduino 33 Iot. This device contains a host of useful features and is what makes the Spankulator such a versatile and powerful module.
                        The Spankulator's main job is to create a trio of coordinated signals. One is a pulse train, called Trig Out, of varying frequency and pulse length. One is a toggle signal that changes state at the conclusion of the pulse train.
                        And one is an analog signal, called CV Out, whose value depends on the chosen function but often follows the width of the pulses in the train.
                    </p>
                    <p>
                        The scripts typically specify the nature of the pulse trains. For example whether the pulses increase or decrease in length, how many pulses and how long they take.
                        Many other parameters can be expressed in the scripts such as the range, offset and instantaneous value of the CV Out signal.
                    </p>
                </div>
            </div>
            <p>In order to synchronize the melody and the rhythm, the pulse train from the Rhythm Spankulator's Trig Out is connected to the Trig In of the Melody Spankulator.</p>
            <p>
                The Spankulator's ability to be remotely controlled over the Internet is at the crux of this project.
                Being able to do a project such as this served as the primary inspiration for the design of the Spankulator.
            </p>
        </div>
        <div class="more_buttons">
            <button class="more_button" target="section_2">Back</button>
            <button class="more_button" target="section_4">Next</button>
        </div>
    </section>

    <section id="section_4">
        <h2>The Web Pages</h2>
        <div>
            <p>Several Web Pages are used in the Oumuamua Project.</p>
            <ul>
                <li>The Display Page - Live  and Demo</li>
                <li>The Text-to-Speech / Debug Page - Live Only</li>
                <li>The Chart Page - Live and Demo</li>
            </ul>
        </div>
        <div>
            <div class="flexer">
                <p class="img_div"><img class="about_img" src="img/about/demo_code2.png" alt="A bit of code from the demo page" title="Click to Enlarge" height="200px" />A bit of code from the demo page</p>
                <div>
                    <p>
                        The Live and Demo Display Pages share the routines that render the 3-d space scene. These routines employ a JavaScript library, Three JS, which provides the basic building blocks such as a camera, lights, geometric shapes and the ability to wrap those shapes with images and textures.
                    </p>
                    <p>
                        The Text-to-Speech / Debug Page is produced using the Dashboard feature of Node-Red. A male voice is used for negative Tweets and a female voice is used for positive.
                        The Debug panel shows information in real-time that is useful to the developer and perhaps interesting to the viewer.
                    </p>
                    <p>
                        The Chart Pages show sentiment distribution per search term. The Live Page uses Node-Red to query the MongoDB to produce the data, while the Demo Page is just a screen-grab of the Live Page.
                    </p>
                </div>
            </div>
            <p>
                The 3-d objects seen in the Display page were created from one of three JavaScript classes: Planet, MovingObject or StarField.
                All three classes specify the type of object, where it is in space, what it looks like, etc. The stars rotate slowly in the sky making them blink.
                Each planet just rotates around its axis at a specified rate. MovingObjects (shooting stars and Oumuamua) travel from one place in 3-d space to another.
                MovingObjects have methods to set the starting position, to move, to pause and resume movement as well as a method to rotate on 3 axes instead of just one.
            </p>
            <p>
                Linear Algebra makes a bit more sense after programming for 3-d. And this project has introduced me to <em>Quaternions</em> and <em>lerping</em>. 😎
            </p>
        </div>
        <div class="more_buttons">
            <button class="more_button" target="section_3">Back</button>
            <button class="more_button" target="section_1">Next</button>
        </div>
    </section>
    <p id="exit_prompt" class="notice">Press <strong>a</strong> to exit this screen</p>
</div>

<div id="splash" class="splashy">
    <h1>The Oumuamua Project</h1>
    <div>
        <h2>An Interstellar Visitor Reflecting Earth Culture</h2>
    </div>
    <div id="go_div" style="opacity: 1">
<!--        <p class="go">Click the GO button to start the demonstration.</p>-->
        <button id="go_button" class="go">Start Demonstration</button>
    </div>
    <div>
        <p>Press <strong>?</strong> to see user controls</p>
        <p id="best_exp"><em>For the best experience, reload this page in full-screen mode</em></p>
    </div>
</div>

<template id="dialog">
    <div id="img_dialog" onclick="remove_dialog()" title="Click to Go Back">
        <img id="dialog_img" src="img/about/synth.jpg" />
    </div>
    <img id="red_x" src="img/about/red_x.png" onclick="remove_dialog()" />
</template>
<style>
    #img_dialog {
        z-index: 99999;
        height: 100%;
        background-color: #777;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #dialog_img {
        width: 70%;
    }
    #red_x {
        position: absolute;
        top: 20px;
        right: 200px;
        width: 30px;
        z-index: 99999;
        cursor: pointer;
        border: 0px solid red;
        border-radius: 30px;
    }
</style>

</body>
<script src="https://greenfacelabs.com/three/js/demo_data.js"></script>
<script src="https://greenfacelabs.com/three/js/omuamua.js"></script>
<script src="https://greenfacelabs.com/three/js/demo.js"></script>
</html>

