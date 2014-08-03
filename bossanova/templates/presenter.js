var STEPS = {{ steps | tojson | safe }};
var GRAPH = {};

function loadUserProgress() {
    pybossa.userProgress('{{ project_name }}').done(function(data){
        var pct = Math.round((data.done*100)/data.total);
        $("#progress").css("width", pct.toString() +"%");
        $("#progress").attr("title", pct.toString() + "% completed!");
        $("#progress").tooltip({'placement': 'left'});
        $("#total").text(data.total);
        $("#done").text(data.done);
    });
}

pybossa.taskLoaded(function(task, deferred) {
    if ( !$.isEmptyObject(task) ) {
        var img = $('<img />');
        img.load(function() {
            deferred.resolve(task);
        });
        img.attr('src', task.info.img_url).css('max-height', 460);
        img.addClass('img-thumbnail img-responsive');
        task.info.image = img;
    }
    else {
        deferred.resolve(task);
    }
});

pybossa.presentTask(function(task, deferred) {

    var referenced = {},
        keys = [],
        first = null,
        answer = {};
    GRAPH = {};

    $.each(STEPS, function(key, data) {
      referenced[data.then_step] = true;
      referenced[data.else_step] = true;
      keys.push(data.id);
      GRAPH[data.id] = data;
    });

    for (i in keys) {
      var key = keys[i];
      if (!referenced[key]) {
        first = key;
      }
    }

    if ( !$.isEmptyObject(task) ) {
        loadUserProgress();
        clearPreviousTask();
        $('#photo-link').html('').append(task.info.image);
        $("#photo-link").attr("href", task.info.img_url);
        $('#task-id').html(task.id);

        show_step(task.id, answer, first, deferred);

        $("#loading").hide();
    }
    else {
        $(".skeleton").hide();
        $("#loading").hide();
        $("#finish").fadeIn(500);
    }
});

function show_step(task_id, answer, step_id, deferred) {
  var step = GRAPH[step_id]

  if (step_id == 'end') {
    pybossa.saveTask(task_id, answer).done(function() {
                    console.log(answer)
                    deferred.resolve();
                });
  }

  $('#question').text(step.text);
  $('#answer .question-tpl').hide();
  $('#answer .question-tpl.' + step.type).show();

  if (step.type == 'yesno') {

    $('#answer .yesno .btn-answer').off('click').click(function() {
      if ($(this).val() == 'yes') {
        show_step(task_id, answer, step.then_step, deferred);
      } else {
        show_step(task_id, answer, step.else_step, deferred);
      }
      answer[step_id] = $(this).val();
    })

  } else if (step.type == 'multiple') {
      $('#answer .multiple').html('');
      for (i in step.options) {
        var option = step.options[i];
        $('#answer .multiple').append($('<button class="btn btn-info btn-answer"/>')
            .text(option).val(option));
      }

      $('#answer .multiple .btn-answer').off('click').click(function() {
        answer[step_id] = $(this).val();
        show_step(task_id, answer, step.then_step, deferred);
      })
  } else if (step.type == 'freetext') {
    $('#answer .freetext textarea').html('');

    $('#answer .freetext .btn-answer').off('click').click(function() {
      answer[step_id] = $(this).siblings('textarea').val();
      show_step(task_id, answer, step.then_step, deferred);
    })
  }
}

function clearPreviousTask() {
    $('.animal').each(function() {
        $(this).remove();
    });
    $('#inputName').val('');
    $('#inputNumber').val(0);
}

pybossa.run('{{ project_name }}');
