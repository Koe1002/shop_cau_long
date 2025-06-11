function XuatThongTin() {
    const f = document.getElementById("F1");
    const thongTin = `
<div class="d-block m-auto">
    <h3>Thông tin người gửi</h3>
    <p><strong>Người gửi:</strong> ${f.nguoiGui.value}</p>
    <p><strong>Email:</strong> ${f.emailGui.value}</p>
    <p><strong>Điện thoại:</strong> ${f.dienThoaiGui.value}</p>
    <h3 >Thông tin người nhận</h3>
    <p><strong>Người nhận:</strong> ${f.nguoiNhan.value}</p>
    <p><strong>Điện thoại:</strong> ${f.dienThoaiNhan.value}</p>
    <p><strong>Địa chỉ:</strong> ${f.diaChi.value}</p>
    <p><strong>Tỉnh/TP:</strong> ${f.tinh.value}</p>
    <p><strong>Quận:</strong> ${f.quan.value}</p>
    
        <a href="index.html" class="empty-cart--btn btn d-inline-block ">
            <i class="fas fa-arrow-left me-2"></i>
            Tiếp tục mua sắm
        </a>
    
</div>
`;

    document.getElementById("output").innerHTML = thongTin;
}
