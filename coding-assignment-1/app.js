// const express = require("express");
// const path = require("path");
// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3");
// const format = require("date-fns/format");
// const isValid = require("date-fns/isValid");
// const app = express();
// app.use(express.json());
// const dbPath = path.join(__dirname, "todoApplication.db");

// let db = null;

// const initializeDBAndServer = async () => {
//   try {
//     db = await open({
//       filename: dbPath,
//       driver: sqlite3.Database,
//     });
//     app.listen(3001, () => {
//       console.log("Server Running at http://localhost:3001/");
//     });
//   } catch (e) {
//     console.log(`DB Error: ${e.message}`);
//     process.exit(1);
//   }
// };
// initializeDBAndServer();

// const validateData = async (request, response, next) => {
//   const {
//     status = "",
//     priority = "",
//     category = "",
//     due_date = "",
//     search_q = "",
//     date = "",
//   } = request.query;
//   priority_list = ["HIGH", "MEDIUM", "LOW", ""];
//   status_list = ["TO DO", "IN PROGRESS", "DONE", ""];
//   category_list = ["WORK", "HOME", "LEARNING", ""];
//   if (!status_list.includes(status)) {
//     response.status(400);
//     response.send("Invalid Todo Status");
//   } else if (!priority_list.includes(priority)) {
//     response.status(400);
//     response.send("Invalid Todo Priority");
//   } else if (!category_list.includes(category)) {
//     response.status(400);
//     response.send("Invalid Todo Category");
//   } else if (date !== "") {
//     if (!isValid(new Date(date))) {
//       response.status(400);
//       response.send("Invalid Due Date");
//     }
//   } else {
//     next();
//   }
// };

// const validateBody = (request, response, next) => {
//   const {
//     status = "",
//     priority = "",
//     category = "",
//     dueDate = "",
//   } = request.body;
//   priority_list = ["HIGH", "MEDIUM", "LOW"];
//   status_list = ["TO DO", "IN PROGRESS", "DONE"];
//   category_list = ["WORK", "HOME", "LEARNING"];

//   if (!status_list.includes(status)) {
//     response.status(400);
//     response.send("Invalid Todo Status");
//   } else if (!priority_list.includes(priority)) {
//     response.status(400);
//     response.send("Invalid Todo Priority");
//   } else if (!category_list.includes(category)) {
//     response.status(400);
//     response.send("Invalid Todo Category");
//   } else if (dueDate !== "") {
//     if (!isValid(new Date(dueDate))) {
//       response.status(400);
//       response.send("Invalid Due Date");
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// };

// // API 1: GET TODOS BY STATUS
// app.get("/todos/", validateData, async (request, response) => {
//   const {
//     search_q = "",
//     status = "",
//     priority = "",
//     category = "",
//   } = request.query;
//   console.log(request.query);
//   const getTodoByQuery = `
//             SELECT * FROM todo
//             WHERE
//                 status LIKE "%${status}%" AND
//                 priority LIKE "%${priority}%" AND
//                 todo LIKE "%${search_q}%" AND
//                 category LIKE "${category}%"
//             ORDER BY id;`;
//   const dbResponse = await db.all(getTodoByQuery);
//   console.log("passed this");
//   response.send(dbResponse);
// });

// // API 2: GET TODOS BY TODO ID
// app.get("/todos/:todoId/", async (request, response) => {
//   const { todoId } = request.params;

//   const getTodoByTodoId = `
//               SELECT * FROM todo WHERE id = ${todoId}
//               ;`;
//   const dbResponse = await db.get(getTodoByTodoId);
//   response.send(dbResponse);
// });

// //API 3:GET TODOS BY AGENDA
// app.get("/agenda/", async (request, response) => {
//   let { date } = request.query;
//   //   date = "20222-3-5";
//   //   console.log(date);
//   console.log(new Date(date));
//   let newDate = format(new Date(date), "yyyy-MM-dd");
//   console.log(newDate);
//   //   let newDate = format(new Date(date), "yyyy-MM-dd");
//   console.log(typeof newDate);

//   const getTodoByTodoId = `
//                 SELECT * FROM todo WHERE due_date = "${newDate}"
//                 ;`;
//   const dbResponse = await db.all(getTodoByTodoId);
//   response.send(dbResponse);
// });

