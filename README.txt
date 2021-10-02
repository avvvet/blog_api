# init the project
npm install  

#create mysql database 
blog or other name

#.env
make sure to enter the database name (that you have created) and your local mysql user name and password in the .env file.

#migration
node_modules/.bin/sequelize db:migrate 
this will create the post, comment , commentThread models and relationships

#start the server
npm start

#test
npm test
this will start ESlint and then mocha mocha will run the test scrips /test

#api playload examples - you may use postman 
this will create new post.

#POST : http://127.0.0.1:4000/api/v1/posts   
BODY JSON
{
    "title": "post title",
    "content": "post content"
}



const {page , size} = req.query;
            let start_index = size * (page -1)
            let end_index = start_index + (page - 1)
            
            let photo_chunk = post.photos.slice(start_index, (end_index + 1))
            console.log('chunk ', photo_chunk)
            let obj_posts = {
                title : 'new',
                desciption : 'new desc',
                photos : photo_chunk
            }
            res.status(200).json(posts)


header (you can enter the header key value in postman header section )
key : x-auth 
value : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM
this is sample token for user id = 2225

on success 201 replied 
for invalid auth 401 unauthorized status code will be replied

#GET : http://127.0.0.1:4000/api/v1/posts
you will get all posts,

[
    {
        "id": 1,
        "title": "post title",
        "user_id": "2225",
        "content": "post content ...",
        "createdAt": "2021-09-22T16:05:20.000Z",
        "updatedAt": "2021-09-22T16:05:20.000Z"
    },
    ...
]


#PUT : http://127.0.0.1:4000/api/v1/posts/:id
this will get all posts.

path variable (you will find the Path variables in Params section in postman)
key : id  (post id to update)
value: 1
BODY Json : 
{
    "title": "updated post title",
    "content": "updated content"
}

header (you can enter the header key value in postman header section )
key : x-auth 
value : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoyMjI1LCJpYXQiOjE2MzIzMDc5OTF9.031i2YPQFiWorEVyZEaMnjwjP7WblK797yfheYzL-bM

*Post will be edited by the auther only, this will be handled by the x-auth token.

# Comments CRUD example 
#POST : http://127.0.0.1:4000/api/v1/comments/:post_id  
this will insert new comment for post.

path variable 
key : post_id  
value: 1 
BODY JSON
{
    "content": "comment ..."
}

header 
key : x-auth 
value : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo3Nzc1LCJpYXQiOjE2MzIzMDgwOTd9.sznrK_93VShz_1jAdj8-TbKoAf6j2pvfpNWrWb4Pncw
(user_id for 7775)

on sucess 201 replied 
for invalid auth 401 unauthorized status code will be replied


# to get all root comments
#GET : http://127.0.0.1:4000/api/v1/posts
you will get all root comments (comment given for the post)

[
    {
        "id": 1,
        "user_id": "7775",
        "post_id": 1,
        "content": "xyz comment now a days very common trend",
        "createdAt": "2021-09-22T17:00:19.000Z",
        "updatedAt": "2021-09-22T17:00:19.000Z",
        "Post": {
            "id": 1,
            "title": "mash and the bear",
            "user_id": "2225",
            "content": "new interesting production from pixel ...",
            "createdAt": "2021-09-22T16:05:20.000Z",
            "updatedAt": "2021-09-22T16:05:20.000Z"
        }
    },
    ...
]

# to reply for a comment (threaded comment)
#POST : http://127.0.0.1:4000/api/v1/comments/:post_id/reply/:root_comment_id

path variables

key : post_id  
value: 1 

key: root_comment_id
value: 1

BODY JSON
{
    "content": "comment ..."
}

header 
key : x-auth 
value : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjo3Nzc1LCJpYXQiOjE2MzIzMDgwOTd9.sznrK_93VShz_1jAdj8-TbKoAf6j2pvfpNWrWb4Pncw
(user_id for 7775)


# to get reply comments for any root/main comment
#GET : http://127.0.0.1:4000/api/v1/posts
with this you can get 'n' deep threaded coments ,

key : post_id  
value: 1 

key: root_comment_id
value: 1

[
    {
        "id": 2,
        "user_id": "7775",
        "post_id": 1,
        "content": " reply comment ",
        "createdAt": "2021-09-22T17:07:07.000Z",
        "updatedAt": "2021-09-22T17:07:07.000Z",
        "CommentThreads": {
            "child_comment_id": 2,
            "root_comment_id": 1
        }
    },
    {
        "id": 3,
        "user_id": "7775",
        "post_id": 1,
        "content": "other reply comment ",
        "createdAt": "2021-09-22T17:07:40.000Z",
        "updatedAt": "2021-09-22T17:07:40.000Z",
        "CommentThreads": {
            "child_comment_id": 3,
            "root_comment_id": 1
        }
    }
]
