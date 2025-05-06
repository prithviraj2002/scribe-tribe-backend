# scribe tribe backend

A robust backend architecture, backed by mongodb database, supports firebase authentication, firebase notification push, basic CRUD operation apis such as creation of 
student profile, creation of scribe requests, applying to scribe requests, etc. Supports efficient data flow through the scribe tribe platform and backs both student app
and scribe app.

Scribe app: https://github.com/prithviraj2002/scribe-app/tree/main
Student app: https://github.com/prithviraj2002/student-app/tree/main

## Tech stack
Language: Javascript, nodejs and nodejs modules.

Tools: VS Code, Postman, Mongodb, mongodb atlas, github, cmd.

## Features
1. Decoding firebase auth token, validating for correct user before each api call, as set in auth middleware, and retrieving user information from auth token.
2. Post requests on various endpoints, for student profile creation, scribe profile creation, scribe request creation, review creation etc.
3. Get requests on various endpoints to support data retrieval of student profile, scribe profiles, scribe requests, volunteers, reviews etc.
4. Patch requests to support profile updation for both scribe and student, updation of scribe requests.
5. Delete requests to support profile deletion, scribe request deletion, and student profile deletion.
6. Topic subscribed, firebase real time notifications implemented, everytime a new scribe request is created, a scribe applies to a request, and a request is completed along with review.
