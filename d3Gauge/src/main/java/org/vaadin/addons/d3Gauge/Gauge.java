package org.vaadin.addons.d3Gauge;

import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.AbstractJavaScriptComponent;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by kaismh on 10/18/14.
 */
@JavaScript({"d3-3.4.13.min.js","gauge_connector.js"})
@StyleSheet({"default_gauge.css","light_gauge.css","dark_gauge.css","valo_gauge.css"})
public class Gauge extends AbstractJavaScriptComponent {

    public Gauge(String label, Integer value, Integer size) {

        this(label,value,size,new GaugeConfig());

    }

    public Gauge(String label, Integer value, Integer size, GaugeConfig config) {

        getState().setLabel(label);
        getState().setValue(value);
        getState().setSize(size);
        getState().setConfig(config);

        setDefaultZone(config);

    }

    private void setDefaultZone(GaugeConfig config) {

        //If no zones are created, provide default zone
        Integer range = config.getMax() - config.getMin();
        if(config.getGreenZones()==null) {
            List<Zone> greenZones = new ArrayList<Zone>();
            greenZones.add(new Zone(config.getMin(),
                    config.getMin() + Math.round(range * 0.60f) ));
            config.setGreenZones(greenZones);
        }

        if(config.getYellowZones()==null) {
            List<Zone> yellowZones = new ArrayList<Zone>();
            yellowZones.add(new Zone(config.getMin() + Math.round(range * 0.60f),
                    config.getMin() + Math.round(range * 0.80f)));
            config.setYellowZones(yellowZones);
        }

        if(config.getRedZones()==null) {
            List<Zone> redZones = new ArrayList<Zone>();
            redZones.add(new Zone(config.getMin() + Math.round(range * 0.80f),
                    config.getMax()));
            config.setRedZones(redZones);
        }
    }

    @Override
    protected GaugeState getState() {
        return (GaugeState) super.getState();
    }

    public void setValue(Integer value) {
        getState().setValue(value);
    }

    public Integer getValue() {
       return getState().getValue();
    }

}
