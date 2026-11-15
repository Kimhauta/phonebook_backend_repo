const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Exercise 3.2: Info page
app.get("/info", (request, response) => {
  const count = persons.length;
  const timestamp = new Date();

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${timestamp}</p>
  `);
});

// Exercise 3.1: Get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Exercise 3.3: Get single person by ID
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Exercise 3.4: Delete person by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

// Exercises 3.5 & 3.6: Add new person with validation
const generateId = () => {
  return String(Math.floor(Math.random() * 1000000));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const nameExists = persons.some(
    (p) => p.name.toLowerCase() === body.name.trim().toLowerCase(),
  );

  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name.trim(),
    number: body.number.trim(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
