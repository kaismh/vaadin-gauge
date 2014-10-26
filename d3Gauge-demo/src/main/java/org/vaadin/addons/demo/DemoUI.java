package org.vaadin.addons.demo;


import javax.servlet.annotation.WebServlet;

import com.github.wolfie.refresher.Refresher;
import com.vaadin.annotations.Theme;
import com.vaadin.annotations.Title;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.server.FontAwesome;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.shared.ui.label.ContentMode;
import com.vaadin.ui.*;
import com.vaadin.ui.themes.ValoTheme;
import org.vaadin.addons.d3Gauge.Gauge;
import org.vaadin.addons.d3Gauge.GaugeConfig;
import org.vaadin.addons.d3Gauge.GaugeStyle;
import org.vaadin.addons.d3Gauge.Zone;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Theme("demo")
@Title("D3 Gauge Demo")
@SuppressWarnings("serial")
public class DemoUI extends UI
{

    private final Random random = new Random();
    private Gauge darkGauge;
    private Gauge lightGauge;
    private Gauge defaultGauge;
    private Gauge valoGauge;
    private Gauge avgGauge;

    private Integer coreNum=0;

    @WebServlet(value = "/*", asyncSupported = true)
    @VaadinServletConfiguration(productionMode = true, ui = DemoUI.class, widgetset = "org.vaadin.addons.demo.DemoWidgetSet")
    public static class Servlet extends VaadinServlet {
    }

    @Override
    protected void init(VaadinRequest request) {

        final TabSheet sheet = new TabSheet();
        sheet.setSizeFull();
        sheet.addStyleName(ValoTheme.TABSHEET_FRAMED);

        setContent(sheet);

        TabSheet.Tab tabHome = sheet.addTab(getHomeContent(), "Home");
        tabHome.setIcon(FontAwesome.HOME);

        TabSheet.Tab tabUsage = sheet.addTab(getUsageContent(), "Usage");
        tabUsage.setIcon(FontAwesome.CODE);

        TabSheet.Tab tabStyles = sheet.addTab(getCustomStyleContent(), "Custom Style");
        tabStyles.setIcon(FontAwesome.PICTURE_O);

        TabSheet.Tab tabCustomRange = sheet.addTab(getCustomRangeContent(), "Custom Ranges");
        tabCustomRange.setIcon(FontAwesome.DASHBOARD);

        TabSheet.Tab tabAverage = sheet.addTab(getComputeAVGContent(), "Average");
        tabAverage.setIcon(FontAwesome.TASKS);


        startUIUpdate();

    }

    private void updateGauges() {

        darkGauge.setValue(random.nextInt(101));
        lightGauge.setValue(random.nextInt(101));
        defaultGauge.setValue(random.nextInt(101));
        valoGauge.setValue(random.nextInt(101));
        avgGauge.setValue(random.nextInt(45) +5);
    }

    private void startUIUpdate()
    {
        Refresher refresher = new Refresher();
        refresher.setRefreshInterval(4000);
        refresher.addListener(new Refresher.RefreshListener() {
            @Override
            public void refresh(Refresher refresher) {
                updateGauges();
            }
        });

        addExtension(refresher);
    }

