<tr>
    <td>{{ name }}</td>
    <td><a target="_blank" href="http://{{ url }}">http://{{ url }}</a></td>
    <td>{{ documentRoot }} {{ documentRoot|exists }}</td>
    <td class="action_links">
        {% if ignored %}
            <a href="/unignore/{{ _id|raw }}" title="Unignore"><i class="fa fa-eye teal-text text-lighten-3"></i></a>
        {% else %}
            <a href="/ignore/{{ _id|raw }}" title="Ignore"><i class="fa fa-eye-slash red-text text-lighten-3"></i></a>
        {% endif %}
        <a href="" title="Edit">
            <i class="fa fa-pencil teal-text text-lighten-3"></i>
        </a>
        <a data-vhost-id="{{ _id|raw }}" href="#" title="Delete" class="delete-link">
            <i class="fa fa-trash red-text text-lighten-3"></i>
        </a>
    </td>
</tr>