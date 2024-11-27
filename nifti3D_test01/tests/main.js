var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types'); // 'mime' 대신 'mime-types' 사용

var app = http.createServer(function(request, response) {
    var url = request.url;

    // 기본 경로 설정
    if (url == '/') {
        url = '/3D_test02.html';  // 기본 HTML 파일
    }

    // favicon.ico 요청 처리 (404 반환)
    if (url == '/favicon.ico') {
        response.writeHead(404);
        response.end();
        return;
    }

    // 요청된 URL이 nifti-reader.js일 경우
    if (url == '/nifti-reader.js') {
        // 'nifti-reader.js' 파일 경로
        var filePath = path.join(__dirname, 'nifti-reader.js');
        fs.readFile(filePath, function(err, data) {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('500 Internal Server Error');
                return;
            }

            // MIME 타입 설정
            response.writeHead(200, { 'Content-Type': 'application/javascript' });
            response.end(data);
        });
        return;
    }

    // 그 외 파일 요청 처리
    var filePath = path.join(__dirname, url);
    
    // 파일이 존재하는지 확인
    fs.exists(filePath, function(exists) {
        if (!exists) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 Not Found');
            return;
        }

        // 파일 읽기
        fs.readFile(filePath, function(err, data) {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('500 Internal Server Error');
                return;
            }

            // MIME 타입 설정
            var mimeType = mime.contentType(filePath);
            response.writeHead(200, { 'Content-Type': mimeType || 'application/octet-stream' });
            response.end(data);
        });
    });
});

app.listen(3000, function() {
    console.log('Server running at http://localhost:3000/');
});
