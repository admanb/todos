var todosApp = angular.module('todosApp', []);

todosApp.controller('TodosController', function TodosController($scope, $http) {
    var scope = $scope;
    $scope.todos = [];
    $scope.newTodo = { task: "", dueDate: "", details: "", updating: true };

    $scope.activeTodos = function () {
        return $scope.todos.filter(function (todo) {
            return !todo.completed;
        })
    }

    $scope.completedTodos = function () {
        return $scope.todos.filter(function (todo) {
            return todo.completed;
        })
    }

    $scope.toggleExpand = function (todo) {
        todo.showDetails = !todo.showDetails;
    }

    $scope.isPastDue = function (dueDate) {
        return moment() > dueDate;
    }

    $scope.getTodos = function () {
        $http.get("/api/todos").then(function (response) {
            $scope.todos = response.data.map(function (todo) {
                todo.dueDate = moment(todo.dueDate);
                return todo;
            });
        });
    }

    $scope.deleteTodo = function (id) {
        var todo = $scope.todos.find(function (todo) {
            return todo.id == id;
        });
        todo.updating = true;

        $http.delete("/api/todos/" + id).then(function () {
            $scope.getTodos();
        });
    }

    $scope.createTodo = function () {
        $scope.todos.push($scope.newTodo);

        $http.post("/api/todos", $scope.newTodo).then(function () {
            $scope.newTodo = { task: "", dueDate: "", details: "", updating: true };
            $scope.getTodos();
        }, function (response) {
            $scope.todos.pop(scope.newTodo);
            if (response.data.modelState) {
                $scope.newTodo.hasTaskError = response.data.modelState["todo.Task"] ? true : false;
                $scope.newTodo.hasDueDateError = response.data.modelState["todo.dueDate"] ? true : false;
            }
        });
    }

    $scope.completeTodo = function (id) {
        var todo = $scope.todos.find(function (todo) {
            return todo.id == id;
        });
        todo.updating = true;

        $http.put("/api/todos/" + id).then(function () {
            $scope.getTodos();
        });
    }

    $scope.getTodos();
});