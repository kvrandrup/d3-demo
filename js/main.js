//*main script for GEOG 575 Lab 2* *Kristina Randurp 2021*//

//execute script when window is loaded
window.onload = function(){
    //SVG dimension variables
    var w = 1000, h = 500;
    var container = d3.select("body") //get the <body> element from the DOM
	.append("svg") //put a new svg in the body
	.attr("width", w) //assign the width
        .attr("height", h) //assign the height
        .attr("class", "container") //always assign a class (as the block name) for styling and future selection
	.style("background-color", "rgba(0,0,0,0.2)"); //only put a semicolon at the end of the block!
    //innerRect block
    var innerRect = container.append("rect") //put a new rect in the svg
	.datum(400) //a single value is a datum
        .attr("width", function(d){ //rectangle width
            return d * 2.2; 
        })
        .attr("height", function(d){ //rectangle height
            return d ;
        })
	.attr("class", "innerRect") //class name
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color
    console.log(innerRect);

    var dataArray = [10, 20, 30, 40, 50];
    var cityPop = [ //pulled population data from lab 1
        {city: 'Seattle', population: 776555},
        {city: 'Spokane', population: 227579},
        {city: 'Tacoma', population: 221259},
        {city: 'Vancouver', population: 187615}
    ];

    var x = d3.scaleLinear()  //create the scale
        .range([110, 810]) //output min and max
        .domain([0, 3]); //input min and max
    
    var minPop = d3.min(cityPop, function(d){
        return d.population; //find minimum value of array
    });

    var maxPop = d3.max(cityPop, function(d){
        return d.population; //find maximum value of array
    });

    var y = d3.scaleLinear() //scale circles center y coordinates
        .range([450, 50])
        .domain([0, 1000000]);

    var color = d3.scaleLinear()
        .range(["#FDBE85", "#D94701"])
        .domain([minPop, maxPop]);

    var circles = container.selectAll(".circles") //but wait--there are no circles yet!
        .data(cityPop) //here we feed in an array
        .enter() //one of the great mysteries of the universe
	.append("circle") //add a circle for each datum
	.attr("class", "circles") //apply a class name to all circles
	.attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.01;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d, i){
            //use the scale generator with the index to place each circle horizonatally
            return x(i);
        })
        .attr("cy", function(d){
            return y(d.population);
        })
	.style("fill", function(d, i){ //add a fill based on the color scale generator
            return color(d.population);
        })
        .style("stroke", "#000"); //black circle stroke

    //create y axis generator
    var yAxis = d3.axisLeft(y)
        .scale(y);

    //create axis g element and add axis
    var axis = container.append("g")
        .attr("class", "axis")
	.attr("transform", "translate(50, 0)")
        .call(yAxis);
    
    //create a text element and add the title
    var title = container.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 30)
        .text("City Populations");

    //create circle labels
    var labels = container.selectAll(".labels")
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchor", "left")
        .attr("y", function(d){
            //vertical position centered on each circle
            return y(d.population) + 5;
        });
    //first line of label
    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .text(function(d){
            return d.city;
        });
    //create format generator
    var format = d3.format(",");
    //second line of label
    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", function(d,i){
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .attr("dy", "15") //vertical offset
        .text(function(d){
            return "Pop. " + format(d.population); //use format generator to format numbers
        });

};
