const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
const port = 8000;

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

var client = 0;
var clientlost = 0;
var iphost = 0;
var ipconvert = 0;
var ipconnectcheck = false;
var ipremovecheck = false;
var iparray = [];
var ipconvertarray = [];
var ipnewconnect = 0;
var ipnextconnect = 0;

io.on("connection", function (socket) {
    socket.emit("newconnection", { description: `Chào mừng bạn` });
    if (iphost === 0) {
        iphost = socket.handshake.address;
    }

    ipnewconnect = socket.handshake.address;

    if (iparray && ipnewconnect === iphost) {
        ipconnectcheck = true;
    }

    iparray.forEach(item => {
        if (ipnewconnect === iphost || ipnewconnect === item) {
            ipconnectcheck = true;
        }
    })

    if (ipconnectcheck === false) {
        ipnextconnect = ipnewconnect;
        ipconvert = ipnextconnect.slice(7);
        client++;
        clientlost--;
        socket.broadcast.emit("newconnection", { description: `${client} người dùng đã kết nối đến.` });
        console.log("==========================================");
        console.log(`${client} người dùng đã kết nối đến.`);
        // console.log(`Kết nối mới: ${ipnewconnect}`);
        console.log(`Kết nối mới: ${ipconvert}`);
        iparray.push(ipnextconnect);
        console.log("==========================================");
        // console.log("Kết nối hiện có:");
        // iparray.forEach(item => {
        //     console.log(item);
        // })
        ipconvertarray.push(ipconvert);
        console.log("Kết nối hiện có:");
        ipconvertarray.forEach(item => {
            console.log(item);
        })
        console.log("==========================================");
    } else {
        console.log("==========================================");
        console.log("Chưa có kết nối mới.");
        ipconnectcheck = false;
    }

    socket.on("disconnect", function () {
        iparray.forEach((item, index) => {
            if (item === ipnewconnect) {
                iparray.splice(index, 1);
                ipconvertarray.splice(index, 1);
                ipremovecheck = true;
            }
        })

        if (ipremovecheck === true) {
            client--;
            clientlost++;
            io.sockets.emit("Broadcast", { description: `${clientlost} người dùng đã ngắt kết nối.` });
            console.log(`${client} người dùng đã kết nối đến.`);
            console.log(`Kết nối mất: ${ipconvert}`);
            console.log("==========================================");
            console.log("Kết nối hiện có:");
            // iparray.forEach(item => {
            //     console.log(item);
            // })
            ipconvertarray.forEach(item => {
                console.log(item);
            })
            console.log("==========================================");
            ipremovecheck = false;
        }
    });

});

server.listen(8000, function () {
    console.log(`Ứng dụng đang lắng nghe tại cổng ${port}`);
})

