FROM eaojunior/centos

MAINTAINER Erivaldo Jr <eaojunior1@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# Variavel
ENV DIR_BASE=/usr/src
ENV DIR_TEST1=${DIR_BASE}/test1
ENV USER=root
ENV PASS=12345

# Configuração SSH
RUN yum install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo ${USER}:${PASS} | chpasswd
RUN sed -i "s/PermitRootLogin without-password/PermitRootLogin yes/g" /etc/ssh/sshd_config

# Expose ports
EXPOSE 22

# CMD
CMD ["/usr/sbin/sshd", "-D"]