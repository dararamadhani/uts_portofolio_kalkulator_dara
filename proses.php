<?php
// Konfigurasi Database
$host = "localhost";
$user = "root";       // Username bawaan Laragon
$pass = "";           // Password bawaan Laragon (kosongkan)
$db   = "portfolio_kontak"; // Nama database

// Membuka Koneksi
$koneksi = mysqli_connect($host, $user, $pass, $db);

// Cek apakah koneksi berhasil
if (!$koneksi) {
    die("Aduh, gagal nyambung ke database: " . mysqli_connect_error());
}

// Menangkap Data dari Form (metode POST)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Tangkap data dari atribut 'name' di file index.php
    // Fungsi mysqli_real_escape_string digunakan agar aman dari kutip error
    $nama  = mysqli_real_escape_string($koneksi, $_POST['nama_input']);
    $email = mysqli_real_escape_string($koneksi, $_POST['email_input']);
    $pesan = mysqli_real_escape_string($koneksi, $_POST['pesan_input']);

    // Perintah SQL untuk memasukkan data
    // Catatan: 'id' dan 'created_at' tidak perlu diisi karena sudah otomatis (Auto Increment & Current Timestamp)
    $query = "INSERT INTO messages (name, email, message) VALUES ('$nama', '$email', '$pesan')";

    // 5. Eksekusi Perintah dan Cek Hasilnya
    if (mysqli_query($koneksi, $query)) {
        echo "<h3>Yeay! Pesan dari $nama berhasil dikirim ke database.</h3>";
        echo "<a href='index.php'>Kembali ke Form</a>";
    } else {
        echo "Waduh, ada error: " . mysqli_error($koneksi);
    }
}

// 6. Tutup Koneksi
mysqli_close($koneksi);
?>