$(() => {
  $('.js-gallery').slick({
    arrows: false,
    swipe: false,
    dots: true,
    infinite: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000
  });

  $('.js-slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.js-slider-nav'
  });

  $('.js-slider-nav').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    asNavFor: '.js-slider-for',
    dots: false,
    centerMode: false,
    focusOnSelect: true,
    prevArrow: $('.js-slider-nav-prev'),
    nextArrow: $('.js-slider-nav-next')
  });

  $('.js-product-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    dots: false,
    focusOnSelect: true,
    prevArrow: $('.js-product-slider-prev'),
    nextArrow: $('.js-product-slider-next')
  })
});
