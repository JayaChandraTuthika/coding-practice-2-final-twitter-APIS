const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const validateData = async (request, response, next) => {
  const {
    status = "",
    priority = "",
    category = "",
    due_date = "",
    search_q = "",
    date = "",
  } = request.query;
  priority_list = ["HIGH", "MEDIUM", "LOW", ""];
  status_list = ["TO DO", "IN PROGRESS", "DONE", ""];
  category_list = ["WORK", "HOME", "LEARNING", ""];
  if (!status_list.includes(status)) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (!priority_list.includes(priority)) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (!category_list.includes(category)) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (date !== "") {
    if (!isValid(new Date(date))) {
      response.status(400);
      response.send("Invalid Due Date");
    }
  } else {
    next();
  }
};

const validateBody = (request, response, next) => {
  const {
    status = "",
    priority = "",
    category = "",
    dueDate = "",
  } = request.body;
  priority_list = ["HIGH", "MEDIUM", "LOW"];
  status_list = ["TO DO", "IN PROGRESS", "DONE"];
  category_list = ["WORK", "HOME", "LEARNING"];

  if (!status_list.includes(status)) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (!priority_list.includes(priority)) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (!category_list.includes(category)) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (dueDate !== "") {
    if (!isValid(new Date(dueDate))) {
      response.status(400);
      response.send("Invalid Due Date");
    } else {
      next();
    }
  } else {
    next();
  }
};

// API 1: GET TODOS BY STATUS
app.get("/todos/", validateData, async (request, response) => {
  const {
    search_q = "",
    status = "",
    priority = "",
    category = "",
  } = request.query;
  console.log(request.query);
  const getTodoByQuery = `
            SELECT * FROM todo 
            WHERE 
                status LIKE "%${status}%" AND 
                priority LIKE "%${priority}%" AND 
                todo LIKE "%${search_q}%" AND 
                category LIKE "${category}%"
            ORDER BY id;`;
  const dbResponse = await db.all(getTodoByQuery);
  console.log("passed this");
  response.send(dbResponse);
});

// API 2: GET TODOS BY TODO ID
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const getTodoByTodoId = `
              SELECT * FROM todo WHERE id = ${todoId}
              ;`;
  const dbResponse = await db.get(getTodoByTodoId);
  response.send(dbResponse);
});

//API 3:GET TODOS BY AGENDA
app.get("/agenda/", async (request, response) => {
  let { date } = request.query;
  //   date = "20222-3-5";
  //   console.log(date);
  console.log(new Date(date));
  let newDate = format(new Date(date), "yyyy-MM-dd");
  console.log(newDate);
  //   let newDate = format(new Date(date), "yyyy-MM-dd");
  console.log(typeof newDate);

  const getTodoByTodoId = `
                SELECT * FROM todo WHERE due_date = "${newDate}"
                ;`;
  const dbResponse = await db.all(getTodoByTodoId);
  response.send(dbResponse);
});

//API 4: CREATE TODOS
app.post("/todos/", validateBody, async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const createTodoQuery = `
        INSERT INTO todo (id,todo,priority,status,category,due_date)
        VALUES ( ${id},"${todo}","${priority}","${status}", "${category}", "${dueDate}" );`;
  const dbResponse = await db.run(createTodoQuery);
  response.send("Todo Successfully Added");
});

//APi 4: UPDATE TODO BY ID
app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const getTodoByTodoId = `
            SELECT * FROM todo WHERE id = ${todoId}
            ;`;
  const previousTodo = await db.get(getTodoByTodoId);
  const {
    priority = previousTodo.priority,
    status = previousTodo.status,
    todo = previousTodo.todo,
    category = previousTodo.category,
    dueDate = previousTodo.due_date,
  } = request.body;
  const updateTodoQuery = `
        UPDATE todo 
        SET 
            todo = '${todo}',
            status = '${status}',
            priority = '${priority}',
            category = '${category}',
            due_date = '${dueDate}'
        WHERE id = ${todoId};`;
  const dbResponse = await db.run(updateTodoQuery);
  if (request.body.status !== undefined) {
    response.send("Status Updated");
  } else if (request.body.todo !== undefined) {
    response.send("Todo Updated");
  } else if (request.body.priority !== undefined) {
    response.send("Priority Updated");
  } else if (request.body.category !== undefined) {
    response.send("Category Updated");
  } else if (request.body.dueDate !== undefined) {
    response.send("Due Date Updated");
  }
});

//API 5: DELETE TODO BY ID
app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
            DELETE FROM todo WHERE id = ${todoId};`;
  const dbResponse = await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
