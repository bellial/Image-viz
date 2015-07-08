var insertPoint = "body";
var dir = "/data/images/";
var fileName = "merge_table.csv";
var title = "Image Vis";
var images;
var r;
var viz;

var viewBox = d3.select("body")
.append("div")
.attr("class","view")
//.attr("width", 50)
//.attr("height", 50)
.style("opacity",0).style("position","absolute").style("background-color","lightgrey")
.style("text-align","center").style("border-radius","2px");

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 800,
    height = 170;

    
var y;
var n;
var counter;
var thumbnail_width;

reset();

var increment = 2;
var limit = 1000;
var dsv = d3.dsv("|","text/plain");

dsv(fileName,function(error,data){ console.log(data[0]);
   console.log(error);
   console.log(data[0]["median H"]);
    viz = data;
   
  var svg = d3.select(insertPoint).append("svg")
    .attr("class","grid")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    viz.sort(function(a,b){return (b.rt_count - a.rt_count);});
    
    images = svg.selectAll("a")
    .data(data)
    .enter()
    .append("a")
    //.attr("xlink:href",function(d){return d.media_url;})
    .attr("target","_blank")
    .append("image")
    .attr("xlink:href",function(d){return d.media_url})
    .attr("x",function(d){return calcX();})
    .attr("width", 50)
    .attr("height", 50)
    //.attr("width",function(d,i){if(i==0){reset()}; return calcWidth();})
    //.attr("height",function(d,i){if(i==0){reset()}; return calcWidth();})
    .attr("y",function(d,i){if(i==0){reset()}; return calcY();})
    .on("click",function(d){
       var str = "<span>" + d.text + "</span><br>" + "<span>" + d.rt_count + "</span><br>";
       viewBox.html(str).style("opacity",1).style("left", (d3.event.pageX +20) + "px").style("top", (d3.event.pageY - 12) + "px");
    });
  
});

function reset(){
  y = 0;
  n = 20;
  counter = 0;  
  thumbnail_width = parseInt(width/n);
}

function calcX(){
  r = thumbnail_width * counter;  
  counter++;
    if (counter == n){
    counter = 0;
    n = n + increment;
    thumbnail_width = parseInt(width/n);
  }
  return r;
}

function calcWidth(){
  r = thumbnail_width;
  counter++;
    if (counter == n){
    counter = 0;
    n = n + increment;
    thumbnail_width = parseInt(width/n);
  }
  return r;
}

function calcY(){
  counter++;
  var r = y;
  if (counter == n){
    counter = 0;
    n = n + increment;
    y = y + thumbnail_width;
    thumbnail_width = parseInt(width/n);    
  }
  return r;  
}


function cor(){
 images.sort(function(a,b){return (parseInt(b["median H"]) - parseInt(a["median H"]));});
 images.attr("y",function(d,i){if(i==0){reset()}; return calcY();}).attr("x",function(d){return calcX();});
};

function sat(){
 images.sort(function(a,b){return (parseInt(b["median S"]) - parseInt(a["median S"]));});
 images.attr("y",function(d,i){if(i==0){reset()}; return calcY();}).attr("x",function(d){return calcX();});
};

function brilho(){
 images.sort(function(a,b){return (parseInt(b["median V"]) - parseInt(a["median V"]));});
 images.attr("y",function(d,i){if(i==0){reset()}; return calcY();}).attr("x",function(d){return calcX();});
};
