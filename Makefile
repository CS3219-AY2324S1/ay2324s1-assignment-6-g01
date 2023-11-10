deploy:
	gcloud functions deploy getQuestions --region=asia-southeast1 --source=. --trigger-http --runtime=nodejs18 --allow-unauthenticated

local:
	yarn tsc
	npx @google-cloud/functions-framework --target=getQuestions

.PHONY: deploy local