window.addEventListener('scroll', function () {
    const header = document.querySelector('nav');
    if (window.scrollY > 1) {
        header.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.5), 0 1px 10px rgba(196, 196, 196, 0.2)';
    } else {
        header.style.boxShadow = 'none'; // revert to your CSS default
    }
})