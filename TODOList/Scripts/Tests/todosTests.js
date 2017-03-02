describe('TodosController', function () {
    beforeEach(module('todosApp'));
    
    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('basic scope functions', function () {
        var $scope, controller;
        beforeEach(function () {
            $scope = {};
            controller = $controller('TodosController', { $scope: $scope });
        });
        it('initializes variables', function () {
            expect($scope.todos).toEqual([]);
            expect($scope.newTodo).toEqual({ task: "", dueDate: "", details: "", updating: true });
        });

        it('toggles a todo expand state', function () {
            var todo = { showDetails: false };
            $scope.toggleExpand(todo);
            expect(todo.showDetails).toEqual(true);
            $scope.toggleExpand(todo);
            expect(todo.showDetails).toEqual(false);
        });

        it('validates whether a date is past due', function () {
            var dueDate = moment().subtract(1, 'days');
            expect($scope.isPastDue(dueDate)).toEqual(true);
            dueDate = moment().add(1, 'days');
            expect($scope.isPastDue(dueDate)).toEqual(false);
        });
    });

    describe('todo count functions', function () {
        var $scope, controller;
        beforeEach(function () {
            $scope = {};
            controller = $controller('TodosController', { $scope: $scope });

            $scope.todos = [
                { completed: false },
                { completed: true },
                { completed: false }
            ]
        });

        it('returns two active todos', function () {
            expect($scope.activeTodos().length).toEqual(2);
        });

        it('returns one completed todo', function () {
            expect($scope.completedTodos().length).toEqual(1);
        });
    });

    describe('calls to backend', function () {
        var $scope, controller, $httpBackend;
        beforeEach(inject(function($injector) {
            $scope = {};
            controller = $controller('TodosController', { $scope: $scope });
            $httpBackend = $injector.get('$httpBackend');
            
            var getRequestHandler = $httpBackend.when('GET', '/api/todos').respond(200,
                [
                        { completed: false },
                        { completed: true },
                        { completed: false }
                ]);
            // flushing early clears out the initializing call to $scope.todos so we can set test data
            $httpBackend.flush();
            $scope.todos = [
                { id: 1, updating: false }
            ]
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('getTodos makes a call to /api/todos', function () { 
            $httpBackend.expectGET('/api/todos');
            $scope.getTodos();
            $httpBackend.flush();
            expect($scope.todos.length).toEqual(3);
        });

        it('deleteTodo sets todo updating and calls the api', function () {
            spyOn($scope, 'getTodos').and.returnValue('');
            var deleteHandler = $httpBackend.when('DELETE', '/api/todos/1').respond(204, '');
            $httpBackend.expectDELETE('/api/todos/1');

            $scope.deleteTodo(1);
            expect($scope.todos[0].updating).toEqual(true);
            $httpBackend.flush();
            expect($scope.getTodos).toHaveBeenCalled();
        });

        it('completeTodo sets todo updating and calls the api', function () {
            spyOn($scope, 'getTodos').and.returnValue('');
            var putHandler = $httpBackend.when('PUT', '/api/todos/1').respond(204, '');
            $httpBackend.expectPUT('/api/todos/1');

            $scope.completeTodo(1);
            expect($scope.todos[0].updating).toEqual(true);
            $httpBackend.flush();
            expect($scope.getTodos).toHaveBeenCalled();
        });

        it('createTodo creates a new temporary todo and calls the api', function () {
            $scope.newTodo = { task: "A Task", dueDate: "9/21/2016", details: "Some details" };
            spyOn($scope, 'getTodos').and.returnValue('');
            var postHandler = $httpBackend.when('POST', '/api/todos').respond(200, '');
            $httpBackend.expectPOST('/api/todos', $scope.newTodo);

            $scope.createTodo();
            expect($scope.todos.length).toEqual(2);
            $httpBackend.flush();
            expect($scope.getTodos).toHaveBeenCalled();
            expect($scope.newTodo).toEqual({ task: "", dueDate: "", details: "", updating: true });
        });

        it('createTodo handles error responses and sets model state', function () {
            $scope.newTodo = { task: "", dueDate: "9/21/2016", details: "Some details" };
            var postHandler = $httpBackend.when('POST', '/api/todos').respond(400, {
                "modelState": {
                    "todo.dueDate": ["Error in due date"],
                    "todo.Task": ["Error in task"]
                }
            });
            $httpBackend.expectPOST("/api/todos", $scope.newTodo);

            $scope.createTodo();
            expect($scope.todos.length).toEqual(2);
            $httpBackend.flush();
            expect($scope.todos.length).toEqual(1);
            expect($scope.newTodo.hasTaskError).toEqual(true);
            expect($scope.newTodo.hasDueDateError).toEqual(true);
        });
    })
});