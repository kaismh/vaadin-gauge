Vaadin D3 Gauge
================

D3 Gauge is a Vaadin UI component based on [D3](http://d3js.org).  This component aims to be easy to use and customizable.

## Online demo

Try the add-on demo at <http://kaismh.jelastic.servint.net/>. The source code of the demo available [here](https://github.com/kaismh/vaadin-gauge/tree/master/d3Gauge-demo).

## Download release

Official releases of this add-on are available at Vaadin Directory. For Maven instructions, download and reviews, go to <http://vaadin.com/addon/d3Gauge>

## Building and running demo

git clone <https://github.com/kaismh/vaadin-gauge.git>

mvn clean install

cd  d3Gauge-demo

mvn jetty:run

To see the demo, navigate to http://localhost:8080/

## Roadmap

The following features are planned for upcoming releases:
- Better Documentation
- Make the Gauge responsive
    
## Issue tracking

The issues for this add-on are tracked on the [issues](https://github.com/kaismh/vaadin-gauge/issues) page. All bug reports and feature requests are appreciated. 


# Developer Guide

## Getting started

Using the Gauge is straight forward, if you want to keep the default style and configuration, create a new instance of Gauge class and add it to a container.

### Basics
```java
    Gauge gauge = new Gauge("Memory",76,200);
    layout.addComponent(gauge);
```  
### Custom Configuration
If you want to change the configuration or style, create a new instance of GaugeConfig class and pass it to the Gauge constructor.
```java
    GaugeConfig config = new GaugeConfig();
    config.setStyle(GaugeStyle.STYLE_DARK.toString());
    config.setMin(-100);
    Gauge gauge = new Gauge("Custom",14,200,config);
    layout.addComponent(gauge); 
``` 
For a more comprehensive example, see the demo project.

## Acknowledgements
The JavaScript code is mainly based on [Tomerd](https://gist.github.com/tomerd/1499279) and [Paulinm](https://gist.github.com/paulinm/10556397)  

## License & Author
 
Add-on is distributed under Apache License 2.0. For license terms, see LICENSE.txt.

Vaadin D3 Gauge is written by Kais Hassan
