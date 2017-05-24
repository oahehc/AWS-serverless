const userPoolRegion = 'us-east-1';
const poolData = {
    UserPoolId: 'us-east-1_D4Qga3XmA',
    ClientId: '4lijvvq6lfm7i3hq8b883j714q',
};
const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);