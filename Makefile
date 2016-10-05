.PHONY: clean

all: build/building-geom.bin
	echo "done"

clean:
	rm build/building-geom.json build/nodes.json build/buildings.json build/building-geom.bin

build/nodes.json: build/sf.pbf build/parse-node.js build/truncate-point.js
	node build/parse-node.js > build/nodes.json
	echo '}' >> build/nodes.json

build/buildings.json: build/sf.pbf build/parse-buildings.js
	node build/parse-buildings.js > build/buildings.json
	echo ']' >> build/buildings.json

build/building-geom.json: build/nodes.json build/buildings.json build/gen-buildings.js
	node build/gen-buildings.js > build/building-geom.json

build/building-geom.bin: build/building-geom.json build/compress-buildings.js
	node build/compress-buildings.js
