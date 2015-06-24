var insertPoint = "body";
var dir = "/data/images/";
var fileName = "tweets_imagens.csv";
var title = "Image Vis";

var viewBox = d3.select("body")
.append("div")
.attr("class","view")
.style("opacity",0).style("position","absolute").style("background-color","lightcyan")
.style("text-align","center").style("border-radius","2px");

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 1220 - margin.top - margin.bottom;

    
var y;
var n;
var counter;
var thumbnail_width;

reset();

var increment = 2;
var limit = 1000;

d3.csv(fileName,function(error,data){ console.log(data[0]);
  var svg = d3.select(insertPoint).append("svg")
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    data.sort(function(a,b){return (b.rt_count - a.rt_count);});
    
    var images = svg.selectAll("a")
    .data(data)
    .enter()
    .append("a")
    .attr("xlink:href",function(d){return d.media_url;})
    .attr("target","_blank")
    .append("image")
    .attr("xlink:href",function(d){return d.media_url})
    .attr("x",function(d){return calcX();})
    .attr("width",function(d,i){if(i==0){reset()}; return calcWidth();})
    .attr("height",function(d,i){if(i==0){reset()}; return calcWidth();})
    .attr("y",function(d,i){if(i==0){reset()}; return calcY();})
    .on("mouseover",function(d){
       var str = "<span>" + d.text + "</span><br>" + "<span>" + d.rt_count + "</span><br>";
       viewBox.html(str).style("opacity",1).style("left", (d3.event.pageX +20) + "px").style("top", (d3.event.pageY - 12) + "px");
    });
  
});

function reset(){
  y = 0;
  n = 4;
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

/*plotGraphic(0,null);
plotWordCloud();
plotTagCloud();

function plotGraphic(index,dia){	
dsv(fileName[index], function(error, data) {
  d3.select(insertPoint).append("h2").text(title[index]);

  var svg = d3.select(insertPoint).append("svg")
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#108c00","#1523f2","#550020"]);

  var categorias = d3.keys(data[0]).filter(function(key){return key !== "DIA" && key !== "HORA";});
  
  if(dia == null){
    var splitedData = data.slice(data.length - 25);
  }else{    
    var splitedData = data.filter(function(d){
      return d.DIA == dia;
    });    
  }
  
  splitedData.forEach(function(d) {
    d.ages = [];
    var total = 0;
    for(i = 0; i<categorias.length ; i++){
      total += +d[categorias[i]];
    }
    d.total = total;
    if(total !== 0){
      soma = 0;
      end = 0;
      for(i = 0; i<categorias.length ; i++){
	soma += +d[categorias[i]]
	d.ages[i] = {init : (soma/total)*height , until:end , value: +d[categorias[i]], parent:d};
	end = d.ages[i].init;
      }
    }else{
      for(i = 0; i<categorias.length ; i++){
	d.ages[i] = {init : 0, until: 0, value: 0, parent: d};
      }
    }
  });
  
  x.domain(splitedData.map(function(d) { return d.DIA + d.HORA; }));
  y.domain([0, 100]);

  var teste = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentual")
	  .style("text-anchor", "start")
	  .attr("transform","translate(-40,-25)");
      
  var state = svg.selectAll(".state")
      .data(splitedData)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.DIA + d.HORA) + ",0)"; });
      
      state.append("text").text(function(d){return d.total;}).style("text-anchor", "middle").attr("x",x.rangeBand() /2).attr("y",-5);
             
state.selectAll("rect")
.data(function(d) { return d.ages; })
.enter().append("rect")
.attr("width", x.rangeBand())
.attr("y", function(d) { return height - d.init; })
.attr("height", function(d) {return d.init - d.until; })
.style("fill", function(d,i) { return color(i); })
.on("mouseover", function(d,i){
  var pai = d.parent;
  var str = "<span>" + categorias[i] + "</span><br>" +
  "<span>" + pai.DIA + " - " + pai.HORA + "</span><br>" +
  "<span>" + d.value + "rts" + "</span><br>" +
  "<span>" + parseFloat(100*d.value/pai.total).toFixed(2) + "%" + "</span>";
  viewBox.html(str)
  .style("opacity",1)
  .style("left", (d3.event.pageX +20) + "px")
  .style("top", (d3.event.pageY - 12) + "px");
});

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(200," + i * 20  + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d,i) { return categorias[i].toUpperCase(); });
});

if(index + 1 < fileName.length){
	plotGraphic(index+1,dia);
}
}

function plotWordCloud(){
  d3.text("nuvem_twitter.dat", function(text) {
  d3.select(insertPoint).append("h2").text("WordCloud");  
    
  var data = d3.csv.parseRows(text);
  var lastdata = data[data.length -1][0].split(";").slice(1);
  var wordMap = lastdata.map(function(d,i){
    var temp = d.split(":");
    return {word: temp[0], qtd: temp[1]};
   });
  
  var sizeScale = d3.scale.linear().domain([0,wordMap[0].qtd]).range([10,100]);

  d3.layout.cloud().size([width, 200])
      .words(wordMap.map(function(d,i) {
        return {text: d.word, size: sizeScale(d.qtd)};
      }))
      .padding(5)
      .rotate(function() { return 0})//~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
});  
}

function plotTagCloud(){
  d3.text("nuvem_twitter_hash.dat", function(text) {
  d3.select(insertPoint).append("h2").text("TagCloud");  
  
  var data = d3.csv.parseRows(text);
  var lastdata = data[data.length -1][0].split(";").slice(1);
  var wordMap = lastdata.map(function(d,i){
    var temp = d.split(":");
    return {word: temp[0], qtd: temp[1]};
   });
  
  var sizeScale = d3.scale.linear().domain([0,wordMap[0].qtd]).range([10,100]);
  
  d3.layout.cloud().size([width, 200])
      .words(wordMap.map(function(d,i) {
        return {text: d.word, size: sizeScale(d.qtd)};
      }))
      .padding(5)
      .rotate(function() { return 0; })//~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  });
}  

function draw(words) {
    d3.select(insertPoint).append("svg")
        .attr("width", width)
        .attr("height", 200)
      .append("g")
        .attr("transform", "translate(" + width/2 + ",100)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
*/  
