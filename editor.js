var Editor = function(workflow, $widget) {
  var self = this;

  function initialize($widget) {
    $widget.find('#add-yesno').click(function() {
      add_node('yesno');
    });
  }

  function redraw_all() {
    $.each(workflow.data, function(step_id, data) {
      var content = render_node('view', data);
      $widget.find('.questions').append(content);
    });
  }

  function save_field($elem) {
    var step_id = $elem.find('[data-attr=step_id]').val();

    if (step_id) {
      var data = workflow.data[step_id];

      if (data === undefined) {
        workflow.data[step_id] = data = {};
      }

      $elem.find('[data-attr]').each(function(i, field){
        data[$(field).data('attr')] = $(this).val();
      });

      data.type = $elem.find('.content').data('type');
      $elem.replaceWith(render_node('view', data));
    } else {
      alert('No step id!')
    }
  }

  function bind_actions(view, $elem) {
    if (view == 'edit') {
      $elem.find('.save-question').click(function() {
        save_field($(this).closest('li'));
      });
    } else {
      $elem.find('.edit-question').click(function() {
        edit_field($(this).closest('li'), workflow.data[$(this).attr('data-step-id')]);
      });
      $elem.find('.remove-question').click(function() {
        remove_field($(this).closest('li'), $(this).attr('data-step-id'));
      });
    }
  }

  function render_node(view, data) {
    var type = QuestionType(data.type),
        content = type['render_' + view](data, _(workflow.data).keys());

    bind_actions(view, content);
    return content;
  }

  function edit_field($elem, data) {
    var content = render_node('edit', data);
    $elem.replaceWith(content);
  }

  function remove_field($elem, field_id) {
    delete workflow.data[field_id];
    $elem.remove();
  }

  function add_node(type) {
    var $elem = render_node('edit', {
      type: type,
      next_step: 'end'
    });
    $widget.find('.questions').append($elem);
  }

  initialize($widget);

  return {
    redraw_all: redraw_all
  }
};
