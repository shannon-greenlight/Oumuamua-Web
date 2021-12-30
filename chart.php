<html>
<head>

	<title>Omuamua Data</title>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<style>
		/*@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Eater&family=Frijole&family=Rubik+Beastly&family=Sigmar+One&family=Amita:wght@700&family=Black+Ops+One&family=Bungee+Inline&family=Chewy&family=Courier+Prime:wght@700&family=Creepster&family=Emilys+Candy&family=Freckle+Face&family=Lakki+Reddy&family=Metal+Mania&family=Mystery+Quest&family=New+Rocker&family=Oleo+Script&family=Rock+Salt&family=Rye&family=Shrikhand&family=UnifrakturCook:wght@700&display=swap');*/
        /*@import url('https://greenfacelabs.com/three/css/omuamua.css');*/
        /*@import url('https://greenfacelabs.com/three/css/demo.css');*/
	</style>

    <script src="js/d3_chart.js"></script>
</head>
<body>
<div id="main">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="1">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:lightblue;stop-opacity:1"/>
                <stop offset="100%" style="stop-color:steelblue;stop-opacity:1"/>
            </linearGradient>
            <radialGradient id="rgrad0" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color:lightblue; stop-opacity:0"/>
                <stop offset="100%" style="stop-color:steelblue;stop-opacity:1"/>
            </radialGradient>
            <radialGradient id="rgrad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color:lightgreen;stop-opacity:0"/>
                <stop offset="100%" style="stop-color:darkgreen;stop-opacity:1"/>
            </radialGradient>
        </defs>
    </svg>
    <div id="chart" class="chart"><h2 id="sub_title">Sentiment</h2></div>
    <div class="clear">&nbsp;</div>
</div>
</body>
<script>
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

    let d3_chart = new D3_chart();
    d3_chart.wid = $("body").width() - 20;
    d3_chart.left_col_width = <?php echo $this->legend_width ?>;
    d3_chart.the_data = the_data;

    d3_chart.w = d3_chart.wid;

    function createChart() {
        switch (report_num) {
            case '1':
                d3_chart.createBarChart();
                break;
            case '2':
                d3_chart.createPieChart();
                $("svg g.arc").tooltip();
                break;
            default:
                alert("No report specified!");
        }
    }

    function reCreateChart() {
        d3.select("#chart svg").remove();
        createChart();
    }

</script>
</html>

