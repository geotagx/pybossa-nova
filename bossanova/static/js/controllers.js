var bossa_editor = angular.module('bossa-editor', []);

bossa_editor.factory('Steps', function() {
  return TEMPLATES.animals.steps;
})

bossa_editor.factory('Tasks', function() {
  return TEMPLATES.animals.tasks;
});

bossa_editor.controller('StepEditor', function ($scope, Steps) {

    $scope.steps = Steps;

    $scope.get_include = function(step) {
        return 'static/partials/' + step.type + '.html';
    }

    $scope.save = function(step) {
        step.editing = false;
        //$scope.apply();
    }

    $scope.edit = function(step) {
        step.old_step = angular.extend({}, step);
        step.editing = true;
    }

    $scope.cancel = function(idx) {
        var old_step = $scope.steps[idx].old_step;
        if (old_step) {
            $scope.steps[idx] = $scope.steps[idx].old_step;
        } else {
            $scope.delete(idx);
        }
    }

    $scope.delete = function(idx) {
        $scope.steps.splice(idx, 1);
    }

    $scope.add_step = function(type) {
        var new_data = {
            editing: true,
            type: type
        };

        if (type == 'multiple') {
            new_data.options = [];
        }

        $scope.steps.push(new_data);
    }

    $scope.remove_option = function(step, idx) {
        step.options.splice(idx, 1);
    }

    $scope.add_option = function(step, option_text) {
        step.options.push(option_text);
    }

});

bossa_editor.controller('TaskEditor', function ($scope, Tasks) {

  $scope.tasks = Tasks;

  $scope.add_task = function(url) {
      var new_data = {
        img_url: url
      };

      $scope.tasks.push(new_data);
  }

  $scope.remove_task = function(idx) {
      $scope.tasks.splice(idx, 1);
  }
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
  })
}

bossa_editor.controller('DataManager', function ($scope, Steps, Tasks) {
  $scope.download_json = function() {

    var data = {
      steps: remove_angular_vars(Steps),
      tasks: remove_angular_vars(Tasks)
    }

    window.open("data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)))

    return data;
  }
});


bossa_editor.controller('SendModal', function ($scope, Steps, Tasks) {

  $scope.send_to_server = function() {
    var data = {
      steps: remove_angular_vars(Steps),
      tasks: remove_angular_vars(Tasks)
    }

    $('#send-server .btn-success').attr('disabled', 'disabled')

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
  }
});
