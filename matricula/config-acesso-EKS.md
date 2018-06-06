# Configuração Acesso EKS Workshop

### 1. Instalação AWS Command Line Interface 

```bash
$ pip install awscli
```

Se já possuir o **AWS Command Line Interface**, atualizar para a última versão. 

```bash
$ pip install awscli --upgrade
```

### 2. Instalação kubectl

```bash
$ curl -o kubectl https://amazon-eks.s3-us-west-2.amazonaws.com/1.10.3/2018-06-05/bin/darwin/amd64/kubectl
$ chmod +x ./kubectl
$ sudo mv kubectl /usr/local/bin
```

### 3. Instalação **heptio-authenticator-aws**

```bash
$ curl -o heptio-authenticator-aws https://amazon-eks.s3-us-west-2.amazonaws.com/1.10.3/2018-06-05/bin/darwin/amd64/heptio-authenticator-aws
$ chmod +x ./heptio-authenticator-aws
$ sudo mv heptio-authenticator-aws /usr/local/bin
```

### 4. Configuração AWS Command Line Interface

Criar/atualizar os arquivos credentials e config no diretório ~/.aws/ , utilizando as credenciais corretas.
credentials

```
[default]
aws_access_key_id = <key>
aws_secret_access_key = <access_key>
```

config

```
[default]
region = us-east-1
output = json
```

### 5. Configuração kubectl

Criar o arquivo ~/.kube/config , ou complementar o arquivo já existente com as informações abaixo.

```yaml
apiVersion: v1
clusters:
- cluster: 
  certificate-authority-data: <cert>
  server: https://<hash>.yl4.us-east-1.eks.amazonaws.com
  name: workshop
contexts:
- context:
  cluster: workshop
  user: aws-eks-workshop
name: aws-eks-workshop
users:
- name: aws-eks-workshop
user:
  exec:
    apiVersion: client.authentication.k8s.io/v1alpha1
    args:
    - token
    - -i
    - workshop
    command: heptio-authenticator-aws
    env: null
```

## 6. Acesso ao dashboard 

Alterar para o novo contexto.

```
$ kubectl config use-context aws-eks-workshop
Switched to context "aws-eks-workshop".
```

Buscar o **token** de acesso

```
$ kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep eks-admin | awk '{print $1}')
Name:         eks-admin-token-hqmjs
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name=eks-admin
             kubernetes.io/service-account.uid=34e2d651-69b9-11e8-a180-1212d2df
0666

 Type:  kubernetes.io/service-account-token
 Data
 ====
 ca.crt:     1025 bytes
 namespace:  11 bytes
 token:      <token>
```

Executar o comando de proxy do kubectl. 

```
$ kubectl proxy
Starting to serve on 127.0.0.1:8001
```

Acessar o [Dashboard](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/) e inserir o token de acesso.
   
Clicar em SIGN IN
 