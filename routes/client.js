var net=require('net');
var readline=require('readline');
var client=new net.Socket();
var port=3000;
var hostname='localhost';


client.connect(port,hostname,()=>{
	client.write('上线了')
})

client.on('data',(data)=>{
	console.log(''+data)
	say()
})
var r1=readline.createInterface({
	input:process.stdin,
	output:process.stdout
})

function say(){
	r1.question('',(str)=>{
		client.write(str)
	})
}