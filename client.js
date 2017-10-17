var express = require('express');
var soap = require('soap');
var bodyParser = require('body-parser');
var app = express();

require('body-parser-xml')(bodyParser);

app.use(bodyParser.xml({
    limit:'1MB',
    xmlParseOptions:{
        normalize:true,
        normalizeTags:true,
        explicitArray:false
    }
}));

app.get('/',function(req,res){
    res.sendFile(__dirname + "/" + "/client.html");
})

app.post('/getData',bodyParser.urlencoded({extended:false}),function(req,res){
    /*console.log(req.body);*/
    var input = req.body;
    console.log(input.nbrmdata.startdate);
    /*console.log(input.nbrmdata.startDate);
    console.log(input.nbrmdata.endDate);*/

    /* 
    -beginning of soap body
    -url is defined to point to server.js so that soap cient can consume soap server's remote service
    -args supplied to remote service method
    */
    var url = "http://localhost:3030/nbrm?wsdl";

    // var args = {StartDate:'12.02.2010', EndDate:'15.02.2010'};
    var args = {StartDate:input.nbrmdata.startdate, EndDate:input.nbrmdata.enddate};
    soap.createClient(url,function(err,client){
        if(err)
            console.error(err);
        else {
            client.GetExchangeRates(args,function(err,response){
                if(err) {
                    /*console.error(err);*/
                }
                else {
                    /*console.log(response);*/
                    res.send(response);
                }
            })
        }
    });
})

var server = app.listen(3036,function(){
    var host = "127.0.0.1";
    var port = server.address().port;
    console.log("server running at http://%s:%s\n",host,port);
})