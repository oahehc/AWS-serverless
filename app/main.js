// Variable for AWS
const sys = {
    awsRegion: 'us-east-1',
    poolData: {
        UserPoolId: 'us-east-1_2YjLtIZTO',
        ClientId: '20544safmce2spepr9b521qdlb',
    },
};
console.log(AWS);

const signInBtn = document.querySelector('#signIn');
signInBtn.addEventListener('click', function () {
    console.log('click signInBtn');
})