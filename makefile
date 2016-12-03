SVG = $(wildcard photos/*.jpg)
PNG = $(patsubst photos/%.jpg,images/%.jpg,$(SVG))

all: $(PNG)

images/%.jpg: photos/%.jpg
	convert $< -resize '300x300^' -gravity Center -crop 300x300+0+0 $@

clean: 
	rm $(PNG)
