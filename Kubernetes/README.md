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

### Limitando Recursos

```
# vim limitando-recursos.yaml

apiVersion: v1
kind: LimitRange
metadata:
  name: limitando-recursos
spec:
  limits:
  - default:
      cpu: 1
      memory: 100Mi
    defaultRequest:
      cpu: 0.5
      memory: 80Mi
    type: Container
```

```
# kubectl create -f limitando-recursos.yaml -n primeiro-namespace
```

### Trabalhando com Taints
#### Define restrinções aos nós do cluster, também utilizado para por nó em estado de manutenção

```
# kubectl describe nodes | grep -i taints
# kubectl taint node k8s-slave-01 key1=value1:NoSchedule
# kubectl taint node k8s-slave-01 key1=value1:NoSchedule-
# kubectd taint node k8s-slave-03 key1=value1:NoExecute
# kubectd taint node k8s-slave-03 key1=value1:NoExecute-
```

### Trabalhando com Services
#### Recurso responsável por expor portas e acessos aos pods

##### ClusterID - Acesso apenas no cluster
```
# vim meu-primeiro-service-cluster-ip.yaml

apiVersion: v1
kind: Service
metadata:
  labels:
    app: eaojunior
  name: eaojunior
  namespace: default
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: eaojunior
  sessionAffinity: ClientIP
  type: ClusterIP
```

##### NodePort - Acesso externo através de roteamento de porta

```
# vim meu-primeiro-service-node-port.yaml

apiVersion: v1
kind: Service
metadata:
  labels:
    app: eaojunior
  name: eaojunior
  namespace: default
spec:
  externalTrafficPolicy: Cluster
  ports:
  - nodePort: 32222
    port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: eaojunior
  sessionAffinity: None
  type: NodePort
```

##### LoadBalancer - Acesso externo através de recurso de LB com ip externo

```
# vim meu-primeiro-service-load-balancer.yaml

apiVersion: v1
kind: Service
metadata:
  labels:
    app: eaojunior
  name: eaojunior
  namespace: default
spec:
  externalTrafficPolicy: Cluster
  ports:
  - nodePort: 32222
    port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: eaojunior
  sessionAffinity: None
  type: LoadBalancer
```

### Trabalhando com Deployments

```
# vim meu-primeiro-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: nginx
    app: giropops
  name: primeiro-deployment
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: nginx
  template:
    metadata:
      labels:
        run: nginx
        dc: UK
    spec:
      containers:
      - image: nginx
        imagePullPolicy: Always
        name: nginx2
        ports:
        - containerPort: 80
          protocol: TCP
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
```

### Trabalhando com ReplicaSet 
#### Não aconselhavel criar replicaset sem controller Deployment

```
# vim meu-primeito-replica-set.yaml

apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: replica-set-primeiro
spec:
  replicas: 3
  selector:
    matchLabels:
      run: nginx
  template:
    metadata:
      labels:
        run: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

### Trabalhando com DaemonSet
#### Semelhante ao ReplicaSet porém garante que irá ter ao menos um pod rodando em cada nó do cluster

```
# vim meu-primeiro-daemon-set.yaml

apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: meu-primeiro-daemon-set
spec:
  selector:
    matchLabels:
      system: Strigus
  template:
    metadata:
      labels:
        system: Strigus
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
  updateStrategy:
    type: RollingUpdate
```

### Trabalhando com EmptyVolume
#### É um tipo de volume não persistente, sempre que o pod é finalizado o mesmo é apagado

```
# vim pod-empty.yaml

apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox
    name: busy
    command:
    - sleep
    - "3600"
    volumeMounts:
    - mountPath: /giropops
      name: giropops-dir
  volumes:
  - name: giropops-dir
    emptyDir: {}
```

### Trabalhando com PersistentVolume

```
# vim primeiro-pv.yaml

apiVersion: v1
kind: PersistentVolume
metadata:
  name: primeiro-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /opt/dados
    server: k8s-master
    readOnly: false
```

### Trabalhando com PersistentVolumeClaim

```
# vim primeiro-pvc.yaml

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: primeiro-pvc
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 800Mi
```

### Atachando PVC no Deployment

```
# vim nfs-pv-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: nginx
  name: nginx
  namespace: default
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      run: nginx
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      labels:
        run: nginx
    spec:
      containers:
      - image: nginx
        imagePullPolicy: Always
        name: nginx
        volumeMounts:
        - name: nfs-pv
          mountPath: /giropops
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      volumes:
      - name: nfs-pv
        persistentVolumeClaim:
          claimName: primeiro-pvc
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
```

### Trabalhanco com CronJobs

```
# vim primeiro-cronjob.yaml

apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: girpops-cron
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec: 
      template:
        spec:
          containers:
          - name: giropos-cron
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo Bem Vindo ao Descomplicando Kubernetes - LinuxTips VAIIII ;sleep 40
          restartPolicy: OnFailure
```

### Trabalhando com Secrets

```
# echo -n "giropops strigus girus" > secret.txt
# kubectl create secret generic my-secret --from-file=secret.txt
# echo {token} | base64 --decode
```

```
# vim pod-secret.yaml

apiVersion: v1
kind: Pod
metadata:
  name: test-secret
  namespace: default
spec:
  containers:
  - image: busybox
    name: busy
    command:
    - sleep
    - "3600"
    volumeMounts:
    - mountPath: /tmp/giropops
      name: my-volume-secret
  volumes:
  - name: my-volume-secret
    secret:
      secretName: my-secret
```

```
# kubectl create secret generic my-literal-secret --from-literal user=linuxtips --from-literal password=catota
```

```
# vim pod-secret-env.yaml

apiVersion: v1
kind: Pod
metadata:
  name: test-secret-env
  namespace: default
spec:
  containers:
  - image: busybox
    name: busy
    command:
    - sleep
    - "3600"
    env:
    - name: MEU_USERNAME
      valueFrom:
        secretKeyRef:
          name: my-literal-secret
          key: user
    - name: MEU_PASSWORD
      valueFrom:
        secretKeyRef:
          name: my-literal-secret
          key: password
```

### Trabalhando com ConfigMaps

```
# mkdir fruits
# echo amarela > fruits/banana
# echo kiwi > predileta
# kubectl create configmap colors-fruits --from-literal uva=roxa --from-file=predileta --from-file=fruits/
```

```
# vim pod-configmap.yaml

apiVersion: v1
kind: Pod
metadata:
  name: test-configmap
  namespace: default
spec:
  containers:
  - image: busybox
    name: busy
    command:
    - sleep
    - "3600"
    env:
    - name: frutas
      valueFrom:
        configMapKeyRef:
          name: colors-fruits
          key: predileta
```

```
# vim pod-configmap-envfrom.yaml

apiVersion: v1
kind: Pod
metadata:
  name: test-configmap
  namespace: default
spec:
  containers:
  - image: busybox
    name: busy
    command:
    - sleep
    - "3600"
    envFrom:
    - configMapRef:
      name: colors-fruits
```

```
# vim pod-configmap-volume.yaml

apiVersion: v1
kind: Pod
metadata:
  name: test-configmap
  namespace: default
spec:
  containers:
  - image: busybox
    name: busy
    command:
    - sleep
    - "3600"
    volumeMounts:
    - name: meu-configmap-volume
      mountPath: /etc/fruits
  volumes:
  - name: meu-configmap-volume
    configMap:
      name: colors-fruits
```

### Trabalhando com InitContainer
#### É um container que será executado antes de iniciar o container principal, caso seja necessário executar tarefas para iniciar o container principal, como popular uma base de dados, rodar migrações e etc.

```
# vim nginx-initcontainer.yaml

apiVersion: v1
kind: Pod
metadata:
  name: init-demo
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - name: workdir
      mountPath: /usr/share/nginx/html
  initContainers:
  - name: install
    image: busybox
    command:
    - wget
    - "-O"
    - "/work-dir/index.html"
    - http://kubernetes.io
    volumeMounts:
    - name: workdir
      mountPath: /work-dir
  dnsPolicy: Default
  volumes:
  - name: workdir
    emptyDir: {}
```

### Trabalhando com Service Account

```
# vim admin-user.yaml

apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
```

### Trabalhando com Cluster Role Bind

```
# vim admin-cluster-role-bind.yaml

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kube-system
```

### Trabalhando com o Helm

#### Instalação

```
# curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
``` 

#### Exemplos

```
# helm install prometheus --namespace=monitoring --version=11.4.0 --set alertmanager.persistentVolume.enabled=false,server.persistentVolume.enabled=false stable/prometheus
#
# helm install grafana --namespace=monitoring --version=5.1.4 --set adminUser=admin,adminPassword=admin,service.type=NodePort stable/grafana
```