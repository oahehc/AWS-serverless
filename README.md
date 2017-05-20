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
2. add confirm case
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
1. create lambda funciton
2. add to Cognito trigger

















----
### <b>STEP 7 &nbsp;</b> create Cognito federated identities
1. follow [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/getting-started-with-identity-pools.html?shortFooter=true) to create cognito federated identities.<br>
* ??? set Authenticated role in federated identities, to assign DynamoDB, -> no need when using api gateway ???
2. [AWS document](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html), add user pool information at Authentication providers

----
### <b>STEP 8 &nbsp;</b> follow STEP 4, create SignIn function in main.js
* when we test sign in function, cognito will create token and save to cookies automatically. [Reference: Cognito Token](http://docs.aws.amazon.com/zh_cn/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)

----
### <b>STEP 9 &nbsp;</b> create API gateway for query DynamoDB data
* set API Authorization by user pool. 

----
### <b>STEP 10 &nbsp;</b> 
----
### <b>STEP 11 &nbsp;</b> 
----
### <b>STEP 12 &nbsp;</b> 
----
### <b>STEP 13 &nbsp;</b> 
* for more function like re-send confirmation code, forget password, refresh token ect., please check [HERE](https://github.com/aws/amazon-cognito-identity-js/)

### Remark
We use ES6 and without apply babel, so it must been test at browser witch supply ES6.