# Configurações
BUCKET_NAME = my-app-local
AWS_ENDPOINT_URL = http://localhost:4566
AWS_ACCESS_KEY_ID = test
AWS_SECRET_ACCESS_KEY = test
AWS_DEFAULT_REGION = us-east-1

# Exportar variáveis de ambiente
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION

.PHONY: s3-setup s3-list-buckets s3-list

# Teste completo (criar bucket e objetos)
s3-setup:
	@echo "Executando teste completo do S3..."
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3 ls
	@echo "Criando bucket..."
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3api create-bucket --bucket $(BUCKET_NAME) &
	@echo "Criando estrutura de diretórios..."
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3api put-object --bucket $(BUCKET_NAME) --key app/releases/ &
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3api put-object --bucket $(BUCKET_NAME) --key app/releases/2025-01-01T00:00:00-03:00/ &
	@echo "Criando arquivo app-debug.apk..."
	echo "Este é um arquivo de exemplo para o app-debug.apk" > app-debug.apk
	@echo "Fazendo upload do arquivo app-debug.apk..."
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3 cp app-debug.apk s3://$(BUCKET_NAME)/app/releases/2025-01-01T00:00:00-03:00/app-debug.apk &
	@echo "Criando arquivo build.json..."
	echo '{"versionCode": 1, "versionName": "1.0.0", "path": "app/releases/2025-01-01T00:00:00-03:00/app-debug.apk", "notes": "", "commit": ""}' | aws --endpoint-url=$(AWS_ENDPOINT_URL) s3 cp - s3://$(BUCKET_NAME)/app/releases/2025-01-01T00:00:00-03:00/build.json
	@echo "Listando conteúdo final..."
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3 ls s3://$(BUCKET_NAME) --recursive &
	@echo "Teste concluído com sucesso!" &

s3-list-buckets:
	@echo "Listando todos os buckets..."
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3 ls

s3-list:
	@echo "Listando conteúdo do bucket $(BUCKET_NAME)..."
	-aws --endpoint-url=$(AWS_ENDPOINT_URL) s3 ls s3://$(BUCKET_NAME) --recursive

# Help
help:
	@echo "Comandos disponíveis:"
	@echo "  s3-full-test	  - Teste completo (criar bucket, objetos e listar)"
	@echo "  s3-list		   - Listar conteúdo do bucket"
	@echo "  s3-health		 - Verificar health do LocalStack"
	@echo "  help			  - Mostrar esta ajuda"
