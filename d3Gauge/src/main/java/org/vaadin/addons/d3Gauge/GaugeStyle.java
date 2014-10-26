package org.vaadin.addons.d3Gauge;

/**
 * Created by kaismh on 10/9/14.
 */
public enum GaugeStyle {

    STYLE_DEFAULT("default"), STYLE_LIGHT("light"),
    STYLE_DARK("dark"), STYLE_VALO("valo");

    private final String name;

    GaugeStyle(final String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}