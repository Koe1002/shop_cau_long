// Xử lý đăng ký
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("regUsername").value.trim();
            if (username) {
                localStorage.setItem("username", username);
                updateNavbar();
                const registerModal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
                registerModal.hide();
            }
        });
    }

    // Cập nhật navbar khi tải trang
    updateNavbar();
});

// Cập nhật hiển thị trên thanh điều hướng
function updateNavbar() {
    const accountLink = document.getElementById("accountLink");
    const username = localStorage.getItem("username");

    if (accountLink) {
        if (username) {
            accountLink.innerHTML = `<i class="fas fa-user"></i> Xin chào, ${username} <span class="ms-2 text-decoration-underline" style="cursor:pointer" id="logoutBtn">[Đăng xuất]</span>`;
            accountLink.removeAttribute("data-bs-toggle");
            accountLink.removeAttribute("data-bs-target");
        } else {
            accountLink.innerHTML = `<i class="fas fa-user"></i> Tài khoản`;
            accountLink.setAttribute("data-bs-toggle", "modal");
            accountLink.setAttribute("data-bs-target", "#loginModal");
        }
    }
}

// Đăng xuất
document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "logoutBtn") {
        localStorage.removeItem("username");
        updateNavbar();
    }
});
