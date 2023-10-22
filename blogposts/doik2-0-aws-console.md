---
title: "DOIK-2 0. AWS 계정 및 CLI키 발급"
date: "2023-10-15"
---

> Doik-2 스터디의 내용을 요약합니다.

kubernetes database operator의 스터디 내용을 공유하기 위해 블로그, EKS 배포를 위해 aws console 계정을 생성합니다.

### 회원가입

![Alt text](public/image/image-7.png)

스터디와 블로그를 위해 개인 계정을 발급합니다.
조직에서 발급한 계정이 아니기 때문에 루트 사용자입니다.

(2023-10-15) 저는 새로 발급하면서 이 포스팅을 작성하고있습니다.

입력하면 이메일이 전송됩니다.

![Alt text](public/image/image-8.png)

![Alt text](public/image/image-9.png)

확인 코드 입력하면 비밀번호를 입력해줍니다.

![Alt text](public/image/image-10.png)

별도의 법인계정(기술 서포트를 받고싶다.)이 아니라면 개인용도로 지정합니다.

제가 사는 지역이 나오는군요 ㅎㅎ
![Alt text](public/image/image-11.png)

카드를 입력합니다.

AWS의 계정 정책은 카드는 곧 계정이다, 1계정 - 1카드입니다.

카드 하나에 계정 여러개는 가능하지만 계정하나에 카드 여러개는 안됩니다.

![Alt text](public/image/image-12.png)

국내 카드는 아래와 같은 kcp 인증페이지가 추가로 뜹니다.
![Alt text](public/image/image-13.png)

개인 인증 진행합니다.
법인이면 별도의 법인 전화가 편합니다.
인증정보 입력합니다.
![Alt text](public/image/image-14.png)

![Alt text](public/image/image-15.png)

위에서 이야기했던 지원 플랜입니다.
규모가 어느정도 성장할 가능성있는 서비스면 비즈니스 지원이 좋습니다.

여기선 개인으로 선택합니다.
![Alt text](public/image/image-16.png)

완료합니다.
![Alt text](public/image/image-17.png)

로그인 해줍니다.
![Alt text](public/image/image-18.png)

### IAM에서 유저 생성, 키 발급

궁극적으로 aws cli에서 console을 접근하기 위해 계정 생성과 키발급이 필요합니다.

[AWS IAM](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-east-1#/home)으로 접속합니다.

`사용자` -> `사용자 생성` 으로 이동합니다.
![Alt text](public/image/image-19.png)

새로운 사용자를 생성합니다.
![Alt text](public/image/image-20.png)

권한에서 `직접 정책 연결`을 선택합니다.

아래에서 `AdministratorAccess`를 발급합니다.

![Alt text](public/image/image-21.png)

**이 권한은 스터디 목적으로만 사용하셔야합니다.**

**aws 리소스의 전체를 다룰 수 있는 권한이기 때문에 위험합니다.**

실제 서비스라면 필요한 권한만 주셔야 합니다.

권한 모델링에 대해서 추후에 포스팅하겠습니다.

사용자 생성합니다.
![Alt text](public/image/image-22.png)

생성된 유저 이름 클릭 > `보안 자격 증명` 탭을 선택합니다.

![Alt text](public/image/image-23.png)

아래로 내려서 `액세스 키 만들기` 합니다.

![Alt text](public/image/image-24.png)

`Command Line Interface(CLI)` 선택후 다음, 만들어줍니다.
![Alt text](public/image/image-25.png)

아래와 같이 만들었으면 `액세스 키`와
`비밀 액세스 키`를 잘 기록해둡니다.

`표시`를 누르면 나타납니다.
![Alt text](public/image/image-26.png)

### AWS CLI 세팅

[AWS CLI 가이드](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html) 링크로 이동해서 가이드대로 설치해줍니다.

저는 WSL2 - ubuntu22.04를 사용하기 때문에 Linux 가이드를 따라했습니다.
![Alt text](public/image/image-27.png)

터미널 설정

설치 완료되었다면 아래와 같이 키와 리전을 입력합니다.

저는 스터디 목적도 같이 있기 때문에 한국(서울 - ap-northeast-2) 리전을 사용합니다.
![Alt text](public/image/image-28.png)

인증에러가 나오는지 테스트합니다.
![Alt text](public/image/image-29.png)
