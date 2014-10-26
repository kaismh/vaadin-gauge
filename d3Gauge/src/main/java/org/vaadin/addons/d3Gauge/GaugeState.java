package org.vaadin.addons.d3Gauge;

import com.vaadin.shared.ui.JavaScriptComponentState;

/**
 * Created by kaismh on 10/18/14.
 */
public class GaugeState extends JavaScriptComponentState {

    private Integer size;
    private Integer value;
    private String label;
    private GaugeConfig config;

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public GaugeConfig getConfig() {
        return config;
    }

    public void setConfig(GaugeConfig config) {
        this.config = config;
    }
}
