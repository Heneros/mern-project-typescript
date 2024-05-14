build:
	docker compose -f local.yml up -d --remove-orphans

up:
	docker compose -f local.yml up -d 

show-logs-backend:
	docker compose -f local.yml logs backend

down:
	docker compose -f local.yml down