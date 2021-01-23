const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
app.use(cors());

const Todo = require("./todo");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.SECRET_KEY;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/login", (request, response) => {
  console.log(request.body);
  const email = request.body.email;
  const token = jwt.sign({ email }, secretKey);
  return response.json({ token, email });
});

const middleware = (request, response, next) => {
  const token = request.headers.authorization;
  if (!token) {
    response.status(401).json();
  } else {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.email) {
      request.params.email = decoded.email;
      return next();
    }
    response.status(401).json();
  }
};

const checkIdExist = (request, response, next) => {
  const { id } = request.params;

  Todo.getById({ id }, (err, data) => {
    console.log(data);
    if (err) {
      response.status(400).json();
    }
    if (!data) {
      response.status(404).json();
    } else {
      request.params.task = data[0];
      return next();
    }
  });
};

app.get("/dashboard", middleware, (request, response) => {
  const email = request.params.email;
  Todo.all({ email }, (err, data) => {
    if (err) return err;
    response.status(200).json({ tasks: data });
  });
});

app.post("/tasks", middleware, (request, response) => {
  const email = request.params.email;
  const title = request.body.title;
  if (email && title) {
    Todo.add({ email, title }, (err, data) => {
      if (err) throw err;
      response
        .status(200)
        .json({ title, completed: 0, id: data.insertId, email });
    });
  } else {
    response.status(400).json();
  }
});

app.put("/tasks/:id", middleware, checkIdExist, (request, response) => {
  const { id, email } = request.params;
  const { title, status } = request.body;

  Todo.update({ id, email, title, status }, (err) => {
    if (err) {
      response.status(400).json();
    } else {
      response.status(200).json({ id, email, title, completed: status });
    }
  });
});

app.delete("/tasks/:id", middleware, checkIdExist, (request, response) => {
  const { id, email, task } = request.params;
  if (task.completed === 1) response.status(400).json();
  else {
    Todo.delete({ id, email }, (err) => {
      if (err) {
        response.status(400).json();
      } else {
        response.status(200).json();
      }
    });
  }
});

app.listen(port);
