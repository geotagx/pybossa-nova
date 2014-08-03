from flask import Flask, render_template, request
import pbclient

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('editor.html')


@app.route("/send-data/", methods=["PUT"])
def send_data():
    api_key = request.json.get('api_key')
    server_url = request.json.get('server_url')
    data = request.json.get('data')
    project_name = request.json.get('project_name')

    tpl_presenter = render_template('presenter.html',
                                    steps=data['steps'],
                                    project_name=project_name)

    pbclient.set('endpoint', server_url)
    pbclient.set('api_key', api_key)

    # TODO: check error
    app = pbclient.find_app(short_name=project_name)[0]
    app.info['task_presenter'] = tpl_presenter

    for task in data['tasks']:
        print(task)
        pbclient.create_task(app.id, task)

    pbclient.update_app(app)

    return '', 200