// //API 4: CREATE TODOS
// app.post("/todos/", validateBody, async (request, response) => {
//   const { id, todo, priority, status, category, dueDate } = request.body;
//   const createTodoQuery = `
//         INSERT INTO todo (id,todo,priority,status,category,due_date)
//         VALUES ( ${id},"${todo}","${priority}","${status}", "${category}", "${dueDate}" );`;
//   const dbResponse = await db.run(createTodoQuery);
//   response.send("Todo Successfully Added");
// });

// //APi 4: UPDATE TODO BY ID
// app.put("/todos/:todoId", async (request, response) => {
//   const { todoId } = request.params;
//   const getTodoByTodoId = `
//             SELECT * FROM todo WHERE id = ${todoId}
//             ;`;
//   const previousTodo = await db.get(getTodoByTodoId);
//   const {
//     priority = previousTodo.priority,
//     status = previousTodo.status,
//     todo = previousTodo.todo,
//     category = previousTodo.category,
//     dueDate = previousTodo.due_date,
//   } = request.body;
//   const updateTodoQuery = `
//         UPDATE todo
//         SET
//             todo = '${todo}',
//             status = '${status}',
//             priority = '${priority}',
//             category = '${category}',
//             due_date = '${dueDate}'
//         WHERE id = ${todoId};`;
//   const dbResponse = await db.run(updateTodoQuery);
//   if (request.body.status !== undefined) {
//     response.send("Status Updated");
//   } else if (request.body.todo !== undefined) {
//     response.send("Todo Updated");
//   } else if (request.body.priority !== undefined) {
//     response.send("Priority Updated");
//   } else if (request.body.category !== undefined) {
//     response.send("Category Updated");
//   } else if (request.body.dueDate !== undefined) {
//     response.send("Due Date Updated");
//   }
// });

// //API 5: DELETE TODO BY ID
// app.delete("/todos/:todoId", async (request, response) => {
//   const { todoId } = request.params;
//   const deleteTodoQuery = `
//             DELETE FROM todo WHERE id = ${todoId};`;
//   const dbResponse = await db.run(deleteTodoQuery);
//   response.send("Todo Deleted");
// });

// module.exports = app;

// Import modules
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");

const app = express();
app.use(express.json());

