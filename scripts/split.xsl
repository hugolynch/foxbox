<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:kml="http://www.opengis.net/kml/2.2"
>

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

<xsl:template match="/kml:Document">
[
	<xsl:apply-templates select="kml:Placemark"/>
]
</xsl:template>

<xsl:template match="kml:Placemark">
{
    "id": "<xsl:value-of select="@id"/>",
    "address": "<xsl:value-of select="kml:name"/>",
    "coordinates": [<xsl:value-of
        select="substring-after(kml:Point/kml:coordinates, ',')"/>, <xsl:value-of
        select="substring-before(kml:Point/kml:coordinates, ',')"/>]
},
</xsl:template>


</xsl:stylesheet>
