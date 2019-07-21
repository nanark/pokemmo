# Signup
## Endpoint
### Url:
```
POST https://api.zeapps.eu/user/signup
```
### Body:
```json
{
"email": "moi2@moi.com",
"password": "bob", 
"pseudo": "jc"
} 
```
### Response:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoxNTYzNzM5MDMwLCJ1dWlkIjoid2pVQmhUTGQ1ZVVzU3FIclIyRzk3RSJ9.-RJ7DYPc9JarkD5Pxkg3tmjowS93KukZ4u0tBoMc3fA",
    "refreshToken": "5b28e2efeabd456a380410cd5bf95963f3ebb5abad1314df7c7daa0ccb9c849e"
}

```

accessToken is the JWT you'll have to add in incoming header: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoxNTYzNzM5MDMwLCJ1dWlkIjoid2pVQmhUTGQ1ZVVzU3FIclIyRzk3RSJ9.-RJ7DYPc9JarkD5Pxkg3tmjowS93KukZ4u0tBoMc3fA
```

# Signin
## Endpoint
### Url:
```
POST https://api.zeapps.eu/user/signin
```
### Body:
```json
{
"email": "moi2@moi.com",
"password": "bob", 
} 
```
### Response:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoxNTYzNzM5MjA1LCJ1dWlkIjoid2pVQmhUTGQ1ZVVzU3FIclIyRzk3RSJ9.KB4JJvh3Vp9AYOHrH6hu_HEEsm26W-uV39ynB8gcGqs",
    "refreshToken": "5b28e2efeabd456a380410cd5bf95963f3ebb5abad1314df7c7daa0ccb9c849e"
}
```

# Refresh Token
You have to use it in case of 401 status code on protected endpoint
## Endpoint GET https://api.zeapps.eu/user/refresh/{refreshtoken}
Example (in this documentation):
https://api.zeapps.eu/user/refresh/5b28e2efeabd456a380410cd5bf95963f3ebb5abad1314df7c7daa0ccb9c849e
## Response
```json
{
"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoxNTYzNzM5MzExLCJ1dWlkIjoid2pVQmhUTGQ1ZVVzU3FIclIyRzk3RSJ9.Vgrw9ZReLyB3yEQWX2cRGUvFQ3PGVWxwnoUVqp5Ty_Q",
"refreshToken":"5b28e2efeabd456a380410cd5bf95963f3ebb5abad1314df7c7daa0ccb9c849e"
}
```
