/**
 * Created by kaismh on 10/18/14.
 */

window.org_vaadin_addons_d3Gauge_Gauge= function() {

    var config =
    {
        size: this.getState().size,
        label: this.getState().label,

        min: this.getState().config.min,
        max: this.getState().config.max,
        majorTicks: this.getState().config.majorTicks,
        minorTicks: this.getState().config.minorTicks,
        transitionDuration: this.getState().config.transitionDuration,
        trackMin: this.getState().config.trackMin,
        trackMax: this.getState().config.trackMax,
        trackAvg: this.getState().config.trackAvg,
        showCurrentLabel: this.getState().config.showCurrentLabel,
        style: this.getState().config.style

    };

    config.greenZones = this.getState().config.greenZones;
    config.yellowZones = this.getState().config.yellowZones;
    config.redZones = this.getState().config.redZones;

    var currentGauge = new Gauge(config, this.getElement());
    currentGauge.render();

    this.onStateChange = function() {

        currentGauge.redraw(this.getState().value);
    }

};
function Gauge(configuration, gaugeElement)
{

    var minValue = null;
    var maxValue = null;
    var avgValue = null;
    var avgCounter = 0;

    var self = this; // for internal d3 functions

    this.configure = function(configuration)
    {
        this.config = configuration;

        this.config.size = this.config.size * 0.9;

        this.config.raduis = this.config.size * 0.97 / 2;
        this.config.cx = this.config.size / 2;
        this.config.cy = this.config.size / 2;

        this.config.trackMin = configuration.trackMin || false;
        this.config.trackMax = configuration.trackMax || false;
        this.config.trackAvg = configuration.trackAvg || false;
        this.config.showCurrentLabel = configuration.showCurrentLabel || false;

        this.config.min = undefined != configuration.min ? configuration.min : 0;
        this.config.max = undefined != configuration.max ? configuration.max : 100;
        this.config.range = this.config.max - this.config.min;

        this.config.majorTicks = configuration.majorTicks || 5;
        this.config.minorTicks = configuration.minorTicks || 5;

        this.config.transitionDuration = configuration.transitionDuration || 500;
        this.config.style = configuration.style || "default";
    };

    this.render = function()
    {
        this.body = d3.select(gaugeElement)
            .append("svg:svg")
            .attr("class", "d3-gauge" + " " + this.config.style)
            .attr("width", this.config.size)
            .attr("height", this.config.size);

        this.body.append("svg:circle")
            .attr("class","outerRing")
            .attr("cx", this.config.cx)
            .attr("cy", this.config.cy)
            .attr("r", this.config.raduis);

        this.body.append("svg:circle")
            .attr("class","innerCircle")
            .attr("cx", this.config.cx)
            .attr("cy", this.config.cy)
            .attr("r", 0.9 * this.config.raduis);

        for (var index in this.config.greenZones)
        {
            this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, "greenZone");
        }

        for (var index in this.config.yellowZones)
        {
            this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, "yellowZone");
        }

        for (var index in this.config.redZones)
        {
            this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, "redZone");
        }

        if (undefined != this.config.label)
        {
            var fontSize = Math.round(this.config.size / 9);
            this.body.append("svg:text")
                .attr("class", "gaugeLabel")
                .attr("x", this.config.cx)
                .attr("y", this.config.cy / 2 + fontSize / 2)
                .attr("dy", fontSize / 2)
                .attr("text-anchor", "middle")
                .text(this.config.label)
                .style("font-size", fontSize + "px");
        }

        var fontSize = Math.round(this.config.size / 16);
        var labelFontSize = fontSize * 0.40;
        var strokeWidth = fontSize * 0.10;

        var majorDelta = this.config.range / (this.config.majorTicks - 1);
        for (var major = this.config.min; major <= this.config.max; major += majorDelta)
        {
            var minorDelta = majorDelta / this.config.minorTicks;
            for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
            {
                var point1 = this.valueToPoint(minor, 0.75);
                var point2 = this.valueToPoint(minor, 0.85);

                this.body.append("svg:line")
                    .attr("class","ticks minorTick")
                    .attr("x1", point1.x)
                    .attr("y1", point1.y)
                    .attr("x2", point2.x)
                    .attr("y2", point2.y);
            }

            var point1 = this.valueToPoint(major, 0.7);
            var point2 = this.valueToPoint(major, 0.85);

            this.body.append("svg:line")
                .attr("class","ticks majorTick")
                .attr("x1", point1.x)
                .attr("y1", point1.y)
                .attr("x2", point2.x)
                .attr("y2", point2.y);

            if (major == this.config.min || major == this.config.max)
            {
                var point = this.valueToPoint(major, 0.63);

                this.body.append("svg:text")
                    .attr("class","labels "+ (major == this.config.min ? "lowerBoundLabel" : "upperBoundLabel"))
                    .attr("x", point.x)
                    .attr("y", point.y)
                    .attr("dy", fontSize / 3)
                    .attr("text-anchor", major == this.config.min ? "start" : "end")
                    .text(major)
                    .style("font-size", fontSize + "px");
            }
        }
        if(self.config.showCurrentLabel)
        {
            this.body.append("svg:text")
                .attr("class", "labels currentValueLabel")
                .attr("x",this.config.cx+"px")
                .attr("y",(this.config.size - this.config.cy / 4 - (fontSize * 2.2))+"px")
                .style("font-size", labelFontSize+"px")
                .style("text-anchor","middle")
                .text("Current");
        }


        var tip = this.valueToPoint(0, 0.85);
        var text = this.valueToPoint(0, 0.93);
        var minLblPos = this.valueToPoint(-1, 0.40);
        var avgLblPos = this.valueToPoint(0, 0.40);
        var maxLblPos = this.valueToPoint(1, 0.40);
        var baseLeft = self.valueToPoint(-1, 0.90);
        var baseRight = self.valueToPoint(1, 0.90);
        var triStr = "M "+tip.x+" "+tip.y+" L "+baseLeft.x+" "+baseLeft.y+" L "+baseRight.x+" "+baseRight.y+" z";

        if(self.config.trackMin)
        {
            var targetRotation = (self.valueToDegrees(0)-90);
            var rotStr = "translate("+text.x+","+text.y+") rotate("+targetRotation+")";
            this.body.append("svg:text")
                .attr("class", "minMarkerText")
                .attr("transform",rotStr)
                .style("stroke-width", (strokeWidth / 2)+"px")
                .style("font-size", (fontSize / 2)+"px")
                .style("text-anchor","middle")
                .text(0);

            this.body.append("svg:text")
                .attr("class", "labels minValueLabel")
                .attr("x",(this.config.cx * 0.68))
                .attr("y",(this.config.size - this.config.cy / 2 + fontSize)+"px")
                .style("font-size", labelFontSize+"px")
                .style("text-anchor","middle")
                .text("Min");

            this.body.append("svg:text")
                .attr("class", "minValueText")
                .attr("x",(this.config.cx * 0.68))
                .attr("y",(this.config.size - this.config.cy / 2.5 + fontSize)+"px")
                .style("stroke-width", strokeWidth+"px")
                .style("font-size", (fontSize * 0.80)+"px")
                .style("text-anchor","middle")
                .on('mouseover', function(d){
                    self.body.select(".minMarkerText").style("opacity",0.90);
                    self.body.select(".minMarker").style("opacity",0.90);
                    self.body.select(".minValueText").style("opacity",0.90);
                })
                .on('mouseout', function(d){
                    self.body.select(".minMarkerText").style("opacity",0.50);
                    self.body.select(".minMarker").style("opacity",0.50);
                    self.body.select(".minValueText").style("opacity",0.50);
                })
                .text(0);

            this.body.append("svg:path")
                .attr("class", "minMarker")
                .attr("d", triStr)
                .style("stroke-width", strokeWidth+"px")
                .on('mouseover', function(d){
                    self.body.select(".minMarkerText").style("opacity",0.90);
                    self.body.select(".minValueText").style("opacity",0.90);
                })
                .on('mouseout', function(d){
                    self.body.select(".minMarkerText").style("opacity",0.50);
                    self.body.select(".minValueText").style("opacity",0.50);
                })
                .append("svg:title")
                .text(0);
        }
        if(self.config.trackAvg)
        {
            var targetRotation = (self.valueToDegrees(0)-90);
            var rotStr = "translate("+text.x+","+text.y+") rotate("+targetRotation+")";
            this.body.append("svg:text")
                .attr("class", "avgMarkerText")
                .attr("transform",rotStr)
                .style("stroke-width", (strokeWidth / 2)+"px")
                .style("font-size", (fontSize / 2)+"px")
                .style("text-anchor","middle")
                .text(0);

            this.body.append("svg:text")
                .attr("class", "labels avgValueLabel")
                .attr("x",this.config.cx)
                .attr("y",(this.config.size - this.config.cy / 2.60 + fontSize)+"px")
                .style("font-size", labelFontSize+"px")
                .style("text-anchor","middle")
                .text("Avg");

            this.body.append("svg:text")
                .attr("class", "avgValueText")
                .attr("x",this.config.cx)
                .attr("y",(this.config.size - this.config.cy / 3.60 + fontSize)+"px")
                .style("stroke-width", strokeWidth+"px")
                .style("font-size", (fontSize * 0.80)+"px")
                .style("text-anchor","middle")
                .on('mouseover', function(d){
                    self.body.select(".avgMarkerText").style("opacity",0.90);
                    self.body.select(".avgMarker").style("opacity",0.90);
                    self.body.select(".avgValueText").style("opacity",0.90);
                })
                .on('mouseout', function(d){
                    self.body.select(".avgMarkerText").style("opacity",0.50);
                    self.body.select(".avgMarker").style("opacity",0.50);
                    self.body.select(".avgValueText").style("opacity",0.50);
                })
                .text(0);

            this.body.append("svg:path")
                .attr("class", "avgMarker")
                .attr("d", triStr)
                .style("stroke-width", strokeWidth+"px")
                .on('mouseover', function(d){
                    self.body.select(".avgMarkerText").style("opacity",0.90);
                    self.body.select(".avgValueText").style("opacity",0.90);
                })
                .on('mouseout', function(d){
                    self.body.select(".avgMarkerText").style("opacity",0.50);
                    self.body.select(".avgValueText").style("opacity",0.50);
                })
                .append("svg:title")
                .text(0);
        }
        if(self.config.trackMax)
        {
            var targetRotation = (self.valueToDegrees(0)-90);
            var rotStr = "translate("+text.x+","+text.y+") rotate("+targetRotation+")";
            this.body.append("svg:text")
                .attr("class", "maxMarkerText")
                .attr("transform",rotStr)
                .style("stroke-width", (strokeWidth / 2)+"px")
                .style("font-size", (fontSize / 2)+"px")
                .style("text-anchor","middle")
                .text(0);

            this.body.append("svg:text")
                .attr("class", "labels maxValueLabel")
                .attr("x",(this.config.cx * 1.3))
                .attr("y",(this.config.size - this.config.cy / 2 + fontSize)+"px")
                .style("font-size", labelFontSize+"px")
                .style("text-anchor","middle")
                .text("Max");

            this.body.append("svg:text")
                .attr("class", "maxValueText")
                .attr("x",(this.config.cx * 1.3))
                .attr("y",(this.config.size - this.config.cy / 2.5 + fontSize)+"px")
                .style("stroke-width", strokeWidth+"px")
                .style("font-size", (fontSize * 0.80)+"px")
                .style("text-anchor","middle")
                .on('mouseover', function(d){
                    self.body.select(".maxMarkerText").style("opacity",0.90);
                    self.body.select(".maxMarker").style("opacity",0.90);
                    self.body.select(".maxValueText").style("opacity",0.90);
                })
                .on('mouseout', function(d){
                    self.body.select(".maxMarkerText").style("opacity",0.50);
                    self.body.select(".maxMarker").style("opacity",0.50);
                    self.body.select(".maxValueText").style("opacity",0.50);
                })
                .text(0);

            this.body.append("svg:path")
                .attr("class", "maxMarker")
                .attr("d", triStr)
                .style("stroke-width", strokeWidth+"px")
                .on('mouseover', function(d){
                    self.body.select(".maxMarkerText").style("opacity",0.90);
                    self.body.select(".maxValueText").style("opacity",0.90);
                })
                .on('mouseout', function(d){
                    self.body.select(".maxMarkerText").style("opacity",0.50);
                    self.body.select(".maxValueText").style("opacity",0.50);
                })
                .append("svg:title")
                .text(0);
        }
        var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");

        var midValue = (this.config.min + this.config.max) / 2;

        var pointerPath = this.buildPointerPath(midValue);

        var pointerLine = d3.svg.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .interpolate("basis");

        pointerContainer.selectAll("path")
            .data([pointerPath])
            .enter()
            .append("svg:path")
            .attr("class","dialPointer")
            .attr("d", pointerLine);

        pointerContainer.append("svg:circle")
            .attr("class", "dialButton")
            .attr("cx", this.config.cx)
            .attr("cy", this.config.cy)
            .attr("r", 0.12 * this.config.raduis);

        var fontSize = Math.round(this.config.size / 10);
        pointerContainer.selectAll("text")
            .data([midValue])
            .enter()
            .append("svg:text")
            .attr("class","currentValue")
            .attr("x", this.config.cx)
            .attr("y", this.config.size - this.config.cy / 4 - fontSize)
            .attr("dy", fontSize / 2)
            .attr("text-anchor", "middle")
            .style("font-size", fontSize + "px");

        this.redraw(this.config.min, 0);
    };

    this.buildPointerPath = function(value)
    {
        var delta = this.config.range / 13;

        var head = valueToPoint(value, 0.85);
        var head1 = valueToPoint(value - delta, 0.12);
        var head2 = valueToPoint(value + delta, 0.12);

        var tailValue = value - (this.config.range * (1/(270/360)) / 2);
        var tail = valueToPoint(tailValue, 0.28);
        var tail1 = valueToPoint(tailValue - delta, 0.12);
        var tail2 = valueToPoint(tailValue + delta, 0.12);

        return [head, head1, tail2, tail, tail1, head2, head];

        function valueToPoint(value, factor)
        {
            var point = self.valueToPoint(value, factor);
            point.x -= self.config.cx;
            point.y -= self.config.cy;
            return point;
        }
    };

    this.drawBand = function(start, end, zoneType)
    {
        if (0 >= end - start) return;

        this.body.append("svg:path")
            .attr("class", "zones "+zoneType)
            .attr("d", d3.svg.arc()
                .startAngle(this.valueToRadians(start))
                .endAngle(this.valueToRadians(end))
                .innerRadius(0.65 * this.config.raduis)
                .outerRadius(0.85 * this.config.raduis))
            .attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)"; });
    };

    this.redraw = function(value, transitionDuration)
    {
        var pointerContainer = this.body.select(".pointerContainer");

        pointerContainer.selectAll("text").text(Math.round(value));

        var pointer = pointerContainer.selectAll("path");

        pointer.transition()
            .duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
            .attrTween("transform", function()
            {
                var pointerValue = value;
                if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
                else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
                var currentValueLabel = self.body.select(".currentValueLabel");

                if(self.config.trackMin)
                {
                    if(pointerValue < minValue){
                        minValue = Math.round(pointerValue);
                        var minMarker = self.body.select(".minMarker");
                        var minTitle = minMarker.select("title");
                        var minMarkerText = self.body.select(".minMarkerText");
                        var minValueText = self.body.select(".minValueText");
                        var minValueLabel = self.body.select(".minValueLabel");
                        var tip = self.valueToPoint(minValue, 0.85);
                        var text = self.valueToPoint(minValue, 0.93);
                        var baseLeft = self.valueToPoint((minValue-1), 0.90);
                        var baseRight = self.valueToPoint((minValue+1), 0.90);
                        var triStr = "M "+tip.x+" "+tip.y+" L "+baseLeft.x+" "+baseLeft.y+" L "+baseRight.x+" "+baseRight.y+" z";
                        minMarker.transition()
                            .attr("d", triStr);
                        minTitle.text("Min: " +minValue);

                        var targetRotation = (self.valueToDegrees(minValue)-90);
                        var rotStr = "translate("+text.x+","+text.y+") rotate("+targetRotation+")";
                        minMarkerText.transition()
                            .attr("transform",rotStr)
                            .text(minValue);
                        minValueText.transition()
                            .text(minValue);
                    }
                    else if(minValue == null){
                        minValue = self.config.max;
                    }
                }
                if(self.config.trackAvg)
                {
                    if(avgCounter > 1){
                        pointerValue = pointerValue;
                        avgValue =  Math.round((((avgValue * (avgCounter-1)) + pointerValue)/(avgCounter)));
                    }
                    else{
                        pointerValue = Math.round(pointerValue);
                        avgValue = pointerValue;
                    }
                    var avgMarker = self.body.select(".avgMarker");
                    var avgTitle = avgMarker.select("title");
                    var avgMarkerText = self.body.select(".avgMarkerText");
                    var avgValueText = self.body.select(".avgValueText");
                    var tip = self.valueToPoint(avgValue, 0.85);
                    var text = self.valueToPoint(avgValue, 0.93);
                    var baseLeft = self.valueToPoint((avgValue-1), 0.90);
                    var baseRight = self.valueToPoint((avgValue+1), 0.90);
                    var triStr = "M "+tip.x+" "+tip.y+" L "+baseLeft.x+" "+baseLeft.y+" L "+baseRight.x+" "+baseRight.y+" z";
                    avgMarker.transition()
                        .attr("d", triStr);
                    avgTitle.text("Avg: " + Math.round(avgValue));

                    var targetRotation = (self.valueToDegrees(avgValue)-90);
                    var rotStr = "translate("+text.x+","+text.y+") rotate("+targetRotation+")";
                    avgMarkerText.transition()
                        .attr("transform",rotStr)
                        .text(Math.round(avgValue));
                    avgValueText.transition()
                        .text(Math.round(avgValue));
                    avgCounter = avgCounter + 1;
                }
                if(self.config.trackMax)
                {
                    if(pointerValue > maxValue){
                        maxValue = Math.round(pointerValue);
                        var maxMarker = self.body.select(".maxMarker");
                        var maxTitle = maxMarker.select("title");
                        var maxMarkerText = self.body.select(".maxMarkerText");
                        var maxValueText = self.body.select(".maxValueText");
                        var tip = self.valueToPoint(maxValue, 0.85);
                        var text = self.valueToPoint(maxValue, 0.93);
                        var baseLeft = self.valueToPoint((maxValue-1), 0.90);
                        var baseRight = self.valueToPoint((maxValue+1), 0.90);
                        var triStr = "M "+tip.x+" "+tip.y+" L "+baseLeft.x+" "+baseLeft.y+" L "+baseRight.x+" "+baseRight.y+" z";
                        maxMarker.transition()
                            .attr("d", triStr);
                        maxTitle.text("Max: " + maxValue);

                        var targetRotation = (self.valueToDegrees(maxValue)-90);
                        var rotStr = "translate("+text.x+","+text.y+") rotate("+targetRotation+")";
                        maxMarkerText.transition()
                            .attr("transform",rotStr)
                            .text(maxValue);
                        maxValueText.transition()
                            .text(maxValue);
                    }
                    else if(maxValue == null){
                        maxValue = self.config.min;
                    }
                }

                var targetRotation = (self.valueToDegrees(pointerValue) - 90);
                var currentRotation = self._currentRotation || targetRotation;
                self._currentRotation = targetRotation;

                return function(step)
                {
                    var rotation = currentRotation + (targetRotation-currentRotation)*step;
                    return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")";
                };
            });
    };

    this.valueToDegrees = function(value)
    {
        // thanks @closealert
        return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
    };

    this.valueToRadians = function(value)
    {
        return this.valueToDegrees(value) * Math.PI / 180;
    };

    this.valueToPoint = function(value, factor)
    {
        return { 	x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value)),
            y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value)) 		};
    };

    // initialization
    this.configure(configuration);
}

