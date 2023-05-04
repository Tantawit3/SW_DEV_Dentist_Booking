

## Description

Mock-up project for education, aim to create a matching system for dentists and users.

## Dependencies Installation

```bash
$ yarn install
```

## Database Installation
This guide will show you how to create docker container that contain mongo database with replica set in your local computer.

Firstly you would need to install Docker to your computer. Then you would need to create docker container in your computer by following below guide, note that you only need to do this part only **on the first time**.

There's two options to create docker container :
1. You can just run `$ ./rs-init.sh/startdb.sh` in your terminal, note that this method is not working on every computer
2. If you cannot run `$ ./rs-init.sh/startdb.sh`, then you must run the command inside it yourself by folllowing these step
   i. run `$ docker-compose up -d` in your terminal
   ii. Open Docker Desktop, now you should see your container created. Open mongoRep1 terminal
        ![image](https://user-images.githubusercontent.com/70059585/216290379-8321e06f-bcd2-4dad-89ee-2466bbd3ee55.png)
   iii. run Command as follow in **mongoRep1 terminal**:
```
mongosh
```
```
var config = {
    "_id": "dbrs",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "mongoRep1:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "mongoRep2:27017",
            "priority": 1
        }
    ]
};
```
```
rs.initiate(config, { force: true });
```
   iv. You should see `ok:1`, if you do then you can now close docker terminal.
        ![image](https://user-images.githubusercontent.com/70059585/216291805-62315fe5-b258-4e9b-a71b-1535b39d045b.png)

## Start Docker Container
You must start docker container everytime before you `Running the app`, or else you gonna get errors. To start docker container you can either run `docker-compose up -d` in your terminal or click at **Play** button in **Docker Desktop** 
![image](https://user-images.githubusercontent.com/70059585/216282496-ea510271-77c3-4cfa-b787-815cbadaf655.png)

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```


## License

Nest is [MIT licensed](LICENSE).