const port = 3000;
dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
// Server initialization
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(port, () =>
      console.log("Server Listening at http://localhost:3000")
    );
  } catch (err) {
    console.log(`DB error: ${err.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

// GET API 1: Returns data based on the query parameters.
app.get("/todos/", async (req, res) => {
  const {
    status = "",
    priority = "",
    search_q = "",
    category = "",
  } = req.query;

  if (
    !(
      status === "" ||
      status === "TO DO" ||
      status === "IN PROGRESS" ||
      status === "DONE"
    )
  ) {
    res.status(400);
    res.send("Invalid Todo Status");
  } else if (
    !(
      priority === "" ||
      priority === "HIGH" ||
      priority === "MEDIUM" ||
      priority === "LOW"
    )
  ) {
    res.status(400);
    res.send("Invalid Todo Priority");
  } else if (
    !(
      category === "" ||
      category === "WORK" ||
      category === "HOME" ||
      category === "LEARNING"
    )
  ) {
    res.status(400);
    res.send("Invalid Todo Category");
  } else {
    const getTodoQuery = `
          SELECT
            id,
            todo,
            priority,
            status,
            category,
            due_date AS dueDate
          FROM
            todo
          WHERE
            status LIKE "%${status}%"
            AND priority LIKE "%${priority}%"
            AND todo LIKE "%${search_q}%"
            AND category LIKE "%${category}";`;

    const todoArray = await db.all(getTodoQuery);
    res.send(todoArray);
  }
});

// GET API 2: Based on specific id.
app.get("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;

  const getTodoQuery = `
    SELECT
      id,
      todo,
      priority,
      status,
      category,
      due_date AS dueDate
    FROM
      todo
    WHERE
      id = ${todoId};`;

  const todoObj = await db.get(getTodoQuery);
  res.send(todoObj);
});

// GET API 2: Based on due_date.
app.get("/agenda/", async (req, res) => {
  const dueDate = req.query.date;
  const splitDueDate = dueDate
    .split("-")
    .map((forEachEl) => parseInt(forEachEl));
  let [year, month, date] = splitDueDate;

  if (isValid(new Date(year, month, date))) {
    // If date is valid
    const formattedDate = format(new Date(year, month - 1, date), "yyyy-MM-dd");
    const getTodoQuery = `
			SELECT
				id,
				todo,
				priority,
				status,
				category,
				due_date AS dueDate
			FROM
				todo
			WHERE
				due_date = "${formattedDate}";`;

    const todoArray = await db.all(getTodoQuery);
    res.send(todoArray);
  } else {
    res.status(400);
    res.send("Invalid Due Date");
  }
});

// POST API 3: Adds new rows into the db as per the req body.
app.post("/todos/", async (request, response) => {
  let todoDetails = request.body;
  const { id, todo, priority, status, category, dueDate } = todoDetails;

  const splitDueDate = dueDate
    .split("-")
    .map((forEachEl) => parseInt(forEachEl));
  let [year, month, date] = splitDueDate;

  if (!(status === "TO DO" || status === "IN PROGRESS" || status === "DONE")) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (
    !(priority === "HIGH" || priority === "MEDIUM" || priority === "LOW")
  ) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (
    !(category === "WORK" || category === "HOME" || category === "LEARNING")
  ) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (!isValid(new Date(year, month, date))) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    const formattedDate = format(new Date(year, month - 1, date), "yyyy-MM-dd");
    const postTodoQuery = `
				INSERT INTO
					todo (id, todo, priority, status, category, due_date)
				VALUES
					(${id}, "${todo}", "${priority}", "${status}", "${category}", "${formattedDate}");`;
    await db.run(postTodoQuery);
    response.send("Todo Successfully Added");
  }
});

// PUT API 4: Updates data in db as per the query parameters.
app.put("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;

  const getPreviousQuery = `
      SELECT
        *
      FROM
        todo
      WHERE
        id = ${todoId};`;
  const previousQuery = await db.get(getPreviousQuery);
  let {
    status = previousQuery.status,
    priority = previousQuery.priority,
    todo = previousQuery.todo,
    category = previousQuery.category,
    dueDate = previousQuery.due_date,
  } = req.body;

  const splitDueDate = dueDate
    .split("-")
    .map((forEachEl) => parseInt(forEachEl));
  let [year, month, date] = splitDueDate;

  if (!(status === "TO DO" || status === "IN PROGRESS" || status === "DONE")) {
    res.status(400);
    res.send("Invalid Todo Status");
  } else if (
    !(priority === "HIGH" || priority === "MEDIUM" || priority === "LOW")
  ) {
    res.status(400);
    res.send("Invalid Todo Priority");
  } else if (
    !(category === "WORK" || category === "HOME" || category === "LEARNING")
  ) {
    res.status(400);
    res.send("Invalid Todo Category");
  } else if (!isValid(new Date(year, month, date))) {
    res.status(400);
    res.send("Invalid Due Date");
  } else {
    const updateTodoQuery = `
					UPDATE
						todo
					SET
						status = "${status}",
						priority = "${priority}",
						todo = "${todo}",
						category = "${category}",
						due_date = "${dueDate}"
					WHERE
						id = ${todoId};`;
    await db.run(updateTodoQuery);

    if (status !== previousQuery.status) {
      res.send("Status Updated");
    } else if (priority !== previousQuery.priority) {
      res.send("Priority Updated");
    } else if (todo !== previousQuery.todo) {
      res.send("Todo Updated");
    } else if (category !== previousQuery.category) {
      res.send("Category Updated");
    } else if (dueDate !== previousQuery.due_date) {
      res.send("Due Date Updated");
    }
  }
});

// DELETE API 5: Deletes data in db as per the specified id.
app.delete("/todos/:todoId/", async (req, res) => {
  const { todoId } = req.params;

  const deleteTodoQuery = `
        DELETE FROM
          todo
        WHERE
          id = ${todoId};`;
  await db.run(deleteTodoQuery);
  res.send("Todo Deleted");
});

module.exports = app;
