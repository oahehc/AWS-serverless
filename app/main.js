// variable
const userPoolRegion = 'us-east-1';
const poolData = {
    UserPoolId: 'us-east-1_D4Qga3XmA',
    ClientId: '4lijvvq6lfm7i3hq8b883j714q',
};
const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
const IdentityPoolId = 'us-east-1:e1ee252a-bfdd-484f-bc35-eac21e8aac8f';


// function
function generateUUID() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

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
                // const cognitoIdp = `cognito-idp.<${userPoolRegion}>.amazonaws.com/<${poolData.UserPoolId}>`;
                // AWS.config.credentials = new AWSCognito.CognitoIdentityCredentials({
                //     IdentityPoolId,
                //     Logins: {
                //         [cognitoIdp]: result.getIdToken().getJwtToken(),
                //     }
                // });

                // const login = `cognito-idp.${sys.cognitoRegion}.amazonaws.com/${sys.poolData.UserPoolId}`;
                // AWS.config.region = sys.awsRegion;
                // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                //     IdentityPoolId: sys.IdentityPoolID,
                // });
                // AWS.config.credentials.params.Logins = {};
                // AWS.config.credentials.params.Logins[login] = result.getIdToken().getJwtToken();
                // AWS.config.credentials.refresh((err) => {
                //     if (err) {
                //         log('Error in authenticating to AWS ' + err);
                //         resolve({
                //             errcode: 999,
                //             msg: err,
                //         });
                //     } else {
                //         log('identityId is: ' + AWS.config.credentials.identityId);
                //         // query vendorId from DynamoDB
                //         const dynamodb = new AWS.DynamoDB({
                //             apiVersion: '2012-08-10',
                //             region: sys.awsRegion,
                //         });
                //         dynamodb.batchGetItem({
                //             RequestItems: {
                //                 [sys.vendorTableName]: {
                //                     Keys: [{
                //                         "email": {
                //                             S: email,
                //                         },
                //                     }],
                //                 },
                //             },
                //         }, (err, data) => {
                //             if (err) {
                //                 log('dynamoDB query vendorId error:', err);
                //             } else {
                //                 const vendorId = data.Responses[sys.vendorTableName][0].vendorId.S;
                //                 // save account info to localstorage
                //                 window.localStorage.setItem('accountInfo', JSON.stringify({
                //                     user: email,
                //                     vendorId,
                //                     identityToken: result.getIdToken().getJwtToken(),
                //                 }));
                //                 log('token expireTime', AWS.config.credentials.expireTime);
                //                 resolve({
                //                     errcode: 0,
                //                     msg: null,
                //                 });
                //             }
                //         });
                //     }
                // });
            },
            onFailure(err) {
                console.log('signIn error', err);
                reject(err);
            },
        });
    })
}


// event listener
const signUpBtn = document.querySelector('#signUp');
const signInBtn = document.querySelector('#signIn');
const confirmBtn = document.querySelector('#confirm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const validateInput = document.querySelector('#validate');
const erroMsg = document.querySelector('#message');
const btnGroup = document.querySelector('.btnGroup');
btnGroup.addEventListener('click', (e) => {
    console.log(e, e.target, e.target.id);
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
        case 'signIn':
            console.log('click signInBtn');
            if (emailInput.value && passwordInput.value) {
                signIn(emailInput.value, passwordInput.value).then((result) => {
                    window.location = `${window.location.origin }/user.html?user=${emailInput.value}`; // relocate to main page
                }).catch((err) => {
                    erroMsg.innerHTML = err;
                })
            } else {
                erroMsg.innerHTML = 'email & password code can\'t been empty';
            }
            break
    }
})

// bind enter event for test only
window.addEventListener('keydown', (e) => {
    console.log(e, e.keyCode);
    if (e.keyCode === 13) {
        signInBtn.click();
    }
})