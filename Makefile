unit:
	echo 'Running tests...'
	./node_modules/karma/bin/karma start

install:
	npm install

dev:
	nodemon src/server --path `pwd`/example/assets
