<%- include("../partials/header")%>

<div id="main" class="main container mb-5">
    <div class="row d-flex justify-content-center my-4">
        <div class="col-12 py-5 d-flex justify-content-center desc">
            <% if (deletion.completed == true) { %>
                <h6>Τα στοιχεία έχουν διαγραφεί με επιτυχία </h6>
            <%}else{ %>
                <h6>Τα στοιχεία δεν έχουν διαγραφεί ακόμα. Παρακαλώ περιμένετε </h6>
            <% } %>        
        </div>
        <div class="col-12 py-5 d-flex justify-content-center desc">
            <h6><b>'Ωρα αιτήματος</b>: <%= deletion.date %></h6>    
        </div>
    </div>            
</div>

<%- include("../partials/footer")%>
