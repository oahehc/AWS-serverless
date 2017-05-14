# AWS-serverless-example
this is a basic web application base on AWS serverless structure with below function.
- sign up with email confirmation
- sign in / sign out
- data create/query by user


---
## The AWS service has been used in this example 
- Cognito: 
- API gateway: 
- Lambda: 
- dynamoDB: 
- S3: 


---
## DIR structure
```
├── app/
│   ├── index.html           # entrance page
│   ├── aws-sdk.min.js       # AWS SDK for cognito
│   ├── main.js              # main function design 
│   └── style.css            # ui design
├── gulpfile.js              # for browser-sync
└── package.json             # dependencies
```


---
## How To Start
### <b>STEP 1 &nbsp;</b> create a basic structure for web application
this example only use basic css and vanilla js, but you can apply any framework you familiar with.
```
├── app/
│ ├── index.html # entrance page
│ ├── main.js # main function design
│ └── style.css # ui design
```

### <b>STEP 2 &nbsp;</b> include AWS SDK
we can build SDK file by [AWS SDK builder](https://sdk.amazonaws.com/builder/js/) base on the service we need.<br>
And we only need Cognito for this example because other service will be called by using API gateway.
1. create SDK file and add to app folder
2. include sdk in index.html
```
<script src=”./aws-sdk.min.js”></script>
```

### <b>STEP 3 &nbsp;</b> create Cognito user pool
1. follow [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/getting-started-with-cognito-user-pools.html?shortFooter=true) to create cognito user pool.<br>
In this example. we use two attribute - email and userId(custom attribute)
2. after create user pool, add below data to main.js
```
const sys = {
    awsRegion: 'us-east-1',
    UserPoolId: 'us-east-1_2YxxxxxO',
    ClientId: '20544xxxxxxxxxxxxxxxxxxdlb',
};
```

### <b>STEP 4 &nbsp;</b> create SignUp function in main.js
1. add cognito sign up function base on [AWS SDK](https://github.com/aws/amazon-cognito-identity-js/)
2. bind sign up function to button click event
```

```

### <b>STEP 5 &nbsp;</b> follow STEP 4, create EmailConfirmation fucntion in main.js
```
```

### <b>STEP 6 &nbsp;</b> Use Cognito triggers to initial user data
1. Pre sign-up: for generate an unique userId for each user
2. Post confirmation: for initail new user when account pass email confirmation.<br>
In this example, we will create one data in DynamoDB and a sub-folder in S3 for each new user.
* After finish STEP 1~6, we should able to test register and email confirmation now. you will notice that AWS cognito already help us to deal many senario like sign up with duplicate email.

### <b>STEP 7 &nbsp;</b> create Cognito federated identities
1. follow [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/getting-started-with-identity-pools.html?shortFooter=true) to create cognito federated identities.<br>
* ??? set Authenticated role in federated identities, to assign DynamoDB, 
* add user pool information at Authentication providers

### <b>STEP 8 &nbsp;</b> follow STEP 4, create SignIn function in main.js
* when we test sign in function, cognito will create token and save to cookies automatically.

### <b>STEP 9 &nbsp;</b> create API gateway for query DynamoDB data
* we can set Authorization by user pool in API gateway, 

### <b>STEP 10 &nbsp;</b> 
### <b>STEP 11 &nbsp;</b> 
### <b>STEP 12 &nbsp;</b> 
### <b>STEP 13 &nbsp;</b> 
* for more function like re-send confirmation code, forget password, refresh token ect., please check [HERE](https://github.com/aws/amazon-cognito-identity-js/)

### Remark
1. this example focus on AWS serverless structure, only with minimize design and didn't apply any font-end framework.
2. use ES6 and without apply babel, so must test at the browser supply ES6 (suggest: Chrome)