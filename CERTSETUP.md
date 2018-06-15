https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2

Server Side
wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/ca.cnf

openssl req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-crt.pem

openssl genrsa -out server-key.pem 4096

wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/server.cnf

openssl req -new -config server.cnf -key server-key.pem -out server-csr.pem

openssl x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem

Client Side
openssl genrsa -out client1-key.pem 4096

wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/client1.cnf

openssl req -new -config client1.cnf -key client1-key.pem -out client1-csr.pem

openssl x509 -req -extfile client1.cnf -days 999 -passin "pass:password" -in client1-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out client1-crt.pem

openssl verify -CAfile ca-crt.pem client1-crt.pem