import jsonServer from 'json-server';
import _ from 'lodash';
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')

const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

let tasks = db.data.tasks;
const server = jsonServer.create()
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(jsonServer.bodyParser)

// const task = searchTask('id', '56f09720-a87d-4984-92fd-c2c91fbac6c4', tasks);

function changeParentStatus(obj) {
  const parent = searchTask('id', obj.parent_id, tasks); 
  if(parent?.children.length > 0){
    const statusArr  = Object.entries(parent?.children).filter((item, index) => item[index].status === 'In progress');
    console.log();
    if(statusArr.length > 0) {
      return;
    } else {
      for (var i = 0; i < Object.entries(parent?.children).length; i++) {
        if(obj.children[i].status === "In progress" || obj.children[i].status === "Done" ){
          obj.children[i].status = "Complete";
        }
      }
      parent.status = "Complete";
      changeParentStatus(parent);
    }
  }
  db.write();
}

function changeChildStatus(obj) {
  console.log(obj, '---------------------------------------OBJETO------------------------------------------------------------')
  if(obj?.children && obj.children.length > 0){
    for (var i = 0; i < Object.entries(obj.children).length; i++) {
      // console.log(obj.children[i])
      if(obj.children[i].status === "In progress" || obj.children[i].status === "Done" ){
        obj.children[i].status = "Complete";
      } else {
        break;
      }
      changeChildStatus(obj.children[i]);
      obj.status = "Complete";
    }
  } else if(obj.children.length === 0){
    obj.status = "Complete";
  }
  db.write();
}
// changeChildStatus(task);
// changeParentStatus(task);

function searchTask(keySearch, findValue, currentNode) {
  let result;
  for (const [key, value] of Object.entries(currentNode)) {
    if (key == keySearch && value == findValue)  {
      return currentNode;
    }
    if (value !== null && typeof value === "object" || typeof value === "array") {
      result = searchTask(keySearch ,findValue, value);
      if (result) {
        return result;
      }
    }
  }
}
function getIdTitle(nodeList, targetPrimary, targetSecondary) {
  const stack = [...nodeList];
  const values = [];
  while (stack.length > 0) {
      const node = stack.shift();
      const item = {
        value: node[targetPrimary],
        label: node[targetSecondary]
      }
      values.push(item);
      if (!Array.isArray(node.children))
          continue;
      stack.unshift(...node.children);
  }

  return values;
}

function getPage(array, page, perPage) {
  const obj = {}
  const start = (page - 1) * perPage
  const end = page * perPage

  obj.items = array.slice(start, end)
  if (obj.items.length === 0) {
    return obj
  }

  if (page > 1) {
    obj.prev = page - 1
  }

  if (end < array.length) {
    obj.next = page + 1
  }

  if (obj.items.length !== array.length) {
    obj.current = page
    obj.first = 1
    obj.last = Math.ceil(array.length / perPage)
  }

  return obj
}

const paginateTasks = (req) => {
  let _page = req.query._page || 1;
  let _start = req.query._start || 0;
  let _limit = req.query._limit || 20;
  if(_page){
    _page = parseInt(_page, 10)
    _page = _page >= 1 ? _page : 1
    _limit = parseInt(_limit, 10) || 10
    const page = getPage(tasks, _page, _limit);
    tasks = _.chain(page.items);
  } else if (_limit) {
    _start = parseInt(_start, 10) || 0
    _limit = parseInt(_limit, 10)
    tasks = tasks.slice(_start, _start + _limit);
  }
}

server.post('/task/edit', (req, res) => {
  try {
    const { id, value } = req.body;
    const task = searchTask('id', id, tasks);
    changeChildStatus(task);
    changeParentStatus(task);
    paginateTasks(req);
    res.status(200).jsonp({tasks})
  } catch (error) {
    res.status(500).jsonp({message: 'Server error'})
  }
})

server.get('/tasks/select', (req, res) => {
  const select = getIdTitle(tasks, 'id', 'title');

  res.status(200).jsonp(select);
});

server.get('/tasks', (req, res) => {
  paginateTasks(req);
  res.status(200).jsonp({tasks});
});

server.post('/task', (req, res) => {
  const { parent_id, id } = req.body;
  const task = searchTask('parent_id', parent_id, tasks);
  console.log(!task, parent_id === '')
  if(parent_id === ''){
    tasks.push(req.body);
    db.write();
    paginateTasks()
    res.status(200).jsonp({status: 200, message: 'guardado exitoso', tasks});
    return;
  }
  if(taskExist){
    taskExist.children.push(req.body);
    db.write();
    paginateTasks();
    res.status(200).jsonp({
      status: 500,
      message: 'Guardado existoso',
      tasks
    })
    return;
  }
})

server.listen(3001, () => {
  console.log('JSON Server is running')
})
