var bossa_editor = angular.module('bossa-editor', []);

function getter_setter(etype) {
  return function ($rootScope) {
    var storage = function() {
      var list = [];

      this.get = function(idx) {
        if (idx === undefined) {
          return list;
        } else {
          return list[idx];
        }
      };
      this.set = function(arg, val) {
        if (val === undefined) {
          list = arg;
        } else {
          list[arg] = val;
        }

        $rootScope.$broadcast(etype + '-set');
      };
      this.push = list.push;
      this.splice = list.splice;
    };

    return new storage();
  };
};

bossa_editor.factory('steps', ['$rootScope', getter_setter('step')]);
bossa_editor.factory('tasks', ['$rootScope', getter_setter('task')]);

bossa_editor.controller('StepEditor', function ($scope, steps) {

    $scope.steps = steps.get();

    $scope.$on('step-set', function() {
      $scope.steps = steps.get();
      $scope.$apply();
    })

    // TODO: Better solution? $includeContentLoaded is called MANY times
    $scope.$on('$includeContentLoaded', function(event) {
      $('#send-server').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        $(this).find('.message-success').hide();
        $(this).find('.btn-success').removeAttr('disabled');
        $(this).removeData();
      });
    });

    $scope.get_include = function(step) {
        return 'static/partials/' + step.type + '.html';
    };

    $scope.save = function(step) {
        step.editing = false;
    };

    $scope.edit = function(step) {
        step.old_step = angular.extend({}, step);
        step.editing = true;
    };

    $scope.cancel = function(idx) {
        var old_step = steps.get(idx).old_step;
        if (old_step) {
            steps.set(idx, old_step);
        } else {
            $scope.delete(idx);
        }
    };

    $scope.delete = function(idx) {
        $scope.steps.splice(idx, 1);
    };

    $scope.add_step = function(type) {
        var new_data = {
            editing: true,
            type: type
        };

        if (type == 'multiple') {
            new_data.options = [];
        }

        $scope.steps.push(new_data);
    };

    $scope.remove_option = function(step, idx) {
        step.options.splice(idx, 1);
    };

    $scope.add_option = function(step, option_text) {
        step.options.push(option_text);
    };

});

bossa_editor.controller('TaskEditor', function ($scope, tasks) {

  $scope.tasks = tasks.get();

  $scope.$on('task-set', function() {
    $scope.tasks = tasks.get();
    $scope.$apply();
  })

  $scope.add_task = function(url) {
      var new_data = {
        img_url: url
      };

      $scope.tasks.push(new_data);
  };

  $scope.remove_task = function(idx) {
      $scope.tasks.splice(idx, 1);
  };
});

function remove_angular_vars(data) {

  return data.map(function(elem) {
    var ret = {};

    angular.forEach(elem, function(value, key) {
      if (key[0] != '$') {
        ret[key] = value;
      }
    });

    return ret;
  });
}

bossa_editor.controller('DataManager', function ($scope, steps, tasks) {
  $scope.download_json = function() {

    var data = {
      steps: remove_angular_vars(steps.get()),
      tasks: remove_angular_vars(tasks.get())
    };

    window.open("data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)));

    return data;
  };

  $scope.load_template = function(tpl_name) {
    $.get('/templates/' + tpl_name).done(function(result) {
      steps.set(result.steps);
      tasks.set(result.tasks);
    })
  };
});

bossa_editor.controller('SendModal', function ($scope, steps, tasks) {

  $scope.send_to_server = function() {
    var data = {
      steps: remove_angular_vars(steps.get()),
      tasks: remove_angular_vars(tasks.get())
    };

    $('#send-server .btn-success').attr('disabled', 'disabled');

    $.ajax('/send-data/', {
            type: 'PUT',
            data: JSON.stringify({
              data: data,
              server_url: $scope.server_url,
              project_name: $scope.project_name,
              api_key: $scope.api_key
            }),
            contentType: 'application/json'
    }).done(function() {
      $('#send-server .message-success').show();
    });
  };
});
