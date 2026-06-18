export default function AboutPage() {
  return (
    <main className="container section">
      <div className="about-grid">
        {/* Story Column */}
        <div className="about-story animate-fade-in">
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
            Tentang Kedai Ubi Ungu
          </h1>
          <h3 style={{ fontWeight: 500, marginBottom: '2rem' }}>
            &quot;Menghadirkan Cita Rasa Nusantara dalam Kemasan Modern&quot;
          </h3>

          <p>
            Kedai Ubi Ungu lahir dari ide sederhana di bangku kuliah: bagaimana membuat bahan pangan lokal yang kaya manfaat, seperti ubi ungu, menjadi sajian kekinian yang digemari oleh anak muda dan keluarga modern.
          </p>

          <p>
            Ubi ungu tidak hanya dikenal dengan warnanya yang cantik alami, tetapi juga kaya akan antioksidan, serat, dan vitamin yang baik untuk kesehatan tubuh. Melalui riset dapur yang mendalam, kami berhasil memformulasikan resep-resep kue, brownies, dan keripik yang menjaga kebaikan nutrisi tersebut tanpa mengabaikan faktor rasa.
          </p>

          <p>
            Kami bangga bermitra langsung dengan para petani ubi ungu lokal di Jawa Barat untuk memastikan pasokan bahan baku yang segar dan berkualitas tinggi. Setiap pembelian produk Kedai Ubi Ungu turut membantu meningkatkan kesejahteraan rantai pasok pertanian lokal.
          </p>

          {/* Vision & Mission Grid */}
          <div className="about-vision-mission">
            <div className="vision-box">
              <h4>Visi Kami</h4>
              <p>
                Menjadi brand kuliner berbasis pangan lokal terdepan yang menginspirasi gaya hidup sehat dan modern.
              </p>
            </div>
            <div className="mission-box">
              <h4>Misi Kami</h4>
              <p>
                Mengembangkan olahan ubi ungu berkualitas tinggi, menyehatkan, serta memberdayakan ekonomi lokal secara berkelanjutan.
              </p>
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className="about-image animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <img src="/images/hero.png" alt="Produk Makanan Ubi Ungu Premium Kedai Ubi Ungu" />
        </div>
      </div>
    </main>
  );
}
