.PHONY: help
.DEFAULT_GOAL := help

dist/connect: ## Generates dist files for the connect action
	@echo '🔨Building connect'
	ncc build connect/connect.js -o connect/dist/
	mv connect/dist/index.js connect/dist/connect.js
	ncc build connect/disconnect.js -o connect/dist/
	mv connect/dist/index.js connect/dist/disconnect.js

dist/login: ## Generates the dist files for the login action
	@echo '🔨Building login'
	ncc build login/login.js -o login/dist/
	mv login/dist/index.js login/dist/login.js
	ncc build login/logout.js -o login/dist/
	mv login/dist/index.js login/dist/logout.js

dist/intercept: ## Generates the dist files for the intercept action
	@echo '🔨Building intercept'
	ncc build intercept/intercept.js -o intercept/dist/
	mv intercept/dist/index.js intercept/dist/intercept.js
	ncc build intercept/leave.js -o intercept/dist/
	mv intercept/dist/index.js intercept/dist/leave.js

dist: dist/connect dist/login dist/intercept ## Generates all actions dist files
	@echo '✅ done building dist files'



dist/clean: ## Removes all actions dist files
	rm -r connect/dist
	rm -r login/dist
	rm -r intercept/dist

