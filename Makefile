all: flat-ways.json
	echo "done"

flat-ways.json: nodes.json ways.json flatten-ways.js
	node flatten-ways.js > flat-ways.json

nodes.json: sf.pbf parse-node.js truncate-point.js
	node parse-node.js > nodes.json
	echo '}' >> nodes.json

ways.json: sf.pbf parse-way.js
	node parse-way.js > ways.json
	echo '}' >> ways.json
