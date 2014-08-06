import os
import glob
import yaml

from flask import Flask, render_template, request, jsonify

import pbclient


def get_project_templates():
    tpls = {}

    for fname in glob.glob(os.path.join(os.path.dirname(__file__), 'project_tpls', '*.yaml')):
        with open(fname, 'r') as f:
            name = os.path.basename(fname)[:-5]
            data = yaml.load(f)
            tpls[name] = data

    return tpls

app = Flask(__name__)
templates = get_project_templates()


@app.route("/")
def index():
    return render_template('editor.html', templates=templates)


@app.route("/templates/<name>/", methods=["GET"])
def get_templates(name):
    tpl_content = templates.get(name)

    if tpl_content is None:
        return 'No such template found', 404

    return jsonify(tpl_content)


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

    for task in pbclient.find_tasks(app.id):
        pbclient.delete_task(task.id)

    for task in data['tasks']:
        pbclient.create_task(app.id, task)

    pbclient.update_app(app)

    return '', 200
