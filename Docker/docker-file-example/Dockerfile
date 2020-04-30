# Imagem base
FROM centos

# Mantido por
MAINTAINER Erivaldo Jr <eaojunior1@gmail.com>

# Labels
LABEL "com.example.vendor"="Example Docker"
LABEL version="1.0"
LABEL description="Example docker: \
Basic example Dockerfile"

# Variavel
ENV DIR_BASE=/usr/src
ENV DIR_TEST1=${DIR_BASE}/test1
ENV USER=eaojunior
ENV PASS=12345

# Adicionando arquivos
ADD files/examples ${DIR_BASE}/examples

# Desabilitar funções de interação
ENV DEBIAN_FRONTEND noninteractive

# Atualiza sistema
RUN yum -y update
RUN yum -y upgrade

# Local de trabalho
WORKDIR ${DIR_BASE}
RUN touch example.txt

# Portas
EXPOSE 80
EXPOSE 81

# Comando
CMD ["/bin/bash"]