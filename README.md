# cribl-project

### Jasmine
Execute jasmine.js tests
```shell script
cd ./cribl-project
npm test
```

### Docker
Start 2 instances of docker container, listening on ports 8080 and 8081
```shell script
cd ./cribl-project
docker build -t mprowler/cribl-project .
docker run -p 8080:8080 --rm -d --name cribl-demo1 mprowler/cribl-project
docker run -p 8081:8080 --rm -d --name cribl-demo2 mprowler/cribl-project
```

Shutdown instances and remove image
```shell script
cd ./cribl-project
docker stop cribl-demo1 cribl-demo2
docker image rm mprowler/cribl-project
```

### Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/923a0b898e27b486afd8)
