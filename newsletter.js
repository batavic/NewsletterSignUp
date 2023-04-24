const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req,res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    
    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }

            }
        ]
    }

    const jsonData=JSON.stringify(data);
    const url="https://us11.api.mailchimp.com/3.0/lists/1b651aa081";
    //<dc> instead of us11
    const options={
        method:"POST",
        auth:"vic:b24a41de4a250b56c416d497127665a4-us11"
    }
    const request=https.request(url, options, function(response){
        response.on("data", function(data){
            if(response.statusCode==200){
                res.sendFile(__dirname+"/success.html");
            }else{
                res.sendFile(__dirname+"/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();
})

app.listen(process.env.PORT || 3000, function(){
    console.log("The server is running on port 3000");
})
