$(document).ready(function() {
    $("#image").click(function() {
        // Toggle the contact section to appear fixed in the top-right corner
        $(".introduction").css({
            "position": "fixed",
            "top": "20px",
            "right": "18%",
            "background-color": "#2f3d55",
            "padding": "10px",
            "color": "white",
            "box-shadow": "0 0 10px rgba(0, 0, 0, 0.5)",
            "z-index": "1000",
            "display": "block"
        });
    });
});