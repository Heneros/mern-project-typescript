build:
	docker compose -f local.yml up -d --build --remove-orphans

up:
	docker compose -f local.yml up -d 

show-logs-backend:
	docker compose -f local.yml logs backend

show-logs-frontend:
	docker compose -f local.yml logs frontend

down:
	docker compose -f local.yml down