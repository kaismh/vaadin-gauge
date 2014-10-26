package org.vaadin.addons.d3Gauge;

import java.io.Serializable;
import java.util.List;

/**
 * Created by kaismh on 10/23/14.
 */
public class GaugeConfig implements Serializable {

    private Integer min;
    private Integer max;
    private Integer majorTicks;
    private Integer minorTicks;
    private Integer transitionDuration;
    private Boolean trackMin;
    private Boolean trackMax;
    private Boolean trackAvg;
    private Boolean showCurrentLabel;
    private String style;
    private List<Zone> greenZones;
    private List<Zone> yellowZones;
    private List<Zone> redZones;

    public GaugeConfig() {

        this.min = 0;
        this.max = 100;
        this.majorTicks = 5;
        this.minorTicks = 5;
        this.transitionDuration = 50;
        this.trackMin = false;
        this.trackMax = false;
        this.trackAvg = false;
        this.showCurrentLabel = false;
        this.style = GaugeStyle.STYLE_DEFAULT.toString();
        this.greenZones=null;
        this.yellowZones=null;
        this.redZones=null;

    }

    public Integer getMin() {
        return min;
    }

    public void setMin(Integer min) {
        this.min = min;
    }

    public Integer getMax() {
        return max;
    }

    public void setMax(Integer max) {
        this.max = max;
    }

    public Integer getMajorTicks() {
        return majorTicks;
    }

    public void setMajorTicks(Integer majorTicks) {
        this.majorTicks = majorTicks;
    }

    public Integer getMinorTicks() {
        return minorTicks;
    }

    public void setMinorTicks(Integer minorTicks) {
        this.minorTicks = minorTicks;
    }

    public Integer getTransitionDuration() {
        return transitionDuration;
    }

    public void setTransitionDuration(Integer transitionDuration) {
        this.transitionDuration = transitionDuration;
    }

    public Boolean getTrackMin() {
        return trackMin;
    }

    public void setTrackMin(Boolean trackMin) {
        this.trackMin = trackMin;
    }

    public Boolean getTrackMax() {
        return trackMax;
    }

    public void setTrackMax(Boolean trackMax) {
        this.trackMax = trackMax;
    }

    public Boolean getTrackAvg() {
        return trackAvg;
    }

    public void setTrackAvg(Boolean trackAvg) {
        this.trackAvg = trackAvg;
    }

    public Boolean getShowCurrentLabel() {
        return showCurrentLabel;
    }

    public void setShowCurrentLabel(Boolean showCurrentLabel) {
        this.showCurrentLabel = showCurrentLabel;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public List<Zone> getGreenZones() {
        return greenZones;
    }

    public void setGreenZones(List<Zone> greenZones) {
        this.greenZones = greenZones;
    }

    public List<Zone> getYellowZones() {
        return yellowZones;
    }

    public void setYellowZones(List<Zone> yellowZones) {
        this.yellowZones = yellowZones;
    }

    public List<Zone> getRedZones() {
        return redZones;
    }

    public void setRedZones(List<Zone> redZones) {
        this.redZones = redZones;
    }
}
