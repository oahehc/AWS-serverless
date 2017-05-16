// Variable for AWS
const sys = {
    // awsRegion: 'us-east-1',
    // poolData: {
    //     UserPoolId: 'us-east-1_2YxxxxxxO',
    //     ClientId: '20544xxxxxxxxxxxxxxxdlb',
    // },
    awsRegion: 'us-east-1',
    UserPoolId: 'us-east-1_D4Qga3XmA',
    ClientId: '4lijvvq6lfm7i3hq8b883j714q',
};
console.log(AWS);

const signInBtn = document.querySelector('#signIn');
signInBtn.addEventListener('click', function () {
    console.log('click signInBtn');
})