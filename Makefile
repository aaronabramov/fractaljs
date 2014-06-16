karma:
	echo 'Running tests...'
	./node_modules/karma/bin/karma start

test:
	./node_modules/mocha/bin/mocha --reporter spec --recursive
	./node_modules/karma/bin/karma start --single-run


watch_test:
	./node_modules/mocha/bin/mocha --watch --reporter spec --recursive

install:
	npm install

dev:
	nodemon src/app --path `pwd`/example/assets

.PHONY: karma test
