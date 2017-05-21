# AWS-serverless-example
In this example, we build a basic web application base on AWS serverless structure.
This application will include below function.
- sign up + email confirmation
- sign in / sign out
- data create/query after user sign in

---
## AWS service has been used in this example 
- Cognito: user DB / auth control
- Lambda: function for update dynamoDB data
- API gateway: create api for active lambda function 
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
In this example, we only use basic css and vanilla js, but you can apply any framework you like.
``` bash
├── app/
│ ├── index.html   # entrance
│ ├── main.js      # main function
│ └── style.css    # style
```
----
### <b>STEP 2 &nbsp;</b> include AWS SDK
1. Download AWS SDK files 
    - [aws-cognito-sdk.min.js](https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/aws-cognito-sdk.min.js)
    - [amazon-cognito-identity.min.js](https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/amazon-cognito-identity.min.js)
2. Include SDK in index.html
```    
<script src="/path/to/aws-cognito-sdk.min.js"></script>
<script src="/path/to/amazon-cognito-identity.min.js"></script>
```
3. Build SDK file by [AWS SDK builder](https://sdk.amazonaws.com/builder/js/) if you need other AWS service.<br>
*Because we will apply API gateway to access database. And API gateway can auth by Cognito. So we don't need addition SDK in this example.


----
### <b>STEP 3 &nbsp;</b> create Cognito user pool
1. Follow [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/create-new-user-pool-console-quickstart.html?shortFooter=true) to create cognito userpool. 
    - (Name) naming userpool then click 'Step through settings'
    - (Attributes) we use two attributes in this example - email and userId(custom attribute)
    - (Verification) select email
    - (App clients) create an client app<br>
    *we clear Generate client secret because AWS JavaScript SDK does not support the app client secret, you can apply it when build mobile application.<br>
    *make sure you have set read and write permission for custom attribute
    ![attribute](http://i.imgur.com/FNcj1o1.png)
    - preview all setting and create userpool
    ![userpool preview](http://i.imgur.com/esqAj9R.png)
2. After create userpool, add below data to main.js for create userPool object
```
const poolData = {
    UserPoolId: 'us-east-1_D4Qga3XmA',
    ClientId: '4lijvvq6lfm7i3hq8b883j714q',
};
const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
```

----
### <b>STEP 4 &nbsp;</b> create SignUp function in main.js
1. Add cognito sign up function<br>Reference [AWS SDK](https://github.com/aws/amazon-cognito-identity-js/)
```
function signUp(email, password) {
    // add attriubute base on our setting when we create user pool at AWS console
    const attributeList = [];
    const dataEmail = {
        Name: 'email',
        Value: email,
    };
    const attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    const dataUserId = {
        Name: 'custom:userId', // add custom prefix for custom attribute
        Value: generateUUID(), // generate an unique id for each user
    };
    const attributeUserId = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataUserId);
    attributeList.push(attributeUserId);

    // sign up to user pool
    return new Promise((resolve, reject) => {
        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    })
}
```
2. Bind sign up function to button<br>
*Because confirmBtn isn't display at begin, so we add event listerner to parent div, and use switch to decide which function should be excuted
```
const signUpBtn = document.querySelector('#signUp');
const signInBtn = document.querySelector('#signIn');
const confirmBtn = document.querySelector('#confirm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const validateInput = document.querySelector('#validate');
const erroMsg = document.querySelector('#message');
const btnGroup = document.querySelector('.btnGroup');
btnGroup.addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'signUp':
            console.log('click signUpBtn');
            if (emailInput.value && passwordInput.value) {
                signUp(emailInput.value, passwordInput.value).then((result) => {
                    // show validation input & button if sign up success
                    confirmBtn.style.display = 'block';
                    validateInput.style.display = 'block';
                    validateInput.focus();
                    signUpBtn.style.display = 'none';
                    signInBtn.style.display = 'none';
                    erroMsg.innerHTML = 'Validation code has been send to your mailbox, please fill the code to finish the sign up process';
                }).catch((err) => {
                    // show error msg if sign up fail
                    erroMsg.innerHTML = err;
                })
            } else {
                erroMsg.innerHTML = 'email & password can\'t been empty';
            }
            break
    }
})
```
*When you test signUp function, you will notice Cognito already deal with many scenario for us - like duplicate email or password constraint etc.
![error](http://i.imgur.com/x6aXFYM.png)

*We can check user list at AWS console.
![userList](http://i.imgur.com/rpttUZy.png)


----
### <b>STEP 5 &nbsp;</b> create EmailConfirmation fucntion in main.js
1. create confrim function 
```
function confirm(email, code) {
    const userData = {
        Username: email,
        Pool: userPool,
    };
    return new Promise((resolve, reject) => {
        const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    })
}
```
2. add confirm case in click event
```
case 'confirm':
    console.log('click confirmBtn');
    if (emailInput.value && validateInput.value) {
        confirm(emailInput.value, validateInput.value).then((result) => {
            // clear input for user to sign in
            validateInput.style.display = 'none';
            confirmBtn.style.display = 'none';
            signInBtn.style.display = 'block';
            emailInput.value = '';
            passwordInput.value = '';
            emailInput.focus();
            erroMsg.innerHTML = 'Your account has been created, please use your email and password to sign in';
        }).catch((err) => {
            erroMsg.innerHTML = err;
        })
    } else {
        erroMsg.innerHTML = 'email & validation code can\'t been empty';
    }
    break
```

----
### <b>STEP 6 &nbsp;</b> Use Cognito triggers to initial user data in DynamoDB
We use 'Post confirmation' trigger Lambda function to create user data in DynamoDB when account pass email confirmation.
1. create dynamoDB table by using AWS console
    - primary key: userId
    - sort key: email
    *you can click tutorial btn in AWS console to check how to create the table
![dynamoDB](http://i.imgur.com/0s6ITkj.png)
2. create lambda function by using AWS console
    - Blueprint: Blank function
    - Configure triggers: leave empty (we will set trigger at cognito later)
    - Configure function
    ![lambda](http://i.imgur.com/e8ylA62.png)
    - paste the code below to 'Lambda function code'
        ```
        "use strict";
        const AWS = require('aws-sdk');
        const TableName = 'aws-serverless'; // dynamodb table name
        const region = 'us-east-1'; // dynamodb region : http://docs.aws.amazon.com/zh_cn/sns/latest/dg/sms_supported-countries.html
        exports.handler = function (event, context, callback) {
            console.log(event.request);
            if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') { // limit this function only exercute by cognito Post confirmation trigger
                const dynamoConfig = {
                    sessionToken: process.env.AWS_SESSION_TOKEN,
                    region,
                };
                const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
                let params = {
                    TableName,
                    Item: {
                        userId: event.request.userAttributes['userId'], // get userId and email from event which trigger by cognito
                        email: event.request.userAttributes['email'],
                        createTimeStamp: new Date().getTime(),
                        message: [],
                    },
                };
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.log('update table error', err); // console.log in lambda function will log to cloud watch for tracking and debugging
                        return callback(err, null);
                    } else {
                        callback(null, event);
                    }
                });
            } else {
                return callback("Invalid trigger source.", null);
            }
        };
        ```
    - add role for lambda function (lambda execute + access dynamoDB)
    ![role for lambda](http://i.imgur.com/AW0p25N.png)

    *we can create a role in IAM console, for easy to demo, we apply full access for dynamoDB here.<br> 
    It will be better to generate policy base on the function we need in our application. [policy generator](https://awspolicygen.s3.amazonaws.com/policygen.html)
    ![iam](http://i.imgur.com/7x7gHQb.png)

3. add lambda function to cognito triggers
    - choose triggers in cognito userpoll console
    - select to lambda function we just created in Post confirmation
    ![iam](http://i.imgur.com/2wnHT3A.png)
*If lambda function doesn't execute as our expection, we can check the logs in cloudwatch
![cloudwatch](http://i.imgur.com/cojhCDM.png)
*If every work correctly, we will see a new data been created after a user finish sign up process.
![dynamodb addItem](http://i.imgur.com/JwFstoB.png)

----
### <b>STEP 7 &nbsp;</b> create Cognito federated identities
*we can use cognito federated identities to control the responsibility for sign in user
1. create cognito federated identities. [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/getting-started-with-identity-pools.html?shortFooter=true)
    - click Manage Federated Identities in Cognito console
    ![federatedId](http://i.imgur.com/XfCyMOq.png)
    - create new identity pool
    - add userPool as authentication providers
    ![federatedId create](http://i.imgur.com/cXN6DQV.png)
2. add IdentityPoolId to main.js
    - Federated identities > Dashboard > Edit identity pool
    - clone identity pool id in edit panel
    ![federatedId edit](http://i.imgur.com/4aW32ya.png)
    - add to main.js
    ```
    const IdentityPoolId = 'us-east-1:e1ee252a-bfdd-484f-bc35-eac21e8aac8f';
    ```

----
### <b>STEP 8 &nbsp;</b> create SignIn function in main.js
1. create signIn function
```
function signIn(email, password) {
    var authenticationData = {
        Username: email,
        Password: password,
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var userData = {
        Username: email,
        Pool: userPool,
    };
    return new Promise((resolve, reject) => {
        const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess(result) {
                console.log('signIn success', result);
                resolve(result);
            },
            onFailure(err) {
                console.log('signIn error', err);
                reject(err);
            },
        });
    })
}
```
2. add signIn case in click event 
```
```
*token will automatically be added to localStorage after sign in. [Reference: Cognito Token](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)
![localStorage](http://i.imgur.com/iYqVH1l.png?1)

----
### <b>STEP 9 &nbsp;</b> create API gateway for query DynamoDB data
* set API Authorization by user pool. 

----
### <b>STEP 10 &nbsp;</b> sign out
----
### <b>STEP 11 &nbsp;</b> forget password
----
### <b>STEP 12 &nbsp;</b> resend confirmation code
----
### <b>STEP 13 &nbsp;</b> 
* for more function like re-send confirmation code, forget password, refresh token ect., please check [HERE](https://github.com/aws/amazon-cognito-identity-js/)

### Remark
We use ES6 and without apply babel, so it must been test at browser which supply ES6.


### TBC
* Authenticated role in federated identities -> no need when using api gateway ???
* signIn : just save token to localStorage / update AWS.config.credentials / AWS.config.credentials.refresh?
