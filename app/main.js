// variable
const sys = {
    awsRegion: 'us-east-1',
    UserPoolId: 'us-east-1_D4Qga3XmA',
    ClientId: '4lijvvq6lfm7i3hq8b883j714q',
};

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
    // create user pool object
    const poolData = {
        UserPoolId: sys.UserPoolId,
        ClientId: sys.ClientId,
    };
    const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

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
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) console.log('signUp ERROR', err);
        else console.log('signUp SUCCESS', result);
    });
}


// event listener
const signUpBtn = document.querySelector('#signUp');
const signInBtn = document.querySelector('#signIn');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
signUpBtn.addEventListener('click', () => {
    console.log('click signUpBtn');
    if (emailInput.value && passwordInput.value) signUp(emailInput.value, passwordInput.value);
})