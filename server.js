const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./protoDef/user.proto";

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// initializing the package definition
var userPackageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);

const ourServer = new grpc.Server();

let list = {
  // Default users
  "users":
    [
      {
        userId: "0",
        password: "passwordUser0001",
        userName: "bob001"
      },
      {
        userId: "1",
        password: "passwordUser0002",
        userName: "alex002"
      }
    ]
};

const grpcObj = grpc.loadPackageDefinition(userPackageDef);

ourServer.addService(grpcObj.UserService.service, {

  GetUsers: (UserMessage, callback) => {
    callback(null, list);
  },

  RegisterUser: (RegisterMessage, callback) => {
    const userInfo = RegisterMessage.request;

    if (!userInfo.password || !userInfo.userName) {
      callback(new Error("userInfo cannot be empty"), null);
      return;
    }

    const user = {
      userId: list.users.length,
      ...userInfo
    };

    list.users.push(user);
    callback(null, user);
  }

});

ourServer.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    ourServer.start();
  }
);