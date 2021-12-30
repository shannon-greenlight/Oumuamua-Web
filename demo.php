<html>
<head>

	<title>Omuamua</title>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<style>
		@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Eater&family=Frijole&family=Rubik+Beastly&family=Sigmar+One&family=Amita:wght@700&family=Black+Ops+One&family=Bungee+Inline&family=Chewy&family=Courier+Prime:wght@700&family=Creepster&family=Emilys+Candy&family=Freckle+Face&family=Lakki+Reddy&family=Metal+Mania&family=Mystery+Quest&family=New+Rocker&family=Oleo+Script&family=Rock+Salt&family=Rye&family=Shrikhand&family=UnifrakturCook:wght@700&display=swap');
        @import url('https://greenfacelabs.com/three/css/omuamua.css');
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
    <h2>A Greenface Labs Production</h2>
    <section>
        <div id="description">
            <p>
                Oumuamua is the first known interstellar object detected passing through the Solar System and is Hawaiian for <em>messenger</em>. While I was wondering about where it came from and who might live there, it became the inspiration for the <strong>Oumuamua Project</strong>. The project brings together a music synthesizer, a 3-d web page and the views and opinions of people around the world.
            </p>
            <p>Oumuamua <em>listens</em> for Tweets that contain any of the words in a group of search terms and ranks them depending on the <em>sentiment</em> of the Tweet.</p>
            <p>The <em>sentiment</em> ranges from -10 to +10, with 0, the default, denoting no sentiment. This results in 21 total values, each of which are paired with a particular script that controls the synthesizer. A text to speech module reads the Tweet and that sound is fed into the synthesizer for further processing.</p>
            <p>In this way, each sentiment value results in a different <em>soundscape</em>.</p>
            <p>Finally, the image associated with the Tweet is mapped onto a textured surface and sent flying through space. This image and the accompanying sounds represent the <em>messages</em> that are being sent out from our planet, and how distorted our world must seem to distant civilizations.</p>
        </div>
        <div id="this_demo">
            <p>This demonstration is composed of 21 recordings of the data and audio made from the actual project which was configured to listen for the search terms: "vaccine,covid,mandate,virus".</p>
            <p>The recordings play sequentially in the order of Down 10 through Up 10. After which the sequence will repeat.</p>
            <p>While this demonstration does not fully capture the essence of the live system, it does a good job of conveying the look and feel.</p>
            <p>I expect that the project will evolve as time goes along. The user tools should help that process by providing a way to evaluate many of the design elements.</p>
            <p style="text-align: right;padding-right: 5em;">-- Shannon Vance 2021</p>
        </div>
        <p>Press <strong>a</strong> to exit this screen</p>
    </section>
</div>
<div id="splash" class="splashy">
    <h1>The Oumuamua Project</h1>
    <section>
        <div>
            <h2>An Interstellar Object Reflecting Earth Culture</h2>
        </div>
    </section>
    <div id="go_div" style="opacity: 1">
<!--        <p class="go">Click the GO button to start the demonstration.</p>-->
        <button id="go_button" class="go">Start Demonstration</button>
    </div>
    <section>
        <div>
            <p>Press <strong>?</strong> to see user controls</p>
            <p id="best_exp"><em>For the best experience, reload this page in full-screen mode</em></p>
        </div>
    </section>
</div>

</body>
<script src="https://greenfacelabs.com/three/js/vaccine_data.js"></script>
<script src="https://greenfacelabs.com/three/js/omuamua.js"></script>
<script src="https://greenfacelabs.com/three/js/demo.js"></script>
</html>

