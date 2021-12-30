/**
 * Created by Shannon on 12/17/2015.
 */
function D3_chart() {
    this.wid = 1100;
    this.left_col_width = 400;
    this.the_data = {};

    this.createBarChart = function() {
        var wid = this.wid;
        var left_col_width = this.left_col_width;
        var the_data = this.the_data;

        var chart = d3.select("#chart").append("svg")
            .attr("class", "chart")
            .attr("width", wid)
            .attr("height", 25 * the_data.data.length)
            .style("margin-left", "0px") // Tweak alignment�
            .append("g")
        //.attr("transform", "translate(60,15)");

        dbugger.print("bar chart: " + d3.max(the_data.data));
        var x = d3.scale.linear()
            .domain([0, d3.max(the_data.data)])
            .range([0, wid-left_col_width]);
        chart.selectAll("rect")
            .data(the_data.data)
            .enter().append("rect")
            .attr("y", function (d, i) {
                return 25 * i
            })
            .attr("class", function (d, i) {
                return "bar_"+i
            })
            .attr("x", left_col_width)
            .attr("width", x)
            .attr("height", 20);

        chart.selectAll(".bar")
            .data(the_data.legends)
            .enter().append("text")
            .attr("class", function (d, i) {
                return "bar "
            })
            .attr("title", function (d, i) {
                return the_data.titles[i];
            })
            .attr("x", function (d, i) {
                return 5
            })
            .attr("y", function (d, i) {
                return (i * 25) + 10;
            })
            //.attr("dx", 200)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .attr("data-rel", function (d, i) {
                return d["id"];
            })
            .text(function (d, i) {
                return (i + 1) + ". " + d["name"];
            });

        chart.selectAll(".bar_data")
            .data(the_data.data)
            .enter().append("text")
            .attr("class", "bar_data")
            .attr("x", left_col_width/2)
            .attr("y", function (d, i) {
                return (i * 25) + 10;
            })
            //.attr("dx", 200)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            //.attr("transform", "translate(250,0)")
            .text(function (d, i) {
                return d;
            });

    }


    this.w = 800;                        //width
    this.h = 800;                        //height
    this.r = 400;                        //radius
    this.color = d3.scale.category20c();     //builtin range of colors



    this.createPieChart = function() {
        var self = this;
        var radius = this.r;
        var width = this.w;
        var height = this.h;
        var data = [];
        var consolidated_data = {value: 0, legend: 'Others'};
        var max_val = this.the_data.data[0];
        var total_data=0;
        for(var i in this.the_data.data) {
            var data_value = this.the_data.data[i];
            total_data += data_value;
        }
        dbugger.print("Create Pie Chart: "+ radius + " Maxval: " + max_val + `Total data: ${total_data}`);
        for(var i in this.the_data.data) {
            data_value = this.the_data.data[i];
            dbugger.print("Percent: " + self.calc_percent(data_value,total_data) + " data: " + data_value);
            if(self.calc_percent(data_value,total_data)<1) {
                consolidated_data.value += data_value;
                data[i] = {value: 0, legend: this.the_data.legends[i].name};
            } else {
                data[i] = {value: data_value, legend: this.the_data.legends[i].name};
            }
        }
        if(consolidated_data.value >0) data.push(consolidated_data);
        dbugger.print(data);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("data-rel",function(d) { return d.data.value })
            .attr("title",function(d) { return d.data.legend + " " + self.calc_percent(d.data.value,total_data) + "%"})
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return self.color(d.data.value); });
        //.style("fill", function(d) { return this.color(d.data.legends); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.data.legend; });
    };

    this.calc_percent = function(part,total) {
        return Math.ceil((part/total)*10000)/100;
    }


}



