{% extends "layout.html.swig" %}

{% block page_title %}
    <div id="delete-modal" class="modal modal-fixed-footer">
        <div class="modal-content">
            <h4>Suppression</h4>
            <p>Etes vous sûr de vouloir supprimer ce Vhost</p>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action waves-effect waves-red btn-flat" id="delete-modal-button">Oui</a>
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Non</a>
        </div>
    </div>

    <div class="row">
        <div class="col s8">
            <h4 class="teal-text text-darken-4">
                Vhosts List
            </h4>
        </div>
        <div class="col s4 right">
            <div class="switch">
                <span class="bigger spaced-right">Afficher les vhosts Ignorés</span>
                <label>
                    Off
                    <input type="checkbox" id="ignoredCheckbox" {% if ignored %}checked{% endif %}>
                    <span class="lever"></span>
                    On
                </label>
            </div>
        </div>
    </div>
{% endblock %}


{% block content %}
    <div class="row" id="list-content">
        <div class="col s12" id="table-vhosts">
            <table class="bordered z-depth-2 highlight">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Url</th>
                    <th>Chemin</th>
                    <th>Actions</th>
                </tr>
                {% include "blocks/_filters.html.swig" %}
                <tr id="loader">
                    <th colspan="4">
                        <div class="progress">
                            <div class="indeterminate"></div>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {% for vhost in vhosts %}
                    {% include "blocks/_inner_row.html.swig" %}
                {% endfor %}
                </tbody>
            </table>
        </div>
    </div>
{% endblock %}

{% block javascript %}
    {% parent %}
    <script>

        $(document).ready(function () {
            animateTable();
            bindDeleteModal();
        });

        function bindDeleteModal(){
            $(".delete-link").click(function(event){
                event.preventDefault();
                var vhostid = $(this).attr("data-vhost-id");
                $("#delete-modal-button").attr("href","/delete/"+vhostid);
                $("#delete-modal").openModal();
            })
        }

        function animateTable() {
            $("#table-vhosts tbody").fadeIn(2000,function(){
                $("#table-vhosts").toggleClass("visible");
            });
        }

        function finishedData(data, stat, xhr) {
            $("#table-vhosts tbody").html(data);
            $("#loader").fadeOut(400, function () {
                animateTable()
                bindDeleteModal();
            });
        }

        $("#ignoredCheckbox").change(function () {
            var checkbox = this;
            $("#table-vhosts tbody").fadeOut(400, function () {
                $("#loader").fadeIn(400,function(){
                    if ($(checkbox).is(":checked")) {
                        $.ajax("/?ignored=true", {
                            success: finishedData
                        })
                    } else {
                        $.ajax("/?ignored=false", {
                            success: finishedData
                        })
                    }
                });
            });
        });
    </script>
{% endblock %}

