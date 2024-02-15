const { fetchUser } = require("./middleware/fetchUser");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const socket = require("socket.io");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./backend/profileImages");
  },
  filename: (req, file, cb) => {
    const filespliter = file.originalname.split(".");

    cb(
      null,
      filespliter[0] + `_${Date.now()}.${filespliter[filespliter.length - 1]}`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
}).single("profileImage");

const app = express();
const server = createServer(app);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

async function selectQuery(table, input = "*", condition = 1) {
  var data = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT ${input} FROM \`${table}\` WHERE ${condition}`,
      (err, data) => {
        if (err) console.log(err);
        resolve(data);
      }
    );
  });
  return data;
}

async function insertQuery(table, values) {
  var fields;
  if (table === "authentication") {
    fields = `\`phoneNumber\`, \`username\`, \`password\``;
  } else if (table === "contacts") {
    fields = `\`phonenumber\`, \`contactdetails\``;
  } else if (table === "userdata") {
    fields = `\`phonenumber\`, \`name\`, \`profileimage\`, \`emailaddress\``;
  }
  var data = await new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO \`${table}\`(${fields}) VALUES (${values})`,
      (err, res) => {
        if (err) reject(new Error("rejected by database!"));
        resolve(res);
      }
    );
  });
  return data;
}

function jwtGenerator(data) {
  const jwtKey = "Dh4rm1kP473lv";
  const token = jwt.sign(data, jwtKey);
  return token;
}

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
console.log();
app.use("/profileImage", express.static(path.join(__dirname, "profileImages")));
// signin: {phone,password}
app.post("/signin", async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  const result = await selectQuery(
    "authentication",
    "*",
    `phonenumber='${phone}'`
  );
  if (result.length === 0) {
    console.log(result[0]);
    res.json({ error: "user not found! please signup again!" });
    return;
  } else if (parseInt(result[0]?.phonenumber) === parseInt(phone)) {
    bcrypt.compare(password, result[0].password, (err, result) => {
      if (result) {
        const token = {
          phone: phone,
        };
        const auth_token = jwtGenerator(token);
        res.json({ auth_token });
      }
    });
  } else {
    res.json({ error: "password don't match. try again!" });
    return;
  }
});

//signup : {username,phone,password}
app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const phone = req.body.phone;
  const password = req.body.password;

  const data = await selectQuery(
    "authentication",
    "phonenumber",
    `phonenumber='${phone}'`
  );
  if (data[0]?.phonenumber) {
    res.json({ error: "User Already Exist" });
    return;
  }
  bcrypt.genSalt(10, (err, salt) => {
    try {
      bcrypt.hash(password, salt, async (err, hash) => {
        const result = await insertQuery(
          "authentication",
          `'${phone}','${username}','${hash}'`
        );
        if (result) {
          console.log(phone);
          const token = {
            phone: phone,
          };
          const auth_token = jwtGenerator(token);
          res.json({ auth_token });
        }
      });
    } catch (err) {
      console.log(err);
      res.json({ error: "unexpected error occured" });
    }
  });
  const userdata = await insertQuery(
    "userdata",
    `'${phone}','${username}','',''`
  );
  console.log(userdata);
  await insertQuery("contacts", `'${phone}',''`);
});

//addUserdata : formData{profileImage,name,email}
app.post("/addUserdata", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err.message);
      res.json({ error: err.message });
      return;
    } else {
      const phone = fetchUser(req, 1);
      const email = req.body.email;
      const name = req.body.name;
      var returnobject = { success: "Data inserted successfully!" };
      if (!req.file) {
        returnobject = {
          ...returnobject,
          error:
            "Image not received! select an image to set it as profile image!",
        };
      }
      connection.query(
        `UPDATE \`userdata\` SET \`name\`='${name}'${
          !req.file ? "" : `,\`profileimage\`='${req.file.filename}'`
        },\`emailaddress\`='${email}' WHERE phonenumber=${phone};`,
        (err) => {
          if (err) console.log(err);
        }
      );
      res.json(returnobject);
    }
  });
});

//fetchUserdata: nothing(takes phone from auth_token)
app.post("/fetchUserdata", fetchUser, async (req, res) => {
  var data = await selectQuery(
    "userdata",
    "*",
    `phonenumber='${req.body.phone}'`
  );
  if (data.length > 1) {
    res.json({ error: "an Internal Error Has Occured" });
    console.log({
      threat: "multiple entries with same phone number in userdata table",
    });
  }
  res.json(data[0]);
});

//addContact:{name,phonenumber}
app.post("/addContact", fetchUser, async (req, res) => {
  const name = req.body.name;
  const number = req.body.phonenumber;
  var existsAlready = false;
  const userdata = await selectQuery(
    "userdata",
    "name",
    `phonenumber=${number}`
  );
  if (!userdata[0]?.name) {
    res.json({ error: "User doesn't have an account on Chat-app" });
    return;
  }
  const contacts = await selectQuery(
    "contacts",
    "contactdetails",
    `phonenumber=${req.body.phone}`
  );
  contacts[0].contactdetails.split(";").forEach((element) => {
    if (element.split(":")[1] === number) {
      existsAlready = true;
    }
    return;
  });
  if (existsAlready) {
    res.json({ error: "Contact already exist in your contactList!" });
    return;
  } else {
    const insertString = `${name}:${number};`;
    connection.query(
      `UPDATE \`contacts\` SET \`contactdetails\`='${contacts[0].contactdetails}${insertString}' WHERE phonenumber=${req.body.phone}`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ error: "Some internal error occured!" });
          return;
        }
        res.json({ success: "Contact inserted successfully!" });
      }
    );
  }
});

