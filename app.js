const express = require("express");
const port = 9000;
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Todo = require("./todo");
const { request, response } = require("express");
const secretKey = "TDCX@fe";
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post("/login", (request, response) => {
  const email = request.body.email;
  const token = jwt.sign({ email }, secretKey);
  response.send({ token, email });
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
    if (err) {
      response.status(400).json();
    }
    if (!data) {
      response.status(404).json();
    } else {
      request.params.task = data;
      return next();
    }
  });
};

app.get("/dashboard", middleware, (request, response) => {
  const email = request.params.email;
  Todo.all({ email }, (err, data) => {
    response.status(200).json({ tasks: data });
  });
});

app.post("/tasks", middleware, (request, response) => {
  const email = request.params.email;
  const title = request.body.title;
  if (email && title) {
    Todo.add({ email, title });
    Todo.get({ title }, (err, data) => response.status(201).json(data));
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
      response.status(200).json();
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
