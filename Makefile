PNGS := $(patsubst graphviz/%dot,graphviz/%dot.png,$(wildcard graphviz/*.dot))

all: $(PNGS)

graphviz/%.dot.png: graphviz/%.dot
	circo -O -Tpng $<

graphviz/node%.dot.png: graphviz/node%.dot
	dot -O -Tpng $<
