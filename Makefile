.PHONY: all install build start dev test clean docker-build docker-run

all: install build test

install:
	npm install

build:
	npm run build

start:
	node scripts/start-local.js

dev:
	npm run dev

test:
	node backend/tests/runner.js

docker-build:
	docker build -t relateiq-crm .

docker-run:
	docker run -p 3000:3000 -p 5000:5000 relateiq-crm

clean:
	rm -rf dist build coverage
