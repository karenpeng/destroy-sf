.PHONY: clean

all: build/building-geom.json
	echo "done"

clean:
	rm build/building-geom.json build/nodes.json build/buildings.json

build/nodes.json: build/sf.pbf build/parse-node.js build/truncate-point.js
	node build/parse-node.js > build/nodes.json
	echo '}' >> build/nodes.json

build/buildings.json: build/sf.pbf build/parse-buildings.js
	node build/parse-buildings.js > build/buildings.json
	echo ']' >> build/buildings.json

build/building-geom.json: build/nodes.json build/buildings.json build/gen-buildings.js
	node build/gen-buildings.js > build/building-geom.json
