function loadDescription(fileName) {
    fetch(`txt/${fileName}`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('description1').innerText = data;
      })
      .catch(error => console.log('Error loading file:', error));
  }



  $(document).ready(function() {
    // Event listener for clicks on the semester project links
    $('.load-project').click(function(event) {
      event.preventDefault(); // Prevent default link behavior (e.g., page reload)
  
      // Get the project file name from the data-project attribute
      var projectFile = $(this).data('project');
  
      // Use AJAX to load the content from the corresponding file
      $.ajax({
        url: projectFile, // File to be loaded
        success: function(data) {
          // Display the loaded project description inside the #project-description div
          $('#project-description').html(data);
        },
        error: function() {
          // If the file cannot be loaded, show an error message
          $('#project-description').html('<p>Project description could not be loaded.</p>');
        }
      });
    });
  });


  $(document).ready(function () {
    // Event handler for description buttons
    $('.load-description').click(function () {
        const projectFile = $(this).data('project'); // Get the project filename

        // Perform AJAX request to fetch the project description
        $.ajax({
            url: projectFile,
            dataType: 'text', // Expecting text data
            success: function (data) {
                // On success, populate the corresponding description content
                $(this).siblings('.description-content').html(data);
            }.bind(this), // Bind 'this' to maintain context inside success
            error: function () {
                // Handle error
                $(this).siblings('.description-content').html('<p>Error loading description.</p>');
            }.bind(this)
        });
    });
});

  