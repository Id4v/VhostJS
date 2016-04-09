{% block content %}
    <table class="bordered z-depth-2 highlight">
        <thead>
        <tr>
            <th>Nom</th>
            <th>Url</th>
            <th>Chemin</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {% for vhost in vhosts %}
            {% include "blocks/_inner_row.html.swig" with vhost only %}
        {% endfor %}
        </tbody>
    </table>
{% endblock %}

