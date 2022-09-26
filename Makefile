
STACKPREFIX := RealTimeDataProcessing

.PHONY: install build diff deploy deploy-ui

install:
	yarn install

build:
	yarn build

synth:
	yarn cdk synth -c stackPrefix=$(STACKPREFIX)

diff:
	yarn cdk diff -c stackPrefix=$(STACKPREFIX)

deploy:
	yarn cdk deploy -c stackPrefix=$(STACKPREFIX) --all

deploy-ui:
	yarn deploy
