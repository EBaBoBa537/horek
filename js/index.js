const dialog = document.querySelector('#dialog');


function open_dialog() {
    dialog.style.display = 'flex';
    dialog.showModal();
    input_tel.value = '';
    input_email.value = '';
    hideError();
}

function close_dialog() {
    dialog.close();
    dialog.style.display = 'none';
}




// document.querySelector('#button-log-in').addEventListener('click', function() {
//     open_dialog();
// })

document.querySelector('#dialog-button-close').addEventListener('click', function() {
    close_dialog();
})

    // Слайдер 


document.addEventListener("DOMContentLoaded", function () {




    let slider_current_index = 0;
    let slider_container = document.querySelector('#slider-container');
    let slides_all = document.querySelectorAll('.slide');
    let slider_button_prev = document.querySelector('#button-slider-prev');
    let slider_button_next = document.querySelector('#button-slider-next');

    function updateSlider() {
        slider_container.style.transform = 'translateX(-' + (slider_current_index * 100) + '%)';
    }

    slider_button_next.addEventListener('click', function() {
        slider_current_index = (slider_current_index + 1) % slides_all.length;
        updateSlider();
    });

    slider_button_prev.addEventListener('click', function() {
        slider_current_index = (slider_current_index - 1 + slides_all.length) % slides_all.length;
        updateSlider();
    });

    setInterval(function() {
        slider_current_index = (slider_current_index + 1) % slides_all.length;
        updateSlider();
    }, 5000);

    updateSlider();


});



