karma:
	$(MAKE) arg="--single-run" watch_karma

mocha:
	./node_modules/mocha/bin/mocha ./test/setup.js ./test/{,**/,**/**/}*_test.js --reporter spec $(arg)

test:
	$(MAKE) mocha
	# $(MAKE) karma

watch_mocha:
	$(MAKE) arg="--watch" mocha

watch_karma:
	./node_modules/karma/bin/karma start $(arg)

install:
	npm install

dev:
	nodemon src/app --path `pwd`/example/assets

.PHONY: karma test
