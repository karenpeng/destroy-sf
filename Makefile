all: geometry.json
	echo "done"

nodes.json: sf.pbf parse-node.js truncate-point.js
	node parse-node.js > nodes.json
	echo '}' >> nodes.json

ways.json: sf.pbf parse-way.js
	node parse-way.js > ways.json
	echo '}' >> ways.json

relations.json: sf.pbf parse-relation.js
	node parse-relation.js > relations.json
	echo '}' >> relations.json

geometry.json: relations.json nodes.json ways.json build-geometry.js
	node build-geometry.js > geometry.json
