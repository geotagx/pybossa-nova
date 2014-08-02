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
        type: 'multiple',
        text: 'What kind of Pokemon is it?',
        options: ['Water', 'Earth', 'Fire', 'Stone', 'Chewing Gum'],
        then_step: 'end'
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