//deleteContact:{phonenumber(to be deleted)}
app.post("/deleteContact", fetchUser, async (req, res) => {
  const phone = req.body.phonenumber;
  var contacts = await selectQuery(
    "contacts",
    "contactdetails",
    `phonenumber=${req.body.phone}`
  );

  contacts = contacts[0].contactdetails.split(";").filter((element) => {
    return element.split(":")[1] !== phone && element !== "";
  });
  var contactString = "";
  contacts.forEach((element) => {
    contactString += `${element};`;
  });
  connection.query(
    `UPDATE \`contacts\` SET \`contactdetails\`='${contactString}' WHERE phonenumber=${req.body.phone}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ error: "Some internal error occured!" });
        return;
      }
      res.json({ success: "contact deleted successfully!" });
    }
  );
});

//fetchContacts:nothing(phonenumber of user directly taken from headers )
app.post("/fetchContacts", fetchUser, async (req, res) => {
  const phone = req.body.phone;

  const contacts = await selectQuery(
    "contacts",
    "contactdetails",
    `phonenumber=${phone}`
  );
  // console.log(contacts[0].contactdetails.split(";"));
  var container = [];
  contacts[0].contactdetails
    .split(";")
    .filter((e) => e !== "")
    .forEach((element) => {
      var content = element.split(":");
      container.push({ name: content[0], phone: parseInt(content[1]) });
    });
  var selector = "0 ";
  container.forEach((element) => {
    selector += `OR phonenumber=${element.phone} `;
  });
  const data = await selectQuery(
    "userdata",
    `\`profileimage\`,\`phonenumber\``,
    selector
  );
  data.forEach((element) => {
    container.forEach((item, index) => {
      if (item.phone === parseInt(element.phonenumber)) {
        container[index] = {
          ...item,
          profileimage: `http://localhost:5000/profileImage/${element.profileimage}`,
        };
      }
    });
  });
  res.json({ contacts: container });
});

app.post("/fetchChats", fetchUser, async (req, res) => {
  const phone = parseInt(req.body.phone);
  const contactPhone = parseInt(req.body.contactPhone);
  const tableName = `${
    phone > contactPhone
      ? `${contactPhone}_${phone}`
      : `${phone}_${contactPhone}`
  }`;
  chatConnection.query(
    `SELECT * FROM \`${tableName}\` WHERE 1`,
    (err, result) => {
      if (err) console.log(err);
      result.forEach((element, index) => {
        result[index] = {
          ...element,
          class: `${element.sender === `${phone}` ? "right" : "left"}`,
        };
      });
      res.json(result);
    }
  );
});

const chatConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app_messages",
});

async function tableCreater(number1, number2) {
  try {
    const tableName =
      parseInt(number1) < parseInt(number2)
        ? `${number1}_${number2}`
        : `${number2}_${number1}`;

    await chatConnection.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
      message TEXT,
      time TEXT,
      sender TEXT
      )
      `);
  } catch (err) {
    console.log(err);
  }
}

function messageInserter(tableName, message, sender) {
  chatConnection.query(
    `INSERT INTO \`${tableName}\`(\`message\`, \`time\`, \`sender\`) VALUES ('${message}','${Date.now()}','${sender}')`,
    (err) => {
      if (err) throw err;
    }
  );
}

io.on("connection", (socket) => {
  var roomId;
  var userPhone;
  //"message" event to be emitted when pressed the send button
  socket.on("message", (message) => {
    if (roomId) {
      message = JSON.parse(message);
      message = {
        message: message.message,
        sender: userPhone,
        time: Date.now(),
        class: "left",
      };
      try {
        messageInserter(roomId, message.message, userPhone);
      } catch (err) {
        if (err) console.log(err);
        return;
      }
      socket.to(roomId).emit("receive", message);
    } else {
      socket.emit("unable to send message");
      console.log("please connect to the internet connection and refresh");
    }
  });

  // "chatOpen" event to be emitted on a chat opening (clicking of a chat instance)
  socket.on("chatOpen", async (data) => {
    data = JSON.parse(data);
    const jwtKey = "Dh4rm1kP473lv";

    try {
      const result = jwt.verify(data.sender, jwtKey);
      userPhone = result.phone;
      data = { ...data, sender: result.phone };
    } catch (err) {
      console.log(err);
    }

    if (isNaN(parseInt(data.receiver)) || isNaN(parseInt(data.sender))) {
      return;
    }
    roomId =
      parseInt(data.receiver) < parseInt(data.sender)
        ? `${data.receiver}_${data.sender}`
        : `${data.sender}_${data.receiver}`;
    await tableCreater(data.receiver, data.sender);
    socket.join(roomId);
  });

  socket.on("chatClose", () => {
    socket.leave(`${roomId}`);
    roomId = null;
  });
});

server.listen(5000, () => {
  console.log("server started on port : 5000");
});
