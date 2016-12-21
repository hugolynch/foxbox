SVG = $(wildcard photos/*.jpg)
PNG = $(patsubst photos/%.jpg,www/images/%.jpg,$(SVG))

all: $(PNG)

www/images/%.jpg: photos/%.jpg
	convert $< -resize '300x300^' -gravity Center -crop 300x300+0+0 $@


upload:
	rsync -avi www/ urbanwild:/var/www/urbanwild.to/foxbox

pretty:
	python -m json.tool www/libraries.json

clean: 
	rm $(PNG)
