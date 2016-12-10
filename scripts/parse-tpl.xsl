<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:kml="http://www.opengis.net/kml/2.2"
>


<xsl:output method="text" indent="no"/>

<!--
<Placemark id="LIB02">
<name>Agincourt</name>
<description>Address: 155 Bonis Ave., Toronto, ON, M1T 3W6&lt;br/&gt;Link: http://www.torontopubliclibrary.ca/detail.jsp?R=LIB02</description>
<address>155 Bonis Ave., Toronto, ON, M1T 3W6</address>
<phoneNumber>416-396-8943</phoneNumber>
<Point>
<coordinates>-79.29342962962961,43.78516666666665</coordinates>
</Point>
</Placemark>
-->

<xsl:template match="kml:Document">
    <xsl:text>[</xsl:text>
	<xsl:apply-templates select="kml:Placemark"/>
    <xsl:text>]</xsl:text>
</xsl:template>

<xsl:template match="kml:Placemark">
    <xsl:text>{</xsl:text>
    "id": "<xsl:value-of select="@id"/>",
    "type": "tpl",
    "url": "http://www.torontopubliclibrary.ca/detail.jsp?R=<xsl:value-of select="@id"/>",
    "name": "<xsl:value-of select="kml:name"/>",
    "address": "<xsl:value-of select="substring-after(substring-before(kml:description, ', Toronto,'), 'Address: ')"/>",
    "coordinates": [<xsl:value-of
        select="substring-after(kml:Point/kml:coordinates, ',')"/>, <xsl:value-of
        select="substring-before(kml:Point/kml:coordinates, ',')"/>]
    <xsl:text>}</xsl:text>
    <xsl:if test="position() != last()">
        <xsl:text>,</xsl:text>
    </xsl:if>
</xsl:template>


</xsl:stylesheet>
