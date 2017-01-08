SVG = $(wildcard photos/*.jpg)
PNG = $(patsubst photos/%.jpg,www/images/%.jpg,$(SVG))

all: $(PNG)

www/images/%.jpg: photos/%.jpg
	convert $< -resize '300x300^' -gravity Center -crop 300x300+0+0 $@


upload:
	rsync -avi --exclude-from=.exclude www/ opencommons.ca:/web/foxbox

pretty:
	python -m json.tool www/libraries.json

clean: 
	rm $(PNG)
