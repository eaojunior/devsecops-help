# Vault
O Vault protege, armazena e controla rigidamente o acesso a tokens, senhas, certificados, chaves de API e outros segredos da computação moderna.

### Instalando o Vault

```
# curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
# sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
# sudo apt-get update && sudo apt-get install vault
```

### Inicializando server em mode -dev [Ambiente local e não produtivo]

```
# vault server -dev

WARNING! dev mode is enabled! In this mode, Vault runs entirely in-memory
and starts unsealed with a single unseal key. The root token is already
authenticated to the CLI, so you can immediately begin using Vault.

You may need to set the following environment variable:

    $ export VAULT_ADDR='http://127.0.0.1:8200'

The unseal key and root token are displayed below in case you want to
seal/unseal the Vault or re-authenticate.

Unseal Key: xxxxxxxxxxxxxxxx
Root Token: xxxxxxxxxxxxxxxx

Development mode should NOT be used in production installations!
```

- Lembre-se de salvar o Root Token em algum lugar onde você não esqueça, essa Token é usada para autenticação no Vault Server

### Inicializando o Vault localmente

```
# export VAULT_ADDR='http://127.0.0.1:8200'
# export VAULT_TOKEN="xxxxxxxxxxxxxxxx"
# vault status
Key             Value
---             -----
Seal Type       shamir
Initialized     true
Sealed          false
Total Shares    1
Threshold       1
Version         1.7.0
Storage Type    inmem
Cluster Name    vault-cluster-ceceafcf
Cluster ID      xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HA Enabled      false
```

### Comandos do Vault

#### Criando sua primeira Secret

vault kv put [path] [key]=[value]

```
# vault kv put secret/hello foo=world

Key              Value
---              -----
created_time     2020-09-02T21:40:01.635656Z
deletion_time    n/a
destroyed        false
version          1

# vault kv put secret/hello foo=world excited=yes

Key              Value
---              -----
created_time     2020-09-02T21:41:17.568155Z
deletion_time    n/a
destroyed        false
version          2
```

#### Recuperando sua Secret

vault kv get [opt] [path]

```
# vault kv get secret/hello

====== Metadata ======
Key              Value
---              -----
created_time     2020-09-02T21:41:17.568155Z
deletion_time    n/a
destroyed        false
version          2

===== Data =====
Key        Value
---        -----
excited    yes
foo        world

# vault kv get -field=excited secret/hello

yes

# vault kv get -format=json secret/hello | jq -r .data.data.excited

yes
```

#### Excluindo sua Secret

vault kv delete [path]

```
# vault kv delete secret/hello

Success! Data deleted (if it existed) at: secret/hello
```

#### Secret Engine

O Vault se comporta de forma semelhante a um sistema de arquivos virtual . As operações de leitura/gravação/exclusão/lista são encaminhadas para o Secret Engine correspondente, e o Secret Engine decide como reagir a essas operações.

Essa abstração é incrivelmente poderosa. Ele permite que o Vault faça interface diretamente com sistemas físicos, bancos de dados, HSMs, etc. Mas, além desses sistemas físicos, o Vault pode interagir com ambientes mais exclusivos, como AWS IAM, criação de usuário SQL dinâmico, etc., tudo usando a mesma interface de leitura/gravação.

#### Habilitando um Secret Engine

O Secret Engine lê e grava dados brutos no backend de armazenamento. 

- Quando o servidor do Vault é iniciado em modo -dev, por padrão o Secret Engine ativa no caminho /secret um mecanismo de segredo do tipo kv-v2, por esse motivo conseguimos escrever, ler e excluir segredos no path /secret

```
# vault secrets enable -path=test kv
# vault secrets enable kv
```

#### Listando Secret Engines

```
# vault secrets list

Path          Type         Accessor              Description
----          ----         --------              -----------
cubbyhole/    cubbyhole    cubbyhole_ac789d93    per-token private secret storage
identity/     identity     identity_eda8fc07     identity store
kv/           kv           kv_57023ccf           n/a
secret/       kv           kv_feca70b5           key/value secret storage
sys/          system       system_319dc430       system endpoints used for control, policy and debugging
test/         kv           kv_d5aabde0           n/a
```

#### Desabilitando um Secret Engine

```
# vault secrets disable kv

Success! Disabled the secrets engine (if it existed) at: kv/
```

#### Secret Engine AWS

```
# vault secrets enable aws
# export AWS_ACCESS_KEY_ID=[aws_access_key_id]
# export AWS_SECRET_ACCESS_KEY=[aws_secret_key]
# vault write aws/config/root \
    access_key=$AWS_ACCESS_KEY_ID \
    secret_key=$AWS_SECRET_ACCESS_KEY \
    region=us-east-1

Success! Data written to: aws/config/root
```

### Políticas

As políticas no Vault controlam o que um usuário pode acessar.
Para autenticação, o Vault tem várias opções ou métodos que podem ser ativados e usados. O Vault sempre usa o mesmo formato para autorização e políticas. Todos os métodos de autenticação mapeiam as identidades de volta para as políticas principais que são configuradas com o Vault.

#### Formato da Política

As políticas são criadas em HCL , mas são compatíveis com JSON. Aqui está um exemplo de política:

```
# Dev servers have version 2 of KV secrets engine mounted by default, so will
# need these paths to grant permissions:
path "secret/data/*" {
  capabilities = ["create", "update"]
}

path "secret/data/foo" {
  capabilities = ["read"]
}
```

Com esta política, um usuário pode gravar qualquer segredo secret/data/, exceto para secret/data/foo, onde apenas o acesso de leitura é permitido. O padrão das políticas é negar, portanto, qualquer acesso a um caminho não especificado não é permitido.

#### Políticas Padrão

Existem algumas políticas internas que não podem ser removidas. Por exemplo, as políticas root e defaultsão necessárias e não podem ser excluídas. A defaultpolítica fornece um conjunto comum de permissões e está incluída em todos os tokens por padrão. A rootpolítica dá a um token de permissões de superadministrador, semelhante a um usuário root em uma máquina Linux.

```
# vault policy read default
```

#### Escrevendo uma política

```
# vault policy write -h

Usage: vault policy write [options] NAME PATH

  Uploads a policy with name NAME from the contents of a local file PATH or
  stdin. If PATH is "-", the policy is read from stdin. Otherwise, it is
  loaded from the file at the given path on the local disk.

  Upload a policy named "my-policy" from "/tmp/policy.hcl" on the local disk:

      $ vault policy write my-policy /tmp/policy.hcl

  Upload a policy from stdin:

      $ cat my-policy.hcl | vault policy write my-policy -

   ...snip...

# vault policy write my-policy - << EOF
# Dev servers have version 2 of KV secrets engine mounted by default, so will
# need these paths to grant permissions:
path "secret/data/*" {
  capabilities = ["create", "update"]
}

path "secret/data/foo" {
  capabilities = ["read"]
}
EOF

Success! Uploaded policy: my-policy

# vault policy list

# vault policy read my-policy
```

