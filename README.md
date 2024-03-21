## API Endpoints

### GET `/`

- Returns a list of all lovers in the database.

### GET `/hobbies`

- Returns a list of all hobbies in the database.

### GET `/:name`

- Returns lover matching the provided name.

### POST `/`

- Adds a new lover to the database.
- Requires `name`, `password`, `age`, `sex`, `description`, `hobbies`, `photo`, and `comments` fields in the request body.
- Supported image formats: jpg, jpeg, png.

### PUT `/:name`

- Updates lover information matching the provided name.
- Requires the `name` field in the request parameters.
- Requires updated lover details in the request body.

### POST `/login`

- Name and password on body for authentication.

### DELETE `/:name`

- Deletes a lover from the database.
- Requires the `name` field in the request parameters.
- Requires the `password` field in the request body for authentication.

### POST `/:name/comment`

- Adds a comment to the lover's profile.
- Requires `user`, `password`, and `message` fields in the request body. (User from which the comment is made)
- Requires the `name` field in the request parameters. (User to comment on)
- Requires the `password` field in the request body for authentication.

### DELETE `/:name/comment`

- Deletes comments made by a specific user from the lover's profile.
- Requires `user`, `password` fields in the request body.
- Requires the `name` field in the request parameters.
- Requires the `password` field in the request body for authentication.

## Example Usage

### Fetch all lovers

curl http://localhost:3000/

### Fetch lover by name

curl http://localhost:3000/:name

### Add a new lover

curl -X POST -H "Content-Type: application/json" -d '{"name":"John Doe","password":"pass123","age":25,"sex":"Male","description":"A nature lover","hobbies":["Traveler","Gardener"],"photo":"john_doe.jpg","comments":[]}' http://localhost:3000/

### Update lover information

curl -X PUT -H "Content-Type: application/json" -d '{"password":"newpass123","age":26}' http://localhost:3000/:name

### Delete a lover

curl -X DELETE -H "Content-Type: application/json" -d '{"password":"pass123"}' http://localhost:3000/:name

### Add a comment

curl -X POST -H "Content-Type: application/json" -d '{"user":"commenter1","password":"pass123","message":"Great person!"}' http://localhost:3000/:name/comment

### Delete comments by a user

curl -X DELETE -H "Content-Type: application/json" -d '{"user":"commenter1","password":"pass123"}' http://localhost:3000/:name/comment
