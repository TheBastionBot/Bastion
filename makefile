.PHONY: all clean test build start

all: clean test build

clean:
	@find . -type f \( -name '*.js' -o -name '*.js.map' \) -not -path './node_modules/*' -delete

test:
	@./node_modules/.bin/eslint . --ext .ts

build:
	@./node_modules/.bin/tsc

start:
	@node .
