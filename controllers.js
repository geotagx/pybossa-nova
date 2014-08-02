var bossa_editor = angular.module('bossa-editor', []);

bossa_editor.controller('StepEditor', function ($scope) {

    $scope.steps = [{
        id: 'step1',
        type: 'yesno',
        text: 'Is there a Pokemon in this picture?',
        then_step: 'step2',
        else_step: 'end'
    }, {
        id: 'step2',
        type: 'yesno',
        text: 'Is it a water Pokemon?',
        then_step: 'end',
        else_step: 'end'
    }];

    $scope.get_include = function(step) {
        return 'partials/' + step.type + '.html';
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
        $scope.steps.push({
            editing: true,
            type: type
        })
    }

});
