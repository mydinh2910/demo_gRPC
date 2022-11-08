const grpc = require("@grpc/grpc-js");

var protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./protoDef/user.proto";

const bcrypt = require('bcrypt');

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var userPackageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);

const UserService = grpc.loadPackageDefinition(userPackageDef).UserService;

const clientStub = new UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const userInfo = {
  userName: "azura",
  password: "passwordOfAzura"
}

// clientStub.RegisterUser(userInfo, (error, data) => {

//   if (error) {
//     console.log(error);
//     return;
//   }

//   console.log(data);
// });

clientStub.GetUsers({}, (error, passwords) => {
  //implement your error logic here
  console.log(passwords);
});