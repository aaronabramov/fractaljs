karma:
	echo 'Running tests...'
	./node_modules/karma/bin/karma start

test:
	./node_modules/mocha/bin/mocha --reporter spec
	./node_modules/karma/bin/karma start --single-run


watch_test:
	./node_modules/mocha/bin/mocha --watch --reporter spec

install:
	npm install

dev:
	nodemon src/server --path `pwd`/example/assets

.PHONY: karma test
