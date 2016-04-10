<tr>
    <td>{{ vhost.name }}</td>
    <td><a target="_blank" href="http://{{ vhost.url }}">http://{{ vhost.url }}</a></td>
    <td>{{ vhost.documentRoot }}/{{ vhost.directoryIndex }} {{ vhost.documentRoot|exists }}</td>
    <td class="action_links">
        {% if vhost.ignored %}
            <a href="/unignore/{{ vhost._id|raw }}" title="Unignore"><i class="fa fa-eye teal-text text-lighten-3"></i></a>
        {% else %}
            <a href="/ignore/{{ vhost._id|raw }}" title="Ignore"><i class="fa fa-eye-slash red-text text-lighten-3"></i></a>
        {% endif %}
        <a href="/edit/{{ vhost._id|raw }}" title="Edit">
            <i class="fa fa-pencil teal-text text-lighten-3"></i>
        </a>
        <a data-vhost-id="{{ vhost._id|raw }}" href="#" title="Delete" class="delete-link">
            <i class="fa fa-trash red-text text-lighten-3"></i>
        </a>
    </td>
</tr>