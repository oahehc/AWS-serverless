# AWS-serverless-example
this is a basic web application base on AWS serverless structure with below function.
- sign up with email confirmation
- sign in / sign out
- data create/query by user
---
## The AWS service has been used in this example 
- Cognito
- API gateway
- Lambda
- dynamoDB
- S3
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
### <b>STEP 3 &nbsp;</b> 
### <b>STEP 4 &nbsp;</b> 
### <b>STEP 5 &nbsp;</b> 
### <b>STEP 6 &nbsp;</b> 
### <b>STEP 7 &nbsp;</b> 


### Remark
1. this example focus on AWS serverless structure, only with minimize design and didn't apply any font-end framework.
2. use ES6 and without apply babel, so must test at the browser supply ES6 (suggest: Chrome)