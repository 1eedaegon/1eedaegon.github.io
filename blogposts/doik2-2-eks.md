---
title: "DOIK-2 1. EKS 주요 개념 및 배포"
date: "2023-10-19"
---

> Doik-2 스터디의 내용을 요약합니다.

Database operator에 대한 Study 이전에 EKS를 배포하고 주요 개념을 설명합니다.

[Amazon EKS 윈클릭 배포 가이드 (’23.6.6 업데이트)](https://gasidaseo.notion.site/Amazon-EKS-23-6-6-16ed4098c3314802a1e4dbf12a9d1da8)를 참고하여 작성했습니다.

# 배포

Cloudformation으로 진행합니다.(Terraform으로 구성하고 싶었으나 시간상 생략)

# EKS

EKS는 Elastic Kuberneetes Service의 줄임말입니다.

AWS에서 제공하는 관리형 서비스이며, Dataplane(worker) 노드 레벨에서 Kubernetes 작업을 수행할 수 있습니다.

## 장점

On-premise에서 k8s Controlplane의 관리가 까다로운 편인데 이부분을 AWS가 담당해줍니다.

- Managed and scalable controlplane & etcd

## 단점

관리형이기 때문에 안타깝게도 etcd에 문제가 생기면 직접 접속할 수 없습니다.

- etcd compaction size, memory 사이즈 튜닝 불가

# EKS 사전 준비

EKS를 배포하기 위해서 먼저 도메인과 액세스 키를 발급합니다.

- [DOIK-2 0. AWS 계정 및 CLI키 발급](doik2-0-aws-console) 참고
- [Route53 도메인 발급](doik-2-1-route53) 참고

# 구성 내용

멀티 Availability zone EKS cluster 구성

Service

- VPC(1)
- Public subnet(3)
- Private subnet(3)
- EKS Cluster(1)
- Node group(1) Multi AZ
  - Node(3)

![Alt text](public/image/image-30.png)

EKS Addons

- aws vpc cni
- coredns
- kube-proxy

![Alt text](public/image/image-31.png)

# 스크립팅

Cloudformation 스크립트를 다운받습니다.

```bash
#!/bin/bash
# get-eks-onclick.sh
curl -O https://s3.ap-northeast-2.amazonaws.com/cloudformation.cloudneta.net/K8S/eks-oneclick-new.yaml

```

아래처럼 스크립트를 작성해줍니다.

```bash

#!/bin/bash
# deploy-eks.sh

# CloudFormation 스택 배포
aws cloudformation deploy --template-file eks-oneclick.yaml --stack-name myeks --parameter-overrides KeyName=<My SSH Keyname> SgIngressSshCidr=<My Home Public IP Address>/32 MyIamUserAccessKeyID=<IAM User의 액세스키> MyIamUserSecretAccessKey=<IAM User의 시크릿 키> ClusterBaseName='<eks 이름>' --region ap-northeast-2

aws cloudformation describe-stacks --stack-name myeks --query 'Stacks[*].Outputs[0].OutputValue' --output text --region ap-northeast-2
```

배포합니다. 약 20분정도 소요됩니다.

배스쳔 접속 후 접속 잘되는 지 확인합니다.

```bash
#!/bin/bash
# bastion-conn.sh

ssh -i ./GRAM-DOIK-KEY.pem ec2-user@$(aws cloudformation describe-stacks --stack-name myeks --query 'Stacks[*].Outputs[0].OutputValue' --output text)
```

addon까지 포함해서 배포 잘되었나 확인합니다.

- kubeproxy
- coredns
  ![Alt text](public/image/image-33.png)

실습완료 후 삭제합니다.

```bash
eksctl delete cluster --name $CLUSTER_NAME && aws cloudformation delete-stack --stack-name $CLUSTER_NAME
```
