// Variable for AWS
const sys = {
    awsRegion: 'us-east-1',
    poolData: {
        UserPoolId: 'us-east-1_2YxxxxxxO',
        ClientId: '20544xxxxxxxxxxxxxxxdlb',
    },
};
console.log(AWS);

const signInBtn = document.querySelector('#signIn');
signInBtn.addEventListener('click', function () {
    console.log('click signInBtn');
})