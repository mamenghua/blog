var net = require('net');
var server = new net.Server();
var obj = {};
var i = 0;

server.on('connection',(client)=>{
    client.name = ++i;
    obj[client.name]= client;
    client.on('data',(data)=>{
        console.log('服务器收到'+data);
        huifu(client,data)
    })
})


        
function huifu(client,message){
    for(let i in obj){
        obj[i].write(client.name + '说：' +message);
    }
} 

server.listen(3000);