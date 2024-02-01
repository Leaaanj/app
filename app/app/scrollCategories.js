document.addEventListener("DOMContentLoaded", function () {
    
    
   
  });
  
  function scrollCategories(direction) {
    const container = document.querySelector('.category_grid');
    const scrollAmount = 300;
  
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }
  