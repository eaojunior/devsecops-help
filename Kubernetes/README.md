# Kubernetes

### Preparando o ambiente (Usando Ubutun 18.04)

```
# swapoff -a
# vim /etc/fstab
```

### Instalando do Docker

```
# sudo apt-get update
# sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
# sudo curl -fsSL https://get.docker.com/ | bash
```

### Ajustando configurações de firewall

```
# vim /etc/modules-load.d/k8s.conf
br_netfilter
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack_ipv4
ip_vs
```

### Instalando o kubelet, kubeadm e kubectl

```
# curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
# echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list
# apt-get update -y
# apt-get install -y kubelet kubeadm kubectl
# kubeadm config images pull
```

### Configurar o Node Master

```
# kubeadm init
# mkdir -p $HOME/.kube
# sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
# sudo chown $(id -u):$(id -g) $HOME/.kube/config
# kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

### Configuração do Auto complete K8s

```
# sudo apt-get install -y bash-completion
# sudo echo 'source <(kubectl completion bash)' >>~/.bashrc
# sudo kubectl completion bash >/etc/bash_completion.d/kubectl
```