    private Component getHomeContent() {

        VerticalLayout content = new VerticalLayout();
        content.setMargin(true);
        content.setSpacing(true);

        Label header = new Label("D3 Gauge");
        header.addStyleName(ValoTheme.LABEL_H2);
        content.addComponent(header);

        Label headerContent = new Label(
                "A Vaadin Gauge component based on <a href=\"https://d3js.org\" target=\"_blank\">D3</a>. This component aims to be easy to use and customizable.",
                ContentMode.HTML);
        content.addComponent(headerContent);


        Label styles = new Label("Styles");
        styles.addStyleName(ValoTheme.LABEL_H2);
        content.addComponent(styles);

        Label label = new Label("There are 4 embedded themes, and you can create your own custom style.");
        content.addComponent(label);

        HorizontalLayout row = new HorizontalLayout();
        row.addStyleName(ValoTheme.LAYOUT_HORIZONTAL_WRAPPING);
        row.setSpacing(true);
        content.addComponent(row);

        Panel panelDefault = new Panel("Default Style");
        panelDefault.setIcon(FontAwesome.DASHBOARD);
        defaultGauge = getStyleGauge(GaugeStyle.STYLE_DEFAULT);
        panelDefault.setContent(defaultGauge);
        row.addComponent(panelDefault);

        Panel panelDark = new Panel("Dark Style");
        panelDark.setIcon(FontAwesome.IMAGE);
        darkGauge = getStyleGauge(GaugeStyle.STYLE_DARK);
        panelDark.setContent(darkGauge);
        row.addComponent(panelDark);

        Panel panelValo = new Panel("Valo Style");
        panelValo.setIcon(FontAwesome.PENCIL);
        valoGauge = getStyleGauge(GaugeStyle.STYLE_VALO);
        panelValo.setContent(valoGauge);
        row.addComponent(panelValo);

        Panel panelLight = new Panel("Light Style");
        panelLight.setIcon(FontAwesome.VIDEO_CAMERA);
        lightGauge=getStyleGauge(GaugeStyle.STYLE_LIGHT);
        panelLight.setContent(lightGauge);
        row.addComponent(panelLight);


        return content;
    }

    private Component getCustomRangeContent() {

        VerticalLayout content = new VerticalLayout();
        content.setMargin(true);
        content.setSpacing(true);

        Label header = new Label("Custom Ranges");
        header.addStyleName(ValoTheme.LABEL_H2);
        content.addComponent(header);

        Label headerContent = new Label(
                "You can also customize, the green, yellow and red zones ranges. This can be achieved via passing a list of zones to the GaugeConfig class.",
                ContentMode.HTML);
        content.addComponent(headerContent);

        content.addComponent(getCustomRangesGauge());

        return content;
    }

    private Component getBasicUsageExample() {

        HorizontalLayout row = new HorizontalLayout();
        row.addStyleName(ValoTheme.LAYOUT_HORIZONTAL_WRAPPING);
        row.setSpacing(true);

        Label codeBasicUsage= new Label("<code> Gauge gauge = new Gauge(\"Memory\",76,200);" +
                "<br>layout.addComponent(gauge); </code><br>",ContentMode.HTML);
        codeBasicUsage.setCaption("Basic Usage");
        codeBasicUsage.addStyleName(ValoTheme.LABEL_SMALL);
        codeBasicUsage.addStyleName(ValoTheme.LABEL_COLORED);
        row.addComponent(codeBasicUsage);
        row.addComponent(getDefaultGauge());

        return row;

    }

    private Component getCustomUsageExample() {

        HorizontalLayout row = new HorizontalLayout();
        row.addStyleName(ValoTheme.LAYOUT_HORIZONTAL_WRAPPING);
        row.setSpacing(true);

        Label codeCustomUsage= new Label("<code>GaugeConfig config = new GaugeConfig(); <br>" +
                "config.setStyle(GaugeStyle.STYLE_DARK.toString()); <br>" +
                "config.setMin(-100); <br>" +
                "Gauge gauge = new Gauge(\"Custom\",14,200,config); <br>" +
                "layout.addComponent(gauge); </code><br>",ContentMode.HTML);
        codeCustomUsage.setCaption("Custom Usage");
        codeCustomUsage.addStyleName(ValoTheme.LABEL_SMALL);
        codeCustomUsage.addStyleName(ValoTheme.LABEL_COLORED);
        row.addComponent(codeCustomUsage);
        row.addComponent(getCustomUsageGauge());

        return row;

    }
    private Component getUsageContent() {

        VerticalLayout content = new VerticalLayout();
        content.setMargin(true);
        content.setSpacing(true);

        Label header = new Label("Gauge Usage");
        header.addStyleName(ValoTheme.LABEL_H2);
        content.addComponent(header);

        Label headerContent = new Label(
                "Using the Gauge is straight forward, if you want to keep the default style and configuration, " +
                        "create a new instance of Gauge class and add it to a container.");
        content.addComponent(headerContent);
        content.addComponent(getBasicUsageExample());

        Label labelConfiguration = new Label(
                "If you want to change the configuration or style, " +
                        "create a new instance of GaugeConfig class and pass it to the Gauge constructor.");
        content.addComponent(labelConfiguration);
        content.addComponent(getCustomUsageExample());

        return content;
    }

