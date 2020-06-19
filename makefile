.PHONY: all clean test build start

all: clean test build

clean:
ifeq ($(OS), Windows_NT)
	@debian run "find . -type f \( -name '*.js' -o -name '*.js.map' \) -not -path './node_modules/*' -delete"
else
	@find . -type f \( -name '*.js' -o -name '*.js.map' \) -not -path './node_modules/*' -delete
endif

test:
ifeq ($(OS), Windows_NT)
	@.\node_modules\.bin\eslint . --ext .ts
else
	@./node_modules/.bin/eslint . --ext .ts
endif

build:
ifeq ($(OS), Windows_NT)
# Fetch badges
	@debian run ./scripts/fetchBadges.sh
# Transpile TypeScript
	@.\node_modules\.bin\tsc
# Verify Constants Sanity
	@debian run ./scripts/constantSanityCheck.sh
else
# Fetch badges
	@./scripts/fetchBadges.sh
# Transpile TypeScript
	@./node_modules/.bin/tsc
# Verify Constants Sanity
	@./scripts/constantSanityCheck.sh
endif
# Generate Commands Data
	@node ./scripts/generateCommandsData.js

start:
	@node .

obfuscate:
	@npx javascript-obfuscator . --output ./build --target node --self-defending true --source-map false --source-map-mode inline --exclude './node_modules,./build'

generate:
# Generate obfuscated code
	@make obfuscate
# Copy assets
	@cp -r ./assets ./build/
# Copy locales
	@cp -r ./locales ./build/
# Copy example settings
	@cp ./settings/configurations.example.yaml ./build/settings/configurations.example.yaml
	@cp ./settings/credentials.example.yaml ./build/settings/credentials.example.yaml
# Copy scripts
	@cp -r ./scripts/bash ./build/scripts
	@cp -r ./scripts/powershell ./build/scripts
	@cp ./bastion.sh ./build/bastion.sh
	@cp ./bastion.cmd ./build/bastion.cmd
# Copy changelog
	@cp ./changelog.yaml ./build/changelog.yaml
# Copy manifest
	@cp ./package.json ./build/package.json

publish:
	@rm -rf ./build/ &>/dev/null
	@git clone --depth 1 https://github.com/TheBastionBot/Bastion.git build
	@make generate
	@cd ./build && git add .
	@cd ./build && git commit -S -s -m "new changes from origin"
	@cd ./build && git push -u origin master
	@rm -rf ./build/ &>/dev/null
