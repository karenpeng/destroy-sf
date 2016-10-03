all: build/geometry.json
	echo "done"

build/nodes.json: build/sf.pbf build/parse-node.js build/truncate-point.js
	node build/parse-node.js > build/nodes.json
	echo '}' >> build/nodes.json

build/ways.json: build/sf.pbf build/parse-way.js
	node build/parse-way.js > build/ways.json
	echo '}' >> build/ways.json

build/relations.json: build/sf.pbf build/parse-relation.js
	node build/parse-relation.js > build/relations.json
	echo '}' >> build/relations.json

build/geometry.json: build/relations.json build/nodes.json build/ways.json build/build-geometry.js
	node build/build-geometry.js > build/geometry.json
