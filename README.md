# AWS-serverless-example
This is a basic web application apply AWS serverless structure including below function.
- sign up + email confirmation
- sign in / sign out
- data create/query after user sign in


---
## AWS service has been used in this example 
- Cognito: user DB / auth control
- API gateway: api for active lambda function 
- Lambda: function for update dynamoDB data
- DynamoDB: nosql DB
- S3: DB for front-end page

---
## Scripts
``` bash
gulp serve     # start server by browser-sync 
```

---
## DIR structure
``` bash
├── app/
│   ├── index.html           # entrance
│   ├── aws-sdk.min.js       # AWS SDK for cognito
│   ├── main.js              # main function 
│   └── style.css            # style
├── gulpfile.js              # browser-sync
└── package.json             # dependencies
```


---
# How To Start
### <b>STEP 1 &nbsp;</b> create basic structure for web application
This example only use basic css and vanilla js, but you can apply any framework you familiar with.
``` bash
├── app/
│ ├── index.html   # entrance
│ ├── main.js      # main function
│ └── style.css    # style
```

### <b>STEP 2 &nbsp;</b> include AWS SDK
1. Build SDK file by [AWS SDK builder](https://sdk.amazonaws.com/builder/js/) base on the service we need.
And we only need Cognito for this example because we will apply API gateway to CRUD database.
2. Add SDK file to app folder
3. Include SDK in index.html
```
<script src=”./aws-sdk.min.js”></script>
```

### <b>STEP 3 &nbsp;</b> create Cognito user pool
1. Follow [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/create-new-user-pool-console-quickstart.html?shortFooter=true) to create cognito userpool. 
    - (Name) naming userpool then click 'Step through settings'
    - (Attributes) we use two attributes in this example - email and userId(custom attribute)
    - (Verification) select email
    - (App clients) create an client app, and we don't use client secret in this example
![Imgur](http://i.imgur.com/esqAj9R.png)
2. After we created userpool, add below data to main.js
```
const sys = {
    awsRegion: 'us-east-1',
    UserPoolId: 'us-east-1_D4Qga3XmA',
    ClientId: '4lijvvq6lfm7i3hq8b883j714q',
};
```
=============

### <b>STEP 4 &nbsp;</b> create SignUp function in main.js
1. Add cognito sign up function base on [AWS SDK](https://github.com/aws/amazon-cognito-identity-js/)
2. Bind sign up function to button click event
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
* ??? set Authenticated role in federated identities, to assign DynamoDB, -> no need when using api gateway ???
2. [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html), add user pool information at Authentication providers

### <b>STEP 8 &nbsp;</b> follow STEP 4, create SignIn function in main.js
* when we test sign in function, cognito will create token and save to cookies automatically. [Reference: Cognito Token](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)

### <b>STEP 9 &nbsp;</b> create API gateway for query DynamoDB data
* set API Authorization by user pool. 

### <b>STEP 10 &nbsp;</b> 
### <b>STEP 11 &nbsp;</b> 
### <b>STEP 12 &nbsp;</b> 
### <b>STEP 13 &nbsp;</b> 
* for more function like re-send confirmation code, forget password, refresh token ect., please check [HERE](https://github.com/aws/amazon-cognito-identity-js/)

### Remark
1. this example focus on AWS serverless structure, only with minimize design and didn't apply any font-end framework.
2. use ES6 and without apply babel, so must test at the browser supply ES6 (suggest: Chrome)