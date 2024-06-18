build:
	docker compose -f local.yml up -d --build --remove-orphans

up:
	docker compose -f local.yml up -d  --remove-orphans

show-logs-backend:
	docker compose -f local.yml logs backend

show-logs-frontend:
	docker compose -f local.yml logs frontend

show-logs-nginx:
	docker compose -f local.yml logs nginx

show-logs-mongo-express:
	docker compose -f local.yml logs  mongo-express

show-logs-mailhog:
	docker compose -f local.yml logs  mailhog

down:
	docker compose -f local.yml down

