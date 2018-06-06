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
  certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRFNE1EWXdOakV5TVRVek5Gb1hEVEk0TURZd016RXlNVFV6TkZvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTGNtCmsxMjU4NUdtbllYRUl4SzJKb09qVE9COWR4YW8yTVNIYlZHV0lYdDJ3UitDdzNYZ0JncS9hOFFWWmZnQ3ZWWWMKYlcySFBUbjlXZ3E5ZVBCME5QMUdONHpPRm9RM2FzRVZhSGRrOUltczd3Tm5leDVjVnAxNDFRWmp3Y045YkpIbApBSTB5MnlOQTcveTMxU05LdlJGSk91VWhPYXJtOVhTL3ZjUXVDdFZMZDJHMHdtWktMRm1lZnVaTDd5M0l2Z21UCjBRbHRMcDh5MUd5TkFzeDJDK1VyMHkvZ2QvZHpIR0d3ZTQwTzR4K3drampWUzU0QWlNNTZZc0Y3aWFLTEYvNHYKSnV0TmVsaHdhbzVraS84WE5NV2x3SDRvd0RlL1l6UWNrc2NJTlZhV3d6YTVkLy8vMTZoczF5c2VUZW9uMjJGRQpMNkx3ZFFwZlNKS2xNd2NiRWtrQ0F3RUFBYU1qTUNFd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCCi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFKSTMyZlJZUWZQbHlkMVZOSHUrckJJOWtxcEwKQ3h2elI4R1RxWG13b3dxZlQyZlJ2TjhWVW9nUE5DRm9NNUhsRkxabmF5aFpPbUZUbWJZTW9acFZuNjBtVThDTQpmSzE4L0FVS1RyelpzRTlxTVp5V1NCUnQvZXUrQmdhWEdwMXRnbWlCT0lUODNNOEZxSHFwU0VQdlBpU1p4bCs3CmgreGN6V1FXbjZyd0JKRW5YTTFsUFBCcHlwL2tWQ2lKK1V2eEx6VmdRMS9LZkpKTXgrVDE0ZU9QLzY3SGZaSTQKSzFIbGJta0QyUnFHY0IvRk5PNldaYlhUbFN2WXZudUJhalVNUEF6SzhyeVJ2a3pKRWJvSVZibHhtSldjN3hoYwo0bFVtRG9Wb3BVRUs3THBxYU1aZmo2cmJDQUZEeTBOSEVJQko3ZUE2ZE5XeklTYkRwV0pWOW1IbzdtZz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
  server: https://B5349E9FB8203A66758257DBF51351E5.yl4.us-east-1.eks.amazonaws.com
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
 token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY
 2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN
 5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJla3MtYWRta
 W4tdG9rZW4taHFtanMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3V
 udC5uYW1lIjoiZWtzLWFkbWluIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlL
 WFjY291bnQudWlkIjoiMzRlMmQ2NTEtNjliOS0xMWU4LWExODAtMTIxMmQyZGYwNjY2Iiwic3ViIjo
 ic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmVrcy1hZG1pbiJ9.FMuG4NqRua3PU8IQ
 heUh5xSRm63cTEEuQcbpOtApWRiEdp1g2W4iMaPglsQsuShOQB1H5ue_0YkZq6wxVLxtE4LEAv8hiE
 HSyBEf7YHxOu2jDBBpWaFKy1ULS-h5Q4hyCL8HnpZATqu0CfC4sS3MpbsvfrN-_c7SBU8PoyMtAQOP
 i8Z7yKXqAXoEvjYn8cIt-MRkuIJxfLjNyNfBVU4zZCibowI9f8McSdjBTdAouV444LQyGAvQtJdsOj
 qr_AtdYCHurcMTBLjC9TTaWQruD5cdlocCoPsnm66mwZLMSMNQwd0Fe7hcK21dFI25nQFRhtV5McI4
 hTAQKETxXtrsLA
```

Executar o comando de proxy do kubectl. 

```
$ kubectl proxy
Starting to serve on 127.0.0.1:8001
```

Acessar o [Dashboard](http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/) e inserir o token de acesso.
   
Clicar em SIGN IN
 