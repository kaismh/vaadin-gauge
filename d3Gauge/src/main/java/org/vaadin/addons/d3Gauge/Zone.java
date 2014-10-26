package org.vaadin.addons.d3Gauge;

import java.io.Serializable;

/**
 * Created by kaismh on 10/23/14.
 */
public class Zone implements Serializable {
    private Integer from;
    private Integer to;

    public Zone() {
    }

    public Zone(Integer from, Integer to) {
        this.from = from;
        this.to = to;
    }

    public Integer getFrom() {
        return from;
    }

    public void setFrom(Integer from) {
        this.from = from;
    }

    public Integer getTo() {
        return to;
    }

    public void setTo(Integer to) {
        this.to = to;
    }
}
