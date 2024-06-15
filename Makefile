include .env
export $(shell sed 's/=.*//' .env)

# Knex command
KNEX := ./node_modules/.bin/knex

# Database migrations
migrate-latest:
	@echo "Running migrations..."
	@$(KNEX) migrate:latest --cwd="src/database" --migrations-directory="migrations" --env=$(NODE_ENV)

migrate-rollback:
	@echo "Rolling back migrations..."
	@$(KNEX) migrate:rollback --cwd="src/database" --migrations-directory="migrations" --env=$(NODE_ENV)

migrate-make name="migration-name":
	@echo "Creating a new migration: $(name)"
	@$(KNEX) migrate:make --cwd="src/database" --migrations-directory="migrations" $(name) --env=$(NODE_ENV)

# Database seeds
seed-run:
	@echo "Running seeds..."
	@$(KNEX) seed:run --env=$(NODE_ENV)

# Database utilities
db-create:
	@echo "Creating database..."
	@createdb $(shell echo $(DATABASE_URL) | sed 's/\/.*\///g')

db-drop:
	@echo "Dropping database..."
	@dropdb $(shell echo $(DATABASE_URL) | sed 's/\/.*\///g')

db-reset: db-drop db-create migrate-latest seed-run

# Install dependencies
install:
	@echo "Installing dependencies..."
	@npm install

# Start the application
start:
	@echo "Starting the application..."
	@node app.js

# Run tests
test:
	@echo "Running tests..."
	@npm test

.PHONY: migrate-latest migrate-rollback migrate-make seed-run db-create db-drop db-reset install start test