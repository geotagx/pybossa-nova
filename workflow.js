var Workflow = function(data) {

  data = data || {};

  function add_step(step_id, step_data) {
    data[step_id] = step_data;
    data[step_id].step_id = step_id;
  }

  return {
    add_step: add_step,
    data: data
  }
};
