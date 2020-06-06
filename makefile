.PHONY: all clean test build start

all: clean test build

clean:
	@find . -type f \( -name '*.js' -o -name '*.js.map' \) -not -path './node_modules/*' -delete

test:
	@./node_modules/.bin/eslint . --ext .ts

build:
# Fetch badges
	@./scripts/fetchBadges.sh
# Transpile TypeScript
	@./node_modules/.bin/tsc
# Verify Constants Sanity
	@./scripts/constantSanityCheck.sh
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
	@cp -r ./assets ./build/assets
# Copy locales
	@cp -r ./locales ./build/locales
# Copy example settings
	@cp ./settings/configurations.example.yaml ./build/settings/configurations.example.yaml
	@cp ./settings/credentials.example.yaml ./build/settings/credentials.example.yaml
# Copy scripts
	@cp -r ./scripts/bash ./build/scripts/bash
	@cp -r ./scripts/powershell ./build/scripts/powershell
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
