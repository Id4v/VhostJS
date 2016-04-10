{% block content %}
    {% for vhost in vhosts %}
        {% include "blocks/_inner_row.html.swig" %}
    {% endfor %}
{% endblock %}

