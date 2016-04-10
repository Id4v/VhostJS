<tr class="filters">
    <td class="input-field">
        <input type="text" name="name" placeholder="Nom" value="{{ filters.name }}">
    </td>
    <td class="input-field">
        <input type="text" name="url" placeholder="url" value="{{ filters.url }}">
    </td>
    <td class="input-field">
        <input type="text" name="documentRoot" placeholder="Chemin" value="{{ filters.documentRoot }}">
    </td>
    <td class="input-field">

    </td>
</tr>

<script type="text/javascript">
    $(".filters input").keyup(function(){
        var name,url,docRoot;
        var filters={}

        name = $(".filters input[name='name']").val()
        url = $(".filters input[name='url']").val()
        docRoot = $(".filters input[name='documentRoot']").val()

        if(name){
            filters.name=name
        }

        if(url){
            filters.url=url
        }

        if(docRoot){
            filters.documentRoot=docRoot
        }


        $.ajax("/",{
            data: filters,
            method: "POST",
            success: finishedData
        })
    })
</script>