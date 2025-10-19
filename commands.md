## Docker

- docker compose -f local.yml config   =>  Validates the configuration of the docker-compose file
- docker compose -f local.yml up --build -d --remove-orphans  =>  Starts the containers in detached mode
- docker compose -f local.yml logs ${service_name}  =>  View logs for a specific service
- docker run --rm unipay-api whoami  =>  View the user running inside the container
- docker volume inspect ${project_name}_${volume_name}  =>  Inspect a Docker volume
- docker compose -f local.yml up --build --force-recreate -d ${service_name}  =>  Rebuilds and restarts a specific service
- docker compose -f local.yml down --remove-orphans =>  Stops and removes the containers

## Ports

- Backend => 3000 (via npm run dev)
- Backend => 3001 (via docker)
- MongoDB => 27017
- Mongo Express => 8081
- Mailhog => 1025
- Mailhog UI => 8025

