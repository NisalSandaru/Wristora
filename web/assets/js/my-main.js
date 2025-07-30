


////brand 
//const brandLinks = document.querySelectorAll('.brand-link');
//
//brandLinks.forEach(link => {
//    link.addEventListener('click', function (e) {
//        e.preventDefault();
//        brandLinks.forEach(l => l.classList.remove('selected-brand'));
//        this.classList.add('selected-brand');
//    });
//});
//
////brand 
//const conditionLinks = document.querySelectorAll('.condition-link');
//
//conditionLinks.forEach(link => {
//    link.addEventListener('click', function (e) {
//        e.preventDefault();
//        conditionLinks.forEach(l => l.classList.remove('selected-condition'));
//        this.classList.add('selected-condition');
//    });
//});



//price range
$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 10000000,
        values: [0, 10000000],
        slide: function (event, ui) {
            $("#amount").val("Rs " + ui.values[0].toLocaleString() + " - Rs " + ui.values[1].toLocaleString());
        }
    });

    // Set initial displayed value
    $("#amount").val(
            "Rs " +
            $("#slider-range").slider("values", 0).toLocaleString() +
            " - Rs " +
            $("#slider-range").slider("values", 1).toLocaleString()
            );
});


/////////////////////togle
const chevron = document.getElementById("brand-chevron");
const collapse = document.getElementById("brandCollapse");

collapse.addEventListener('show.bs.collapse', () => {
    chevron.classList.remove("bi-chevron-right");
    chevron.classList.add("bi-chevron-down");
});

collapse.addEventListener('hide.bs.collapse', () => {
    chevron.classList.remove("bi-chevron-down");
    chevron.classList.add("bi-chevron-right");
});

// ---------- CONDITION Section ----------
const conditionChevron = document.getElementById("condition-chevron");
const conditionCollapse = document.getElementById("conditionCollapse");

conditionCollapse.addEventListener('show.bs.collapse', () => {
  conditionChevron.classList.remove("bi-chevron-right");
  conditionChevron.classList.add("bi-chevron-down");
});

conditionCollapse.addEventListener('hide.bs.collapse', () => {
  conditionChevron.classList.remove("bi-chevron-down");
  conditionChevron.classList.add("bi-chevron-right");
});

// ---------- PRICE Section ----------
const priceChevron = document.getElementById("price-chevron");
const priceCollapse = document.getElementById("priceCollapse");

priceCollapse.addEventListener('show.bs.collapse', () => {
  priceChevron.classList.remove("bi-chevron-right");
  priceChevron.classList.add("bi-chevron-down");
});

priceCollapse.addEventListener('hide.bs.collapse', () => {
  priceChevron.classList.remove("bi-chevron-down");
  priceChevron.classList.add("bi-chevron-right");
});

// ---------- COLOR Section ----------
const colorChevron = document.getElementById("color-chevron");
const colorCollapse = document.getElementById("colorCollapse");

colorCollapse.addEventListener('show.bs.collapse', () => {
  colorChevron.classList.remove("bi-chevron-right");
  colorChevron.classList.add("bi-chevron-down");
});

colorCollapse.addEventListener('hide.bs.collapse', () => {
  colorChevron.classList.remove("bi-chevron-down");
  colorChevron.classList.add("bi-chevron-right");
});


/////////////end toggle