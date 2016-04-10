{% extends "layout.html.swig" %}

{% block page_title %}
    <div class="row">
        <div class="col s8">
            <h4 class="teal-text text-darken-4">
                {{ title }} {{ vhost.name }}
            </h4>
        </div>
    </div>
{% endblock %}


{% block content %}
    <div class="row">
        <form class="col s12" action="" method="post">
            <div class="row">
                <div class="input-field col s12">
                    <input id="nom" type="text" value="{{ vhost.name }}" name="name">
                    <label for="nom">Nom</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input id="url" type="text" name="url" value="{{ vhost.url }}">
                    <label for="url">URL</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s6">
                    <input id="documentRoot" type="text" value="{{ vhost.documentRoot }}" name="documentRoot">
                    <label for="documentRoot">Document Root</label>
                </div>
                <div class="input-field col s6">
                    <input value="{{ vhost.directoryIndex }}" id="directoryIndex" type="text" name="directoryIndex">
                    <label for="directoryIndex">Directory Index</label>
                </div>
            </div>
            <div class="row">
                <div class="col s1">
                    <a href="/" class="btn btn-flat yellow darken-2 white-text">Annuler</a>
                </div>
                <div class="col s1 right">
                    <input type="submit" class="btn btn-flat teal white-text" value="Valider" />
                </div>
            </div>
        </form>
    </div>
{% endblock %}
