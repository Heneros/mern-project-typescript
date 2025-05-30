build:
	docker compose -f docker-compose.dev.yml up -d --build --remove-orphans

up:
	docker compose -f docker-compose.dev.yml up -d  --remove-orphans

show-logs-backend:
	docker compose -f docker-compose.dev.yml logs backend

show-logs-frontend:
	docker compose -f docker-compose.dev.yml logs frontend

show-logs-nginx:
	docker compose -f docker-compose.dev.yml logs nginx

show-logs-mongo-express:
	docker compose -f docker-compose.dev.yml logs  mongo-express

show-logs-mailhog:
	docker compose -f docker-compose.dev.yml logs  mailhog

down:
	docker compose -f docker-compose.dev.yml down

