# Docker

### Preparando o ambiente (Usando Ubutun 18.04)

```
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce=18.06.1~ce~3-0~ubuntu
```

### Trocando o usuário do docker

```
sudo usermod -aG docker $USER
```

### Testando

```
docker info
sudo docker run hello-world
```

### Iniciando container

```
docker run --name {container-name} --hostname {container-hostname} -d -t -p {port-from}:{port-to} {image}:{version}
```

### Construir uma imagem

```
docker build -t {image}:{version} {path-to-dockerfile}
```

### Enviar imagem local para o repositório do Docker

```
docker push -t {repo-tag} {repo-user}/{repo-name}
```

### Iniciar o bash no container

```
docker exec -it {container-id} /bin/bash
```

### Informações do container

```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' {container-id}
```

### Exibindo todos os containers em run

```
docker ps
```

### Exibindo todos os containers em run/stoped

```
docker ps -a
```

### Exibindo todas as imagens do docker

```
docker images
```

### Removendo imagens do repositório local do docker

```
docker rmi {image}:{version}
```

### Parar container

```
docker stop {container-id}
```

### Iniciar container

```
docker start {container-id}
```

### Reiniciar container

```
docker restart {container-id}
```

### Removendo container

```
docker rm {docker-name}
```

### Adicionando volumes

```
docker volume create {volume-name}
```

### Removendo volumes

```
docker volume rm {volume-name}
```

### Inspecionando um volume

```
docker volume inspect {volume-name}
```

### Montar um volume bind

```
docker container run -d --mount type=bind,src={path-source},dst={path-destination},{permissions} {image}
```

### Montar um volume comun

```
docker container run -d --mount type=volume,src={path-source},dst={path-destination},{permissions} {image}
```

### Removendo todos os volumes

```
docker volume prune
```

### Remover todos os containers

```
docker rm $(docker ps -a -q) -f
```

### Adicionando privilégios ao iniciar container

```
--privileged
--cap-add={recurse}
```

### Adicionando variáveis ao container

```
--env="variavel=valor"
--env-file={path-env}
-e="variavel=valor"
```

### Removendo o container ao sair do mesmo

```
--rm
```

### Forçar parada de um container

```
docker kill {container-id}
```

### Copiar arquivos do/para container

```
docker cp {container-name}:{path-from} {path-to}
docker cp {path-from} {container-name}:{path-to}
```

### Exibir configurações de porta do container

```
docker port {container-name}
```

### Configurar portas dinamicamente de acordo ao Dockerfile

```
docker run --name {container-name} --hostname {container-hostname} -d -t -P {image}:{version}
```

### Montar volumes no container

```
-v {path-from}:{path-to}:{permissions-read-or-write}
--volumes-from={container-name}
```

### Linkar containers

```
--link {container-name}:{alias}
```

### Inspecionar o container

```
docker inspect {container-name}
```

### Diff do container

```
docker diff {container-name}
```

### Log do container

```
docker logs {container-name}
```

### Exportar e importar dados do container

```
docker export -o {path-file-to}.tar {container-name}
cat {path-file-from}.tar | docker import - {image}:{version}
```

### Salvar e carregar dados do container

```
docker save -p {path-file-to}.tar {image}:{version}
docker load < {path-file-from}.tar
```

### Download de images

```
docker pull {image}:{version}
```

### Uploda de images

```
docker push {user}/{image}:{version}
```

### Buscar referências de imagem

```
docker search {image-name}
```

### Informações do Docker

```
docker info
```

### Logar e Deslogar no registry docker-hub

```
docker login
docker logout
```

### Versionamento de container

```
docker commit -m "Comentário do commit" {container-name} {image}:{version}
```

### Tags de container

```
docker tag {image}:{version} {image}:latest
```

### Construir imagem de um Dockerfile

```
docker build -t {user}/{image}:{version} .
```

### Example Redmine

```
docker run -dt --name redminedb \
-v ~/Docker/mysql:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=r3dm1n3 \
-e MYSQL_DATABASE=redmine \
mysql:5.7
docker run -dt --name redmineapp \
--link redminedb \
-v ~/Docker/redmine:/usr/src/redmine/files \
-e REDMINE_DB_MYSQL=redminedb \
-e REDMINE_DB_PASSWORD=r3dm1n3 \
-e REDMINE_DB_DATABASE=redmine \
-p 8080:3000 \
redmine
```

# Docker Swarm

### Iniciar um cluster

```
docker swarm init
```

### Listar nodes do cluster

```
docker node ls
```

### Exibir informação do token de manager

```
docker swarm join-token manager
```

### Exibir informação do token de worker

```
docker swarm join-token worker
```

### Informações do node

```
docker node inspect LINUXtips-02
```

### Promover node a manager

```
docker node promote LINUXtips-03
```

### Tornar node manager em worker

```
docker node demote LINUXtips-03
```

### Abandonar o cluser

```
docker swarm leave
docker swarm leave --force
```

### Remover um node do cluster

```
docker node rm LINUXtips-03
```

### Criar um serviço no cluster

```
docker service create --name webserver --replicas 5 -p 8080:80  nginx
```

### Criar uma interface de rede

```
docker network create -d overlay giropops
```

### Atualizar informações do serviço

```
docker service update <OPCOES> <Nome_Service> 
```