    private Component getComputeAVGContent() {

        VerticalLayout content = new VerticalLayout();
        content.setMargin(true);
        content.setSpacing(true);

        Label header = new Label("Min, Max and Average");
        header.addStyleName(ValoTheme.LABEL_H2);
        content.addComponent(header);

        Label headerContent = new Label(
                "The Gauge can also compute the min, max and average for the value. This is suited for long running gauges.");
        content.addComponent(headerContent);

        setComputeAvgGauge();
        content.addComponent(avgGauge);

        return content;
    }

    private Component getCustomStyleContent() {

        VerticalLayout content = new VerticalLayout();
        content.setMargin(true);
        content.setSpacing(true);

        Label header = new Label("Styling");
        header.addStyleName(ValoTheme.LABEL_H2);
        content.addComponent(header);

        Label headerContent = new Label(
                "Styling the Gauge is achieved through CSS. " +
                        "Have a look at the demo code at the <a href=\"https://github.com/kaismh/vaadin-gauge/\" target=\"_blank\">github</a> repository.",
                ContentMode.HTML);
        content.addComponent(headerContent);

        content.addComponent(getCustomStyleGauge());

        return content;
    }

    private void setComputeAvgGauge() {

        GaugeConfig gaugeConfig = new GaugeConfig();
        gaugeConfig.setMin(0);
        gaugeConfig.setTransitionDuration(1500);
        gaugeConfig.setMax(50);
        gaugeConfig.setMajorTicks(10);
        gaugeConfig.setShowCurrentLabel(true);
        gaugeConfig.setTrackAvg(true);
        gaugeConfig.setTrackMax(true);
        gaugeConfig.setTrackMin(true);
        gaugeConfig.setStyle(GaugeStyle.STYLE_LIGHT.toString());

        avgGauge = new Gauge("MB/S",20,400,gaugeConfig);

    }
    private Gauge getCustomRangesGauge() {

        GaugeConfig gaugeConfig = new GaugeConfig();

        gaugeConfig.setMin(-40);
        gaugeConfig.setMax(60);

        List<Zone> greenZones = new ArrayList<Zone>();
        greenZones.add(new Zone(0, 20));

        List<Zone> yellowZones = new ArrayList<Zone>();
        yellowZones.add(new Zone(-20, 0));
        yellowZones.add(new Zone(20,40));

        List<Zone> redZones = new ArrayList<Zone>();
        redZones.add(new Zone(-40,-20));
        redZones.add(new Zone(40,60));

        gaugeConfig.setGreenZones(greenZones);
        gaugeConfig.setYellowZones(yellowZones);
        gaugeConfig.setRedZones(redZones);
        gaugeConfig.setStyle(GaugeStyle.STYLE_VALO.toString());

        Gauge gauge = new Gauge("Celsius",10,400,gaugeConfig);

        return gauge;
    }

    private Gauge getDefaultGauge() {

        Gauge gauge = new Gauge("Memory",76,200);
        return gauge;

    }

    private Gauge getStyleGauge(GaugeStyle style) {


        GaugeConfig config = new GaugeConfig();
        config.setStyle(style.toString());
        config.setTransitionDuration(1500);
        Gauge gauge = new Gauge("Core " + (++coreNum).toString(),random.nextInt(101),300,config);
        return gauge;

    }

    private Gauge getCustomUsageGauge() {


        GaugeConfig config = new GaugeConfig();
        config.setStyle(GaugeStyle.STYLE_DARK.toString());
        config.setMin(-100);

        Gauge gauge = new Gauge("Custom",14,200,config);
        return gauge;

    }


    private Gauge getCustomStyleGauge() {

        GaugeConfig config = new GaugeConfig();
        config.setStyle("customstyle");

        Gauge gauge = new Gauge("Custom",40,400,config);

        return gauge;
    }

}
