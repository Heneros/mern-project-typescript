build:
	docker compose -f local.yml up -d --build --remove-orphans

up:
	docker compose -f local.yml up -d  --watch

show-logs-backend:
	docker compose -f local.yml logs backend

down:
	docker compose -f local.yml down