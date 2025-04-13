

Making endpoint to demonstrate API request, response transaction:
User Route

Product Route
Authentication Route 
This route is for Sending Authentication Request 
1. Register : this end point is mode to create new USer into the database and frondend will recieve response as a  cookie.
URL = "http://localhost:7000/api/v1/auth/register"
mathod = "POST"
JSON body: 
{
    "name":"gautam",
    "phone":"0926172340",
    "email":"gautam@gmail.com",
    "password":"secret"
}

2. LogIn : This endpoint is to login an already registered user and front end will recieve cookie.
URL: "http://localhost:7000/api/v1/auth/login"
method: "POST"
JSON body: 
{
    "identifier":"9109390639",
    "password":"secret"
}

3. Logout : This logout is assigned to logout the user and remove cookie instantly.
URL: "http://localhost:7000/api/v1/auth/logout"
method: "GET"
no body required
