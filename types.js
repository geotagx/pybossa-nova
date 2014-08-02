var QuestionType = function(type) {
  var render_edit = function(data, steps) {
    console.log(data)
    data.steps = steps;
    data.type = type;
    return $(nunjucks.render('templates/edit/' + type + '.html', data));
  }

  var render_view = function(data) {
    return $(nunjucks.render('templates/view/' + type + '.html', data));
  }

  return {
    render_edit: render_edit,
    render_view: render_view
  }
}
