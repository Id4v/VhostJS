<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Vhosts</title>
    <!--Import Google Icon Font-->
    <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="/public/css/style.css"  media="screen,projection"/>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!--Import jQuery before materialize.js-->
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
</head>
<body>
<div class="row">
<nav class="teal">
    <div class="nav-wrapper">
        <ul class="left hide-on-med-and-down">
            <li><a href="/sync" id="refresh-link"><i class="material-icons">refresh</i></a></li>
            <li><a href="/create" class="bigger"><i class="fa fa-plus"></i></a></li>
        </ul>
        <a href="/" class="brand-logo center">Vhosts</a>
        <ul class="right hide-on-med-and-down">
            <li><a class="bigger" href="/restart"><i class="fa fa-power-off"></i></a></li>
        </ul>
    </div>
</nav>
</div>
<div class="container">
    {% block flashes %}
        {% if flash %}
            {% set classes = "" %}
            {% if flash.type == "success" %}
                {% set classes = "teal accent-4" %}
            {% elseif flash.type == "error" %}
                {% set classes = "red accent-1" %}
            {% else %}
                {% set classes = "blue darken-1" %}
            {% endif %}
            <div class="row flash {{ classes }}">
                <p>{{ flash.message }}</p>
            </div>
        {% endif %}
    {% endblock %}

    {% block page_title %}

    {% endblock %}


    {% block content %}
    {% endblock %}
</div>
{% block javascript %}
    <script type="text/javascript" src="/public/bower/Materialize/dist/js/materialize.min.js"></script>

    <script type="text/javascript">
        $("#refresh-link").click(function(event){
            event.preventDefault();

            $.ajax($(this).attr("href"),{
               success:function(data,res,xhr){
                   document.location.reload();
               }
            });

        })
    </script>

    <script type="text/javascript">
        $(".flash").slideDown();
        setTimeout(function(){
            $(".flash").slideUp();
        },3000);
    </script>
{% endblock %}

</body>
</html